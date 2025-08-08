document.addEventListener('DOMContentLoaded', () => {
  let currentIndex = 0;
  const items = document.querySelectorAll('.carousel-item');
  const nextBtn = document.querySelector('.chevron.right');
  const prevBtn = document.querySelector('.chevron.left');

  // init
  items.forEach((it, i) => it.classList.toggle('active', i === 0));

  function showSlide(newIndex, dir) {
    if (newIndex === currentIndex) return;

    const current = items[currentIndex];
    const next = items[newIndex];

    // Immediately hide current (no slide-out)
    current.classList.remove('active');

    // Prep next off-screen on the chosen side
    next.classList.remove('active', 'enter-left', 'enter-right');
    next.classList.add(dir === 'next' ? 'enter-right' : 'enter-left');

    // Force reflow so the browser registers the off-screen start
    void next.offsetWidth;

    // Animate next into center & fade in
    next.classList.add('active');                  // goes to center (opacity 1)
    next.classList.remove('enter-left', 'enter-right');

    currentIndex = newIndex;                       // update immediately
  }

  nextBtn?.addEventListener('click', () => {
    showSlide((currentIndex + 1) % items.length, 'next');
  });

  prevBtn?.addEventListener('click', () => {
    showSlide((currentIndex - 1 + items.length) % items.length, 'prev');
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