'use strict';

(() => {
  const t = window.Idiomas.t;
  // La misma colección por chasis alimenta esta galería y las fichas.
  // El Map permite consultar los datos de una unidad sin recorrer todo el listado.
  const versionNames = { calle: 'Calle', lm: 'LM', gt: 'GT', gtr: 'GTR' };
  const normalize = (value) =>
    String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  const chassisKey = (value) =>
    normalize(value).replace(/^#/, '').replace(/\s/g, '');
  const records = window.UNIDADES;
  const recordMap = new Map(records.map((record) => [record.chasis, record]));
  const photos = Object.values(window.IMAGENES_UNIDADES).flat();
  const version = document.querySelector('#gallery-version');
  const chassis = document.querySelector('#gallery-chassis');
  const search = document.querySelector('#gallery-search');
  const grid = document.querySelector('#gallery-grid');
  const dialog = document.querySelector('#photo-dialog');
  const fullImage = document.querySelector('#photo-image');
  let filtered = [];
  let currentIndex = 0;
  let swipeStart = null;

  function updateChassis() {
    // Al cambiar de versión, conserva el chasis elegido solo si sigue disponible.
    const previous = chassis.value;
    chassis.replaceChildren();
    const all = document.createElement('option');
    all.value = '';
    all.textContent = t('Todos');
    chassis.append(all);

    for (const record of records
      .filter(
        (item) => version.value === 'todas' || item.version === version.value,
      )
      .sort((a, b) =>
        a.chasis.localeCompare(b.chasis, 'es', { numeric: true }),
      )) {
      const option = document.createElement('option');
      option.value = record.chasis;
      option.textContent = record.chasis;
      chassis.append(option);
    }

    if ([...chassis.options].some((option) => option.value === previous)) {
      chassis.value = previous;
    }
  }

  function showPhoto(index) {
    if (!filtered.length) return;
    // La navegación vuelve al principio o al final dentro del resultado filtrado.
    currentIndex = (index + filtered.length) % filtered.length;
    const photo = filtered[currentIndex];
    fullImage.src = photo.src;
    fullImage.alt = t(photo.alt);
    document.querySelector('#photo-title').textContent =
      photo.chasis + ' · McLaren F1 ' + t(versionNames[photo.version]);
    document.querySelector('#photo-position').textContent =
      currentIndex + 1 + ' / ' + filtered.length;
    document.querySelector('#photo-record').href =
      'registro.html#' + encodeURIComponent(photo.chasis.replace(/^#/, ''));
    document.querySelector('#photo-source').href = photo.fuente;
    document.querySelector('#photo-original').href = photo.original;
    document.querySelector('#photo-previous').disabled = filtered.length < 2;
    document.querySelector('#photo-next').disabled = filtered.length < 2;
    if (!dialog.open) dialog.showModal();
  }

  function render() {
    // El filtro actúa sobre fotografías: una unidad puede aportar varias vistas.
    const query = normalize(search.value);
    filtered = photos.filter((photo) => {
      const record = recordMap.get(photo.chasis);
      return (
        (version.value === 'todas' || photo.version === version.value) &&
        (!chassis.value || photo.chasis === chassis.value) &&
        normalize(
          [
            photo.chasis,
            window.Idiomas.searchText(versionNames[photo.version]),
            window.Idiomas.searchText(record?.color || ''),
            window.Idiomas.searchText(record?.decoracion || ''),
            record?.anio || '',
          ].join(' '),
        ).includes(query)
      );
    });
    grid.replaceChildren();

    filtered.forEach((photo, index) => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-card';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-open';
      button.setAttribute(
        'aria-label',
        t('Ampliar imagen del chasis {chassis}', { chassis: photo.chasis }),
      );
      const image = document.createElement('img');
      image.src = photo.src;
      image.alt = t(photo.alt);
      // Las miniaturas fuera de pantalla se cargan cuando hacen falta,
      // evitando descargar toda la colección al entrar en la galería.
      image.loading = 'lazy';
      image.decoding = 'async';
      const error = document.createElement('span');
      error.className = 'gallery-error';
      error.textContent = t('No se pudo cargar esta imagen.');
      error.hidden = true;
      image.addEventListener('error', () => {
        image.hidden = true;
        error.hidden = false;
      });
      button.append(image, error);
      button.addEventListener('click', () => showPhoto(index));
      const caption = document.createElement('figcaption');
      const name = document.createElement('strong');
      name.textContent = photo.chasis;
      const label = document.createElement('span');
      label.textContent = t(versionNames[photo.version]);
      caption.append(name, label);
      figure.append(button, caption);
      grid.append(figure);
    });

    const count = new Set(filtered.map((photo) => photo.chasis)).size;
    document.querySelector('#gallery-count').textContent =
      t(filtered.length === 1 ? '{count} imagen' : '{count} imágenes', {
        count: filtered.length,
      }) +
      ' · ' +
      t(count === 1 ? '{count} unidad' : '{count} unidades', { count });
    document.querySelector('#gallery-empty').hidden = filtered.length > 0;
  }

  const parameters = new URLSearchParams(location.search);
  // Permite enlazar una selección concreta, por ejemplo ?chasis=58F1GT.
  const initialVersion = parameters.get('version');
  if (Object.hasOwn(versionNames, initialVersion))
    version.value = initialVersion;
  updateChassis();
  const initialChassis = records.find(
    (record) =>
      chassisKey(record.chasis) === chassisKey(parameters.get('chasis') || ''),
  );
  if (initialChassis) {
    version.value = initialChassis.version;
    updateChassis();
    chassis.value = initialChassis.chasis;
  }

  version.addEventListener('change', () => {
    updateChassis();
    render();
  });
  chassis.addEventListener('change', render);
  search.addEventListener('input', render);
  document
    .querySelector('#gallery-filters')
    .addEventListener('submit', (event) => event.preventDefault());
  document.querySelector('#gallery-filters').addEventListener('reset', () => {
    // Espera a que el formulario complete su restablecimiento nativo.
    setTimeout(() => {
      version.value = 'todas';
      chassis.value = '';
      search.value = '';
      updateChassis();
      render();
    }, 0);
  });
  document
    .querySelector('#photo-close')
    .addEventListener('click', () => dialog.close());
  document
    .querySelector('#photo-previous')
    .addEventListener('click', () => showPhoto(currentIndex - 1));
  document
    .querySelector('#photo-next')
    .addEventListener('click', () => showPhoto(currentIndex + 1));
  const photoStage = document.querySelector('.photo-stage');
  // Solo un desplazamiento táctil principalmente horizontal cambia la imagen.
  // Los toques cortos, el desplazamiento vertical y los botones no son un swipe.
  photoStage.addEventListener('pointerdown', (event) => {
    if (
      event.pointerType === 'touch' &&
      event.isPrimary &&
      !event.target.closest('button')
    ) {
      swipeStart = { x: event.clientX, y: event.clientY };
    }
  });
  photoStage.addEventListener('pointerup', (event) => {
    if (!swipeStart || event.pointerType !== 'touch') return;
    const distanceX = event.clientX - swipeStart.x;
    const distanceY = event.clientY - swipeStart.y;
    swipeStart = null;
    if (
      Math.abs(distanceX) > 50 &&
      Math.abs(distanceY) < Math.abs(distanceX) * 0.6
    ) {
      showPhoto(currentIndex + (distanceX < 0 ? 1 : -1));
    }
  });
  photoStage.addEventListener('pointercancel', () => {
    swipeStart = null;
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(currentIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('click', (event) => {
    // Comprueba los límites para distinguir el fondo exterior del propio diálogo.
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  window.addEventListener('languagechange', () => {
    updateChassis();
    render();
    if (dialog.open) showPhoto(currentIndex);
  });
  render();
})();
