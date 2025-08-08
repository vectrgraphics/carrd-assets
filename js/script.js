document.addEventListener('DOMContentLoaded', () => {
  const items   = Array.from(document.querySelectorAll('.carousel-item'));
  const nextBtn = document.querySelector('.chevron.right');
  const prevBtn = document.querySelector('.chevron.left');

  if (!items.length || !nextBtn || !prevBtn) {
    console.warn('Carousel wiring issue:', { items: items.length, nextBtn, prevBtn });
    return;
  }

  let currentIndex = items.findIndex(el => el.classList.contains('active'));
  if (currentIndex < 0) currentIndex = 0;
  items.forEach((el, i) => el.classList.toggle('active', i === currentIndex));

  function showSlide(newIndex, fromSide) {
    if (newIndex === currentIndex) return;

    const current = items[currentIndex];
    const next = items[newIndex];

    current.classList.remove('active','enter-left','enter-right');
    next.classList.remove('active','enter-left','enter-right');
    next.classList.add(fromSide === 'left' ? 'enter-left' : 'enter-right');

    void next.offsetWidth; // reflow

    next.classList.add('active');
    next.classList.remove('enter-left','enter-right');

	next.classList.add('enter-right');   // or enter-left
	void next.offsetWidth;               // reflow (critical)
	next.classList.add('active');
	next.classList.remove('enter-right','enter-left');

    currentIndex = newIndex;
  }

  nextBtn.addEventListener('click', () => {
    const i = (currentIndex + 1) % items.length;
    showSlide(i, 'right');
  });
  prevBtn.addEventListener('click', () => {
    const i = (currentIndex - 1 + items.length) % items.length;
    showSlide(i, 'left');
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