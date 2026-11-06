(() => {
  const header = document.querySelector('.site-header');
  const button = header.querySelector('.menu-toggle');
  const navigation = document.getElementById('main-navigation');
  const mobile = window.matchMedia('(max-width: 850px)');

  function setOpen(open) {
    button.setAttribute('aria-expanded', String(open));
    navigation.hidden = mobile.matches && !open;
  }

  function updateLayout() {
    const focused = document.activeElement;
    button.hidden = !mobile.matches;
    setOpen(false);
    if (mobile.matches && navigation.contains(focused)) button.focus();
    if (!mobile.matches && focused === button) navigation.querySelector('a').focus();
  }

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobile.matches && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
  navigation.addEventListener('click', event => {
    if (mobile.matches && event.target.closest('a')) setOpen(false);
  });
  mobile.addEventListener('change', updateLayout);
  updateLayout();
  header.dataset.navigationReady = '';
})();
