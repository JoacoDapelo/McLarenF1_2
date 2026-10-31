'use strict';

(() => {
  const t = window.Idiomas.t;
  // El CSS oculta el menú móvil solo después de activar esta clase;
  // sin JavaScript, los enlaces de navegación siguen disponibles.
  document.documentElement.classList.add('js');

  const header = document.querySelector('header');
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('#site-navigation');
  const label = document.querySelector('.nav-toggle-label');
  const mobile = matchMedia('(max-width: 900px)');

  function setMenu(open, restoreFocus = false) {
    // aria-expanded comunica el estado al lector de pantalla y el atributo
    // del header activa la presentación del menú en css/estilos.css.
    toggle.setAttribute('aria-expanded', String(open));
    header.toggleAttribute('data-menu-open', open);
    label.textContent = t(open ? 'Cerrar' : 'Menú');
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a') && mobile.matches) setMenu(false);
  });

  document.addEventListener('click', (event) => {
    if (mobile.matches && !header.contains(event.target)) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      toggle.getAttribute('aria-expanded') === 'true'
    ) {
      // Al cerrar con el teclado, devuelve el foco al botón que abrió el menú.
      setMenu(false, true);
    }
  });

  mobile.addEventListener('change', () => setMenu(false));
  window.addEventListener('languagechange', () =>
    setMenu(toggle.getAttribute('aria-expanded') === 'true'),
  );

  const registryInfo = document.querySelector('.registry-info');
  if (registryInfo) {
    // Este corte coincide con el diseño de tarjetas de css/registro.css,
    // incluyendo los teléfonos usados en horizontal.
    const compactRegistry = matchMedia(
      '(max-width: 760px), (max-width: 900px) and (max-height: 600px)',
    );
    const updateInfo = () => {
      registryInfo.open = !compactRegistry.matches;
    };
    updateInfo();
    compactRegistry.addEventListener('change', updateInfo);
  }
})();
