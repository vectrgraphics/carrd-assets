// map chevrons to the side the NEXT slide comes from
nextBtn?.addEventListener('click', () => {
  const i = (currentIndex + 1) % items.length;
  showSlide(i, 'right');        // right chevron => enter from RIGHT
});
prevBtn?.addEventListener('click', () => {
  const i = (currentIndex - 1 + items.length) % items.length;
  showSlide(i, 'left');         // left chevron => enter from LEFT
});

function showSlide(newIndex, fromSide) {
  if (newIndex === currentIndex) return;
  const current = items[currentIndex];
  const next = items[newIndex];

  current.classList.remove('active'); // no slide-out
  next.classList.remove('active','enter-left','enter-right');
  next.classList.add(fromSide === 'left' ? 'enter-left' : 'enter-right');

  void next.offsetWidth;              // <-- critical reflow

  next.classList.add('active');       // slide/fade to center
  next.classList.remove('enter-left','enter-right');
  currentIndex = newIndex;
}


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