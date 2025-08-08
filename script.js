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

    // Prep next at the correct side
    next.classList.remove('active','exit-left','exit-right','enter-left','enter-right');
    next.classList.add(dir === 'next' ? 'enter-right' : 'enter-left');

    // Trigger a reflow so the browser registers the starting position
    void next.offsetWidth;

    // Animate current out & next in
    current.classList.remove('enter-left','enter-right');
    current.classList.add(dir === 'next' ? 'exit-left' : 'exit-right');
    next.classList.add('active');

    // Cleanup after transition
    const done = () => {
      current.classList.remove('exit-left','exit-right','active');
      next.classList.remove('enter-left','enter-right');
      current.removeEventListener('transitionend', done);
      currentIndex = newIndex;
    };
    current.addEventListener('transitionend', done, { once: true });
  }

  nextBtn?.addEventListener('click', () => {
    showSlide((currentIndex + 1) % items.length, 'next');
  });
  prevBtn?.addEventListener('click', () => {
    showSlide((currentIndex - 1 + items.length) % items.length, 'prev');
  });

  // (Optional) keep your swipe handlers; they can call the same showSlide
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