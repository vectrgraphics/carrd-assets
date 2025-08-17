// script.js (drop-in)
document.addEventListener('DOMContentLoaded', () => {
  const stage  = document.querySelector('.carousel');
  const items  = Array.from(document.querySelectorAll('.carousel-item'));
  const nextBtn = document.querySelector('.chevron.right');
  const prevBtn = document.querySelector('.chevron.left');

  if (!stage || !items.length || !nextBtn || !prevBtn) return;

  // 1) Auto-tag icons so CSS can color & mask them (works across all slides)
  autoTagIcons();

  const n = items.length;
  let index = items.findIndex(el => el.classList.contains('active'));
  if (index < 0) index = 0;

  // 2) Position slides: center (active), neighbors (left/right), others (off)
  function layout(i) {
    const prev = (i - 1 + n) % n;
    const next = (i + 1) % n;

    items.forEach((el, k) => {
      el.classList.remove('left','right','active','off');
      if (k === i) el.classList.add('active');
      else if (k === prev) el.classList.add('left');
      else if (k === next) el.classList.add('right');
      else el.classList.add('off');
    });

    updateChevronY(); // keep arrows vertically centered on the active slide
  }

  // 3) Keep chevrons vertically centered on the active cover
  function updateChevronY() {
    const active = items[index];
    const ar = active.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const centerY = ar.top - sr.top + ar.height / 2;
    stage.style.setProperty('--chev-y', centerY + 'px');
  }

  // 4) Navigation (throttled to match CSS duration)
  let busy = false;
  const DURATION = 600; // keep in sync with CSS --slide-ms
  function go(dir) {
    if (busy) return;
    busy = true;
    index = (index + (dir > 0 ? 1 : -1) + n) % n;
    layout(index);
    setTimeout(() => { busy = false; }, DURATION);
  }

  // Init
  layout(index);
  updateChevronY();
  window.addEventListener('resize', updateChevronY);
  window.addEventListener('load', updateChevronY);

  nextBtn.addEventListener('click', () => go(1));
  prevBtn.addEventListener('click', () => go(-1));

  // Swipe (mobile)
  let startX = 0;
  stage.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; }, { passive: true });
  stage.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].screenX - startX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  }, { passive: true });

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