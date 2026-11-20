(() => {
  const launch = document.querySelector('.game-launch');
  const template = document.querySelector('#game-frame');
  const startInstructions = document.querySelector('#game-start-instructions');
  const instructions = document.querySelector('#game-instructions');
  if (!launch || !template || !startInstructions || !instructions) return;

  launch.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    const frame = template.content.querySelector('iframe').cloneNode(true);
    const title = frame.title;
    const translateTitle = () => {
      frame.title = window.portfolioTranslate?.(title) ?? title;
    };
    translateTitle();
    document.addEventListener('languagechange', translateTitle);
    startInstructions.hidden = true;
    instructions.hidden = false;
    launch.replaceWith(frame);
    frame.focus();
  });
})();
