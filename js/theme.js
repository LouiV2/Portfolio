(() => {
  const root = document.documentElement;
  // The inline head script applies the saved theme before the first paint.
  // This deferred script attaches the controls after the document is parsed.
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    function updateToggle() {
      const light = root.dataset.theme === 'light';
      toggle.setAttribute('aria-checked', String(light));
      toggle.textContent = (window.portfolioTranslate || ((text) => text))('Light mode');
    }

    toggle.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
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
