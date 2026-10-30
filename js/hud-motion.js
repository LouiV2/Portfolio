const motionToggle = document.querySelector('.motion-toggle');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateMotionControl() {
  motionToggle.hidden = motionPreference.matches;
  const paused = document.documentElement.hasAttribute('data-hud-paused');
  motionToggle.textContent = window.portfolioTranslate(paused ? 'Resume HUD motion' : 'Pause HUD motion');
}

motionToggle.addEventListener('click', () => {
  const paused = document.documentElement.toggleAttribute('data-hud-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  updateMotionControl();
});

motionPreference.addEventListener('change', updateMotionControl);
document.addEventListener('languagechange', updateMotionControl);
updateMotionControl();
