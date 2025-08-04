let slideIndex = 0;
showSlides(slideIndex);

document.querySelector('.prev').addEventListener('click', () => {
  showSlides(slideIndex -= 1);
});

document.querySelector('.next').addEventListener('click', () => {
  showSlides(slideIndex += 1);
});

function showSlides(n) {
  let slides = document.getElementsByClassName("slide");
  if (n >= slides.length) {slideIndex = 0}
  if (n < 0) {slideIndex = slides.length - 1}
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex].style.display = "block";
}
