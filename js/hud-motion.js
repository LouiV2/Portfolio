const motionToggle = document.querySelector('.motion-toggle');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateMotionControl() {
  motionToggle.hidden = motionPreference.matches;
}

motionToggle.addEventListener('click', () => {
  const paused = document.documentElement.toggleAttribute('data-hud-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? 'Resume HUD motion' : 'Pause HUD motion';
});

motionPreference.addEventListener('change', updateMotionControl);
updateMotionControl();
