document.addEventListener('DOMContentLoaded', () => {
  let currentIndex = 0;
  const items = document.querySelectorAll('.carousel-item');
  const nextBtn = document.querySelector('.chevron.right'); // go forward
  const prevBtn = document.querySelector('.chevron.left');  // go backward

  // init
  items.forEach((it, i) => it.classList.toggle('active', i === 0));

  function showSlide(newIndex, fromSide) {
    if (newIndex === currentIndex) return;

    const current = items[currentIndex];
    const next = items[newIndex];

    // Hide current immediately (no slide-out)
    current.classList.remove('active');

    // Prep next off-screen on chosen side, then animate in
    next.classList.remove('active', 'enter-left', 'enter-right');
    next.classList.add(fromSide === 'left' ? 'enter-left' : 'enter-right');

    // Force reflow so the starting transform is registered
    void next.offsetWidth;

    next.classList.add('active');                 // moves to center + fades in
    next.classList.remove('enter-left', 'enter-right');

    currentIndex = newIndex;
  }

  // Right chevron: incoming from the RIGHT → moves right→left
  nextBtn?.addEventListener('click', () => {
    const newIndex = (currentIndex + 1) % items.length;
    showSlide(newIndex, 'right');
  });

  // Left chevron: incoming from the LEFT → moves left→right
  prevBtn?.addEventListener('click', () => {
    const newIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(newIndex, 'left');
  });
});



let touchStartX = 0;
let touchEndX = 0;

const swipeThreshold = 50; // Minimum px distance to qualify as swipe

const carousel = document.querySelector('.carousel'); // or your outer container

carousel.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
});

function handleSwipeGesture() {
  const deltaX = touchEndX - touchStartX;

  if (Math.abs(deltaX) > swipeThreshold) {
    if (deltaX > 0) {
      // Swiped right
      document.querySelector('.chevron.left').click();
    } else {
      // Swiped left
      document.querySelector('.chevron.right').click();
    }
  }
}