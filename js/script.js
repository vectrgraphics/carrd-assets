let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const nextBtn = document.querySelector('.chevron.right');
function showSlide(newIndex) {
  if (newIndex === currentIndex) return;

  const currentSlide = slides[currentIndex];
  const nextSlide = slides[newIndex];

  // Prepare incoming slide
  nextSlide.classList.remove('exit-left');
  nextSlide.classList.add('active');

  // Animate current slide out
  currentSlide.classList.remove('active');
  currentSlide.classList.add('exit-left');


  // After transition, clean up
  setTimeout(() => {
    currentSlide.classList.remove('exit-left');
    currentIndex = newIndex;
  }, 1024);
}

nextBtn.addEventListener('click', () => {
  let newIndex = (currentIndex + 1) % slides.length;
  showSlide(newIndex);
});

prevBtn.addEventListener('click', () => {
  let newIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(newIndex);
});