// script.js — Safari-hardened carousel
document.addEventListener('DOMContentLoaded', () => {
  const stage   = document.querySelector('.carousel');
  const items   = Array.from(document.querySelectorAll('.carousel-item'));
  const nextBtn = document.querySelector('.chevron.right');
  const prevBtn = document.querySelector('.chevron.left');

  if (!stage || !items.length) return;

  // Allow nav buttons to be optional (don’t early return if missing)
  const hasNext = !!nextBtn;
  const hasPrev = !!prevBtn;

  // Auto-tag icons so CSS can color & mask them
  autoTagIcons();

  const n = items.length;
  let index = items.findIndex(el => el.classList.contains('active'));
  if (index < 0) index = 0;

  // Ensure the initially active slide is marked
  items.forEach((el, i) => el.classList.toggle('active', i === index));

  // --- Navigation handlers ---
  if (hasNext) nextBtn.addEventListener('click', () => go(1));
  if (hasPrev) prevBtn.addEventListener('click', () => go(-1));

  // Keyboard arrows
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });

  // Basic swipe (horizontal)
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
    index = (index + delta + n) % n;
    updateActive(true);
  }

  function updateActive(smooth = false) {
    items.forEach((el, i) => el.classList.toggle('active', i === index));
    centerActive({ smooth });
  }

  // --- Centering logic (Safari-hardened) ---
  function centerActive({ smooth = false } = {}) {
    const active = items[index];
    if (!active || !stage) return;

    // Compute how far the active item is from the horizontal center of the stage
    const stageRect = stage.getBoundingClientRect();
    const itemRect  = active.getBoundingClientRect();

    // delta is how much we need to scroll to bring active to center
    const delta = (itemRect.left - stageRect.left) - (stage.clientWidth / 2 - itemRect.width / 2);
    const target = Math.round(stage.scrollLeft + delta); // round to avoid sub-pixel issues in Safari

    if (typeof stage.scrollTo === 'function') {
      stage.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
    } else {
      stage.scrollLeft = target;
    }
  }

  window.addEventListener('resize', () => centerActive({ smooth: false }));

  // Initial center after layout (1 rAF), then after full load + an extra tick for Safari
  requestAnimationFrame(() => { centerActive({ smooth: false }); if (stage && stage.dataset) stage.dataset.ready = '1'; });
  window.addEventListener('load', () => {
    centerActive({ smooth: false });
    setTimeout(() => {
      centerActive({ smooth: false });
      if (stage && stage.dataset) stage.dataset.ready = "1"; // in case you use a visibility gate in CSS
    }, 0);
  });

  // --- helpers ---
  function autoTagIcons() {
    // Only relevant if some slides still use <img> icons.
    document.querySelectorAll('.music-links .icon').forEach(a => {
      const img = a.querySelector('img');
      if (!img) return;
      const src = (img.getAttribute('src') || '').toLowerCase();
           if (src.includes('apple_music')) a.classList.add('icon--apple_music');
      else if (src.includes('spotify'))    a.classList.add('icon--spotify');
      else if (src.includes('youtube_music')) a.classList.add('icon--youtube_music');
    });
  }

  // --- Inline external SVG sprite so <use href="#..."> is same-document ---
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
        // Create a container and parse
        var holder = document.createElement('div');
        holder.innerHTML = svgText.trim();

        // Grab the first <svg> element (ignore stray text nodes/comments)
        var svg = holder.querySelector('svg');
        if (!svg) throw new Error('Sprite has no <svg> root');

        // Hide and mark decorative
        svg.style.position = 'absolute';
        svg.style.width = '0';
        svg.style.height = '0';
        svg.style.overflow = 'hidden';
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');

        // Insert at top of <body>
        document.body.insertAdjacentElement('afterbegin', svg);

        // Add xlink:href fallbacks for older Safari if needed
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

  // If images are still decoding, recenter once they’re ready (prevents a tiny drift)
  if ('fonts' in document) {
    Promise.allSettled(
      Array.from(document.images).map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve())
    ).then(() => centerActive({ smooth: false }));
  }
});