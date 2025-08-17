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

  // Initial center after layout (1 rAF), then after full load + an extra tick for Safari
  requestAnimationFrame(() => centerActive({ smooth: false }));
  window.addEventListener('load', () => {
    centerActive({ smooth: false });
    setTimeout(() => {
      centerActive({ smooth: false });
      if (stage && stage.dataset) stage.dataset.ready = "1"; // in case you use a visibility gate in CSS
    }, 0);
  });

  // --- helpers ---
  function autoTagIcons() {
    document.querySelectorAll('.music-links .icon').forEach(a => {
      const img = a.querySelector('img');
      const src = (img?.getAttribute('src') || '').toLowerCase();
           if (src.includes('apple'))   a.classList.add('icon--apple');
      else if (src.includes('spotify')) a.classList.add('icon--spotify');
      else if (src.includes('youtube')) a.classList.add('icon--yt');
    });
  }
});
