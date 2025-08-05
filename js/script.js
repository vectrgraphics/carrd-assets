let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const nextBtn = document.querySelector('.arrow.right');
const prevBtn = document.querySelector('.arrow.left');

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
  }, 800);
}

nextBtn.addEventListener('click', () => {
  let newIndex = (currentIndex + 1) % slides.length;
  showSlide(newIndex);
});

prevBtn.addEventListener('click', () => {
  let newIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(newIndex);
});
