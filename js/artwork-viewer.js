(() => {
  const viewer = document.querySelector('.artwork-viewer');
  if (typeof viewer?.showModal !== 'function') return;

  const previews = [...document.querySelectorAll('.artwork-preview')];
  const image = viewer.querySelector('img');
  const caption = viewer.querySelector('figcaption');
  let activeIndex = 0;
  let opener;
  let touchStart;

  function showArtwork(index) {
    activeIndex = (index + previews.length) % previews.length;
    const preview = previews[activeIndex];
    image.alt = preview.querySelector('img').alt;
    image.src = preview.href;
    const title = preview.closest('figure').querySelector('figcaption').textContent;
    caption.textContent = `${activeIndex + 1} / ${previews.length} · ${title}`;
  }

  previews.forEach((preview, index) => {
    const captionLink = preview.closest('figure').querySelector('figcaption a');
    function openArtwork(event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = event.currentTarget;
      showArtwork(index);
      viewer.showModal();
    }
    preview.addEventListener('click', openArtwork);
    if (captionLink.href === preview.href) captionLink.addEventListener('click', openArtwork);
  });

  viewer.querySelectorAll('[data-artwork-step]').forEach(button => {
    button.addEventListener('click', () => showArtwork(activeIndex + Number(button.dataset.artworkStep)));
  });

  viewer.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showArtwork(activeIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  });

  image.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 ? event.touches[0] : undefined;
  }, { passive: true });

  image.addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const horizontal = touch.clientX - touchStart.clientX;
    const vertical = touch.clientY - touchStart.clientY;
    touchStart = undefined;
    if (Math.abs(horizontal) >= 45 && Math.abs(horizontal) > Math.abs(vertical)) {
      showArtwork(activeIndex + (horizontal < 0 ? 1 : -1));
    }
  }, { passive: true });

  image.addEventListener('touchcancel', () => { touchStart = undefined; });
  viewer.addEventListener('close', () => {
    touchStart = undefined;
    opener?.focus();
  });
})();
