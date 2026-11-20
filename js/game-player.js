(() => {
  const launch = document.querySelector('.game-launch');
  const template = document.querySelector('#game-frame');
  const instructions = document.querySelector('#game-instructions');
  if (!launch || !template || !instructions) return;

  launch.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    const frame = template.content.querySelector('iframe').cloneNode(true);
    instructions.textContent = 'Click inside the game to use the keyboard controls.';
    launch.replaceWith(frame);
    frame.focus();
  });
})();
