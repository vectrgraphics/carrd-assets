document.addEventListener('DOMContentLoaded', () => {
  const items   = Array.from(document.querySelectorAll('.carousel-item'));
  const nextBtn = document.querySelector('.chevron.right');
  const prevBtn = document.querySelector('.chevron.left');
  const stage   = document.querySelector('.carousel');

  if (!items.length || !nextBtn || !prevBtn) return; // safety

  const n = items.length;
  let index = items.findIndex(el => el.classList.contains('active'));
  if (index < 0) index = 0;

  // Apply positions: center (active), neighbors (left/right), others (off)
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
  }
  
function updateChevronY() {
  const active = items[index];
  const stage  = document.querySelector('.carousel');
  const ar = active.getBoundingClientRect();
  const sr = stage.getBoundingClientRect();
  const centerY = ar.top - sr.top + ar.height / 2;
  stage.style.setProperty('--chev-y', centerY + 'px');
}

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

layout(index);
updateChevronY();

window.addEventListener('resize', updateChevronY);
window.addEventListener('load', updateChevronY); // ensures correct after images/fonts

  layout(index); // initial placement

  // Prevent double-press during animation
  let busy = false;
  const DURATION = 600; // keep in sync with CSS --slide-ms

  function go(dir) {
    if (busy) return;
    busy = true;
    index = (index + (dir > 0 ? 1 : -1) + n) % n;
    layout(index);
    setTimeout(() => { busy = false; }, DURATION);
  }

  nextBtn.addEventListener('click', () => go(1));
  prevBtn.addEventListener('click', () => go(-1));

  // Swipe (mobile)
  let startX = 0;
  stage.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; }, { passive: true });
  stage.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].screenX - startX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  }, { passive: true });
});