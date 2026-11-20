(() => {
  const form = document.querySelector('#sorting-demo');
  if (!form) return;

  const input = form.querySelector('#sorting-input');
  const algorithm = form.querySelector('#sorting-algorithm');
  const error = form.querySelector('#sorting-error');
  const results = form.querySelector('.sorting-results');
  const sorted = form.querySelector('#sorting-output');
  const position = form.querySelector('#sorting-position');
  const current = form.querySelector('#sorting-current');
  const previous = form.querySelector('#sorting-previous');
  const next = form.querySelector('#sorting-next');
  const translate = label => window.portfolioTranslate?.(label) ?? label;
  let passes = [];
  let pass = 0;

  function* insertionSort(values) {
    for (let index = 1; index < values.length; index++) {
      const key = values[index];
      let previousIndex = index - 1;
      while (previousIndex >= 0 && values[previousIndex] > key) {
        values[previousIndex + 1] = values[previousIndex];
        previousIndex--;
      }
      values[previousIndex + 1] = key;
      yield [...values];
    }
  }

  function* selectionSort(values) {
    for (let index = 0; index < values.length - 1; index++) {
      let smallest = index;
      for (let candidate = index + 1; candidate < values.length; candidate++) {
        if (values[candidate] < values[smallest]) smallest = candidate;
      }
      [values[index], values[smallest]] = [values[smallest], values[index]];
      yield [...values];
    }
  }

  function* bubbleSort(values) {
    for (let end = values.length - 1; end > 0; end--) {
      let swapped = false;
      for (let index = 0; index < end; index++) {
        if (values[index] > values[index + 1]) {
          [values[index], values[index + 1]] = [values[index + 1], values[index]];
          swapped = true;
        }
      }
      yield [...values];
      if (!swapped) return;
    }
  }

  const sorts = { insertion: insertionSort, selection: selectionSort, bubble: bubbleSort };
  const format = values => values.join(', ');

  function showPass() {
    position.textContent = pass === 0
      ? translate('Starting order')
      : translate('Pass {current} of {total}')
        .replace('{current}', pass)
        .replace('{total}', passes.length - 1);
    current.textContent = format(passes[pass]);
    previous.disabled = pass === 0;
    next.disabled = pass === passes.length - 1;
  }

  function update() {
    const text = input.value.trim();
    const values = text.split(/[\s,]+/).map(Number);
    const valid = /^[+-]?\d+(?:(?:\s*,\s*|\s+)[+-]?\d+)*$/.test(text)
      && values.length >= 5 && values.length <= 10
      && values.every(value => value >= -2147483648 && value <= 2147483647);
    input.setAttribute('aria-invalid', String(!valid));
    error.textContent = valid ? '' : translate('Enter 5 to 10 whole numbers in the 32-bit signed integer range.');
    error.hidden = valid;
    results.hidden = !valid;
    if (!valid) return;

    passes = [values, ...sorts[algorithm.value]([...values])];
    pass = 0;
    sorted.textContent = format(passes[passes.length - 1]);
    showPass();
  }

  input.addEventListener('input', update);
  algorithm.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  previous.addEventListener('click', () => { pass--; showPass(); });
  next.addEventListener('click', () => { pass++; showPass(); });
  document.addEventListener('languagechange', () => {
    if (results.hidden) {
      error.textContent = translate('Enter 5 to 10 whole numbers in the 32-bit signed integer range.');
    } else {
      showPass();
    }
  });

  update();
  form.hidden = false;
})();
