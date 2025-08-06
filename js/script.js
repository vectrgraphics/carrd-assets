let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const nextBtn = document.querySelector('.chevron.right');
const prevBtn = document.querySelector('.chevron.left');
function showSlide(newIndex) {
  if (newIndex === currentIndex) return;

  const currentSlide = slides[currentIndex];
  const nextSlide = slides[newIndex];
  const prevSlide = slides[newIndex];

  // Prepare incoming slide
  nextSlide.classList.remove('exit-left');
  prevSlide.classList.remove('exit-right');
  nextSlide.classList.add('active');
  
  // Animate current slide out
  currentSlide.classList.remove('active');
  currentSlide.classList.add('exit-left');
  currentSlide.classList.add('exit-right');

  // After transition, clean up
  setTimeout(() => {
    currentSlide.classList.remove('exit-left');
    currentSlide.classList.remove('exit-right');
    currentIndex = newIndex;
  }, 1000);
}

nextBtn.addEventListener('click', () => {
  let newIndex = (currentIndex + 1) % slides.length;
  showSlide(newIndex);
});

prevBtn.addEventListener('click', () => {
  let newIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(newIndex);
});