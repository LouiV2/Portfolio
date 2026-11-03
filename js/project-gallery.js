(() => {
  const dialog = document.querySelector('.project-gallery');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const links = [...document.querySelectorAll('.project-screenshot a')];
  const image = dialog.querySelector('.gallery-image');
  const caption = dialog.querySelector('.gallery-caption');
  const count = dialog.querySelector('.gallery-count');
  const stage = dialog.querySelector('.gallery-stage');
  let current = 0;
  let touchStart = null;

  function show(index) {
    current = (index + links.length) % links.length;
    const source = links[current].querySelector('img');
    image.src = links[current].href;
    image.alt = source.alt;
    const project = links[current].closest('.code-project');
    caption.textContent = `${project.querySelector('h3').textContent} / ${links[current].closest('figure').querySelector('figcaption').textContent}`;
    count.textContent = `${current + 1} / ${links.length}`;
  }

  links.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    show(index);
    dialog.showModal();
    document.documentElement.classList.add('gallery-open');
  }));
  dialog.querySelector('.gallery-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.gallery-previous').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.gallery-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('gallery-open');
    touchStart = null;
  });
  stage.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touchStart || event.touches.length || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  document.addEventListener('languagechange', () => { if (dialog.open) show(current); });
})();
