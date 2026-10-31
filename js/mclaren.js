'use strict';
// Permite recorrer el selector de modelos también con las flechas del teclado.
const versionButtons = [...document.querySelectorAll('[data-version]')];
versionButtons.forEach((button, index) => {
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let target = index;
    if (event.key === 'ArrowLeft')
      target = (index - 1 + versionButtons.length) % versionButtons.length;
    if (event.key === 'ArrowRight')
      target = (index + 1) % versionButtons.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = versionButtons.length - 1;
    versionButtons[target].focus();
    versionButtons[target].click();
  });
});
