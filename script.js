'use strict';

// Content and links work without JavaScript; enhance only the small-screen menu.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menuButton && navigation) {
  document.documentElement.classList.add('js-ready');
  menuButton.hidden = false;
  const setMenuOpen = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  };
  menuButton.addEventListener('click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
  const desktop = window.matchMedia('(min-width: 801px)');
  desktop.addEventListener('change', () => setMenuOpen(false));
}
document.querySelector('#year').textContent = String(new Date().getFullYear());
