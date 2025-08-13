  (function () {
    const items = Array.from(document.querySelectorAll('.carousel-item'));
    const btnPrev = document.querySelector('.chevron.left');
    const btnNext = document.querySelector('.chevron.right');
    if (!items.length || !btnPrev || !btnNext) return;

    const n = items.length;
    let current = 0;
    let busy = false;

    function applyState() {
      items.forEach((el, i) => {
        el.classList.remove('is-active','is-prev','is-next','is-hidden');
        const prev = (current - 1 + n) % n;
        const next = (current + 1) % n;
        if (i === current) el.classList.add('is-active');
        else if (i === prev) el.classList.add('is-prev');
        else if (i === next) el.classList.add('is-next');
        else el.classList.add('is-hidden');
      });
    }

    function go(dir) {
      if (busy) return;
      busy = true;
      const newIndex = dir === 'right' ? (current + 1) % n : (current - 1 + n) % n;

      // Prep entering slide from the correct side
      const entering = items[newIndex];
      entering.classList.add(dir === 'right' ? 'enter-right' : 'enter-left');

      // Commit the new index & states
      current = newIndex;
      applyState();

      // Trigger the transition to center (remove the enter-* class next frame)
      requestAnimationFrame(() => {
        entering.classList.remove('enter-left','enter-right');
      });

      // Unlock after the CSS transition
      setTimeout(() => { busy = false; }, 520);
    }

    // Initial layout
    applyState();

    // Wire controls
    btnPrev.addEventListener('click', () => go('left'));
    btnNext.addEventListener('click', () => go('right'));

    // Optional: arrow keys
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go('left');
      if (e.key === 'ArrowRight') go('right');
    });
  })();