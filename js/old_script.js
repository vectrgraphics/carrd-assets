  let currentIndex = 0;
  const slides = document.querySelectorAll('.carousel-item');
  const nextBtn = document.querySelector('.chevron.right');
  const prevBtn = document.querySelector('.chevron.left');

  function showSlide(newIndex) {
    if (newIndex === currentIndex) return;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[newIndex];

    currentSlide.classList.remove('active');
    currentSlide.classList.add('exit-left');

    nextSlide.classList.add('active');
    nextSlide.classList.remove('exit-left');

    setTimeout(() => {
      currentSlide.classList.remove('exit-left');
      currentIndex = newIndex;
    }, 512);
  }

  nextBtn.addEventListener('click', () => {
    let newIndex = (currentIndex + 1) % slides.length;
    showSlide(newIndex);
  });

  prevBtn.addEventListener('click', () => {
    let newIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  });



slides.forEach((slide, i) => {
  slide.classList.remove('active');
  if (i === currentIndex) {
    slide.classList.add('active');
  }
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