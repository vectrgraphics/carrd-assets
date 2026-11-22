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
