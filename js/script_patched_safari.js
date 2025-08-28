// script.js — Safari-hardened carousel + cross-origin SVG sprite inliner
document.addEventListener('DOMContentLoaded', () => {
  const stage   = document.querySelector('.carousel');
  const items   = Array.from(document.querySelectorAll('.carousel-item'));
  const nextBtn = document.querySelector('.chevron.right');
  const prevBtn = document.querySelector('.chevron.left');

  if (!stage || !items.length) return;

  const hasNext = !!nextBtn;
  const hasPrev = !!prevBtn;

  autoTagIcons();

  const n = items.length;
  let index = items.findIndex(el => el.classList.contains('active'));
  if (index < 0) index = 0;
  
  const inIframe = (() => { try { return window.top !== window.self; } catch { return true; } })();
  const isSafari = /^((?!chrome|chromium|crios|fxios).)*safari/i.test(navigator.userAgent);

  // Ensure initial active
  items.forEach((el, i) => el.classList.toggle('active', i === index));

  stage.style.scrollSnapType = 'x mandatory';
  items.forEach(el => el.style.scrollSnapAlign = 'center');

  // Nav handlers
  if (hasNext) nextBtn.addEventListener('click', () => go(1));
  if (hasPrev) prevBtn.addEventListener('click', () => go(-1));

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });

  // Basic swipe
  let touchStartX = null;
  stage.addEventListener('touchstart', (e) => {
    const t = e.touches && e.touches[0];
    touchStartX = t ? t.clientX : null;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (touchStartX == null) return;
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - touchStartX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchStartX = null;
  }, { passive: true });

function go(delta) {
  const prev = index;
  index = (index + delta + n) % n;

  // detect wrap (end <-> start)
  const wrapped = (prev === n - 1 && index === 0) || (prev === 0 && index === n - 1);

  updateActive(!wrapped); // no smooth on wrap
}

function updateActive(smooth = false) {
  items.forEach((el, i) => el.classList.toggle('active', i === index));
  // give layout a tick for accurate measurements
  requestAnimationFrame(() => centerActive({ smooth }));
}

function centerActive({ smooth = false } = {}) {
  const active = items[index];
  if (!active || !stage) return;

  // Safari + iframe: compute real edge padding and let snap do the centering
  if (inIframe && isSafari) {
    // how much space on each side to truly center the active slide
    const edge = Math.max(0, (stage.clientWidth - active.offsetWidth) / 2);

    // override spacer pseudo-elements with explicit padding (iframe-safe)
    stage.style.paddingLeft  = edge + 'px';
    stage.style.paddingRight = edge + 'px';

    // ensure layout tick, then snap-center
    requestAnimationFrame(() => {
      void stage.scrollLeft; // reflow for Safari
      active.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: smooth ? 'smooth' : 'auto'
      });
    });
    return;
  }

  // --- default path for all other cases ---
  void stage.scrollLeft; // reflow
  const stageRect = stage.getBoundingClientRect();
  const itemRect  = active.getBoundingClientRect();
  const relativeLeft = itemRect.left - stageRect.left;
  const contentLeft  = relativeLeft + stage.scrollLeft;
  const itemCenter   = contentLeft + itemRect.width / 2;

  let target = Math.round(itemCenter - stage.clientWidth / 2);
  const max = Math.max(0, stage.scrollWidth - stage.clientWidth);
  if (target < 0) target = 0;
  else if (target > max) target = max;

  if (typeof stage.scrollTo === 'function') {
    stage.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
  } else {
    stage.scrollLeft = target;
  }
}

  window.addEventListener('resize', () => centerActive({ smooth: false }));

  // Initial centers (layout → load → extra tick for Safari)
  requestAnimationFrame(() => {
    centerActive({ smooth: false });
    if (stage && stage.dataset) stage.dataset.ready = '1';
  });
  window.addEventListener('load', () => {
    centerActive({ smooth: false });
    setTimeout(() => {
      centerActive({ smooth: false });
      if (stage && stage.dataset) stage.dataset.ready = '1';
    }, 0);
  });

  // Decode images then recenter once (prevents tiny drift on slow nets)
  Promise.allSettled(
    Array.from(document.images).map(img => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()))
  ).then(() => centerActive({ smooth: false }));

  // ---- Helpers
  function autoTagIcons() {
    // Only relevant if any slides still use <img> icons
    document.querySelectorAll('.music-links .icon').forEach(a => {
      const img = a.querySelector('img');
      if (!img) return;
      const src = (img.getAttribute('src') || '').toLowerCase();
           if (src.includes('apple_music')) a.classList.add('icon--apple_music');
      else if (src.includes('spotify')) a.classList.add('icon--spotify');
      else if (src.includes('youtube_music')) a.classList.add('icon--youtube_music');
    });
  }

  // ---- Inline external SVG sprite so <use href="#..."> is same-document
  (function loadSprite () {
    var SPRITE_URL = 'https://vectrgraphics.github.io/carrd-assets/images/icons/music-icons.svg';
    var root = document.documentElement;
    root.setAttribute('data-icons-ready', '0');

    fetch(SPRITE_URL, { mode: 'cors' })
      .then(function (res) {
        if (!res.ok) throw new Error('SVG sprite load failed: ' + res.status);
        return res.text();
      })
      .then(function (svgText) {
        var holder = document.createElement('div');
        holder.innerHTML = svgText.trim();

        var svg = holder.querySelector('svg');
        if (!svg) throw new Error('Sprite has no <svg> root');

        svg.style.position = 'absolute';
        svg.style.width = '0';
        svg.style.height = '0';
        svg.style.overflow = 'hidden';
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');

        document.body.insertAdjacentElement('afterbegin', svg);

        // xlink:href fallback for older Safari
        document.querySelectorAll('use[href^="#"]').forEach(function (u) {
          var id = u.getAttribute('href');
          if (id && !u.hasAttributeNS('http://www.w3.org/1999/xlink', 'href')) {
            u.setAttributeNS('http://www.w3.org/1999/xlink', 'href', id);
          }
        });

        root.setAttribute('data-icons-ready', '1');
      })
      .catch(function (err) {
        console.error(err);
        root.setAttribute('data-icons-ready', '1'); // fail-open
      });
  })();
});