(() => {
  const root = document.documentElement;
  // The inline head script applies the saved theme before the first paint.
  // This deferred script attaches the controls after the document is parsed.
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stopTransition;

    function playThemeTransition() {
      stopTransition?.();
      if (motionPreference.matches || root.hasAttribute('data-hud-paused')) return;

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.className = 'theme-transition';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.append(canvas);

      const { width, height } = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(width * scale);
      canvas.height = Math.ceil(height * scale);
      context.scale(scale, scale);
      context.font = '14px Consolas, monospace';

      const spacing = 18;
      const duration = 600;
      const glyphs = '01アイウエオカキクケコサシスセソ';
      const columns = Array.from({ length: Math.ceil(width / spacing) }, () => ({
        offset: Math.random() * height * .8,
        speed: .8 + Math.random() * .6,
        trail: Array.from({ length: 12 }, () => glyphs[Math.floor(Math.random() * glyphs.length)])
      }));
      let frame;
      const start = performance.now();

      stopTransition = () => {
        cancelAnimationFrame(frame);
        canvas.remove();
        stopTransition = undefined;
      };

      function draw(now) {
        const progress = (now - start) / duration;
        if (progress >= 1) {
          stopTransition();
          return;
        }

        context.fillStyle = '#725000';
        context.fillRect(0, 0, width, height);
        columns.forEach(({ offset, speed, trail }, column) => {
          const head = Math.floor((offset + progress * height * speed) / spacing);
          trail.forEach((glyph, row) => {
            const y = (head - row) * spacing;
            if (y < 0 || y > height + spacing) return;
            context.fillStyle = row === 0 ? '#fde68a' : `rgba(250, 204, 21, ${.75 * (1 - row / trail.length)})`;
            context.fillText(glyph, column * spacing, y);
          });
        });
        canvas.style.opacity = String(1 - progress ** 2);
        frame = requestAnimationFrame(draw);
      }

      draw(start);
    }

    motionPreference.addEventListener('change', () => stopTransition?.());
    window.addEventListener('resize', () => stopTransition?.());

    function updateToggle() {
      const light = root.dataset.theme === 'light';
      const label = light ? 'Dark mode' : 'Light mode';
      toggle.textContent = window.portfolioTranslate?.(label) ?? label;
    }

    toggle.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
      playThemeTransition();
      root.dataset.theme = nextTheme;
      updateToggle();
      try {
        localStorage.setItem('portfolio-theme', root.dataset.theme);
      } catch {
        // Keep the selected theme for this page even without storage.
      }
    });
    document.addEventListener('languagechange', updateToggle);
    updateToggle();
    toggle.hidden = false;
  });
})();
