let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const nextBtn = document.querySelector('.chevron.right');
const prevBtn = document.querySelector('.chevron.left');

function showSlide(newIndex) {
  if (newIndex === currentIndex) return;

  const currentSlide = slides[currentIndex];
  const incomingSlide = slides[newIndex];

  // Remove all transition classes from incoming slide
  incomingSlide.classList.remove('exit-left', 'exit-right');

  // Activate the incoming slide
  incomingSlide.classList.add('active');

  // Animate current slide out in the correct direction
  if (newIndex > currentIndex || (currentIndex === slides.length - 1 && newIndex === 0)) {
    currentSlide.classList.add('exit-left'); // Going forward
  } else {
    currentSlide.classList.add('exit-right'); // Going backward
  }

  // Remove active from current
  currentSlide.classList.remove('active');

  // After animation, clean up
  setTimeout(() => {
    currentSlide.classList.remove('exit-left', 'exit-right');
    currentIndex = newIndex;
  }, 1000); // match your CSS transition duration
}

nextBtn.addEventListener('click', () => {
  let newIndex = (currentIndex + 1) % slides.length;
  showSlide(newIndex);
});

prevBtn.addEventListener('click', () => {
  let newIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(newIndex);
});