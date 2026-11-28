// Warm Carrd's image cache after the main page loads, before gallery scrolling.
(() => {
  'use strict';
  function preloadGallery() {
    const urls = [...new Set(Array.from(document.querySelectorAll('#gallery01 img'), img => {
      const pending = img.getAttribute('data-src');
      return pending && pending !== 'done' ? pending : img.getAttribute('src');
    }).filter(url => url && !url.startsWith('data:')))];
    let next = 0;
    function loadNext() {
      if (next >= urls.length) return;
      const image = new Image();
      image.fetchPriority = 'low';
      image.onload = image.onerror = () => {
        image.onload = image.onerror = null;
        loadNext();
      };
      image.src = urls[next++];
    }
    // Limit background requests to avoid competing with other page content.
    for (let i = 0; i < Math.min(3, urls.length); i++) loadNext();
  }
  if (document.readyState === 'complete') preloadGallery();
  else window.addEventListener('load', preloadGallery, { once: true });
})();

// Display the featured artwork above the video on the Carrd homepage.
(() => {
  function showArtwork() {
    const video = document.querySelector('iframe[title="vectr.graphics video artwork"]');
    if (!video || document.getElementById('the-critical-line')) return;
    const artwork = document.createElement('img');
    artwork.id = 'the-critical-line';
    artwork.alt = 'The Critical Line — abstract artwork by vectr.graphics';
    artwork.width = 1152;
    artwork.height = 2048;
    artwork.style.cssText = 'display:block;width:min(100%,512px);height:auto;margin:36px auto';
    artwork.src = 'https://vectrgraphics.github.io/carrd-assets/the-critical-line.svg';
    video.parentElement.before(artwork);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showArtwork, { once: true });
  else showArtwork();
})();
