(() => {
  const root = document.documentElement;
  const page = document.querySelector('.projects-page, .skills-page, .home-page');
  if (!page || !('IntersectionObserver' in window)) return;

  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = [...page.querySelectorAll('.code-project, .skill-list article, .story-chapter')];
  if (!chapters.length) return;
  const links = [...page.querySelectorAll('.chapter-nav a')];
  const reveals = [...page.querySelectorAll('[data-reveal]')];
  let frame = 0;

  function motionEnabled() {
    return !preference.matches && !root.hasAttribute('data-hud-paused');
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(element => observer.observe(element));

  function update() {
    frame = 0;
    const enabled = motionEnabled();
    page.classList.toggle('story-motion', enabled);
    let current = 0;
    chapters.forEach((chapter, index) => {
      const rect = chapter.getBoundingClientRect();
      if (rect.top <= innerHeight * 0.45) current = index;
      if (enabled && rect.bottom > 0 && rect.top < innerHeight) {
        const progress = Math.max(0, Math.min(1,
          (innerHeight - rect.top) / (innerHeight + rect.height)));
        chapter.style.setProperty('--chapter-progress', progress.toFixed(4));
      }
    });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    const first = chapters[0].getBoundingClientRect();
    const last = chapters[chapters.length - 1].getBoundingClientRect();
    const progress = Math.max(0, Math.min(1,
      (innerHeight * 0.45 - first.top) / Math.max(1, last.bottom - first.top)));
    page.style.setProperty('--reading-progress', progress.toFixed(4));
  }

  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  addEventListener('scroll', scheduleUpdate, { passive: true });
  addEventListener('resize', scheduleUpdate);
  preference.addEventListener('change', update);
  new MutationObserver(update).observe(root, {
    attributes: true, attributeFilter: ['data-hud-paused']
  });
  // Anchor navigation and keyboard focus must always reveal their target content.
  page.addEventListener('focusin', event => {
    event.target.closest('[data-reveal]')?.classList.add('is-revealed');
  });
  update();
})();
