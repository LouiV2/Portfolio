(() => {
  const root = document.documentElement;
  let theme = 'dark';

  try {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') theme = savedTheme;
  } catch {
    // The toggle still works when browser storage is unavailable.
  }
  root.dataset.theme = theme;

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    function updateToggle() {
      const light = root.dataset.theme === 'light';
      toggle.setAttribute('aria-pressed', String(light));
      toggle.textContent = light ? 'Light mode: on' : 'Light mode: off';
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
    updateToggle();
    toggle.hidden = false;
  });
})();
