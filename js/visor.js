'use strict';
(() => {
  const t = window.Idiomas.t;
  // CATALOGO se carga desde js/catalogo.js antes de este archivo. Las páginas
  // de versiones y el inicio comparten el mismo visor y sus controles.
  const viewer = document.querySelector('#car-viewer');
  if (!viewer) return;
  const status = document.querySelector('#viewer-status');
  const error = document.querySelector('#viewer-error');
  const rotate = document.querySelector('#rotate-model');
  const mobileViewport = matchMedia('(max-width: 700px)');
  // camera-orbit recibe ángulo horizontal, ángulo vertical y distancia.
  // El porcentaje ajusta el encuadre al tamaño del modelo, no a metros reales.
  const fitDistance = () => (mobileViewport.matches ? '78%' : '75%');
  const resetOrbit = () => '35deg 75deg ' + fitDistance();
  viewer.setAttribute('camera-orbit', resetOrbit());
  mobileViewport.addEventListener('change', () => {
    viewer.cameraOrbit = resetOrbit();
  });
  let failureTimer;
  let statusText = 'Cargando modelo 3D…';
  const setText = (id, value) => {
    document.getElementById(id).textContent = t(value);
  };
  function loading() {
    clearTimeout(failureTimer);
    error.hidden = true;
    status.hidden = false;
    statusText = 'Cargando modelo 3D…';
    status.textContent = t(statusText);
    document.querySelector('.model-progress').hidden = false;
    // Un GLB puede tardar en conexiones lentas: el aviso no cancela la carga.
    failureTimer = setTimeout(() => {
      statusText = 'La carga está tardando más de lo habitual…';
      status.textContent = t(statusText);
    }, 20000);
  }
  function failed() {
    clearTimeout(failureTimer);
    status.hidden = true;
    error.hidden = false;
    document.querySelector('.model-progress').hidden = true;
  }
  loading();
  viewer.addEventListener('progress', (event) => {
    const progress = event.detail.totalProgress;
    document.querySelector('.model-progress span').style.width =
      progress * 100 + '%';
  });
  viewer.addEventListener('load', () => {
    clearTimeout(failureTimer);
    status.hidden = true;
    error.hidden = true;
    document.querySelector('.model-progress').hidden = true;
    document.querySelector('.showroom').dataset.modelLoaded = 'true';
  });
  viewer.addEventListener('error', failed);
  // Abrir el HTML con file:// puede bloquear la lectura del GLB.
  // El servidor local permite cargarlo mediante HTTP.
  if (location.protocol === 'file:') {
    failed();
    error.querySelector('p').textContent = t(
      'Abre el sitio con un servidor web para explorar el modelo 3D.',
    );
  }
  customElements.whenDefined('model-viewer').then(() => {
    // También cubre el caso en que el componente terminó de cargar antes
    // de que este archivo registrara sus eventos.
    if (viewer.loaded) {
      clearTimeout(failureTimer);
      status.hidden = true;
      error.hidden = true;
      document.querySelector('.model-progress').hidden = true;
      document.querySelector('.showroom').dataset.modelLoaded = 'true';
    }
  });
  setTimeout(() => {
    if (!customElements.get('model-viewer')) failed();
  }, 12000);
  document.querySelectorAll('[data-orbit]').forEach((button) => {
    button.addEventListener('click', () => {
      viewer.autoRotate = false;
      rotate.setAttribute('aria-pressed', 'false');
      // Conserva los ángulos de la vista elegida y adapta solo la distancia.
      viewer.cameraOrbit = button.dataset.orbit.replace(/\S+$/, fitDistance());
      viewer.cameraTarget = 'auto auto auto';
      viewer.fieldOfView = '30deg';
    });
  });
  rotate.addEventListener('click', () => {
    viewer.autoRotate = !viewer.autoRotate;
    rotate.setAttribute('aria-pressed', String(viewer.autoRotate));
  });
  document.querySelector('#reset-camera').addEventListener('click', () => {
    viewer.autoRotate = false;
    rotate.setAttribute('aria-pressed', 'false');
    viewer.cameraOrbit = resetOrbit();
    viewer.cameraTarget = 'auto auto auto';
    viewer.fieldOfView = '30deg';
  });
  document.querySelector('#retry-model').addEventListener('click', () => {
    if (location.protocol === 'file:') return;
    loading();
    const url = new URL(viewer.src, location.href);
    // Una URL distinta permite reintentar sin reutilizar una respuesta fallida.
    url.searchParams.set('retry', Date.now());
    viewer.src = url.href;
  });
  function updateCarText(car) {
    document
      .querySelector('.showroom')
      .setAttribute(
        'aria-label',
        t('Explorador del McLaren {name}', { name: car.nombre }),
      );
    setText('car-tag', car.etiqueta);
    setText('car-name', car.nombre);
    setText('car-description', car.descripcion);
    setText('car-power', car.potencia);
    setText('car-torque', car.par);
    setText('car-weight', car.peso);
    setText('car-engine', car.cilindrada + ' · ' + car.motor);
    setText(
      'weight-note',
      (car.id === 'gtr'
        ? 'Masa de competición declarada'
        : 'Masa en orden de marcha') + ' · Potencia en CV (PS), no bhp.',
    );
    for (const [id, text, href] of [
      [
        'model-source',
        t('Modelo McLaren {name}', { name: car.nombre }),
        car.modeloUrl,
      ],
      ['model-author', car.autor, car.autorUrl],
      ['model-license', car.licencia, car.licenciaUrl],
    ]) {
      const link = document.getElementById(id);
      link.textContent = text;
      link.href = href;
    }
    setText(
      'model-adaptation',
      window.PUBLICACION_OPTIMIZADA
        ? 'Copia optimizada para la web: geometría cuantizada y texturas WebP; archivos originales conservados.'
        : car.adaptacion || 'Sin modificaciones al archivo.',
    );
    viewer.alt = t('Modelo 3D interactivo del McLaren {name}', {
      name: car.nombre,
    });
  }
  document.querySelectorAll('[data-version]').forEach((button) => {
    button.addEventListener('click', () => {
      const car = window.CATALOGO.find(
        (item) => item.id === button.dataset.version,
      );
      if (document.querySelector('.showroom').dataset.currentVersion === car.id)
        return;
      // Cambia la ficha visible junto con el modelo, sin navegar a otra página.
      document
        .querySelectorAll('[data-version]')
        .forEach((tab) =>
          tab.setAttribute('aria-pressed', String(tab === button)),
        );
      document.querySelector('.showroom').dataset.currentVersion = car.id;
      document.querySelector('.showroom').dataset.modelLoaded = 'false';
      updateCarText(car);
      document.querySelector('#version-link').href = car.id + '.html';
      viewer.autoRotate = false;
      rotate.setAttribute('aria-pressed', 'false');
      viewer.cameraOrbit = resetOrbit();
      viewer.cameraTarget = 'auto auto auto';
      viewer.fieldOfView = '30deg';
      document.querySelector('#model-download').href = car.modelo;
      loading();
      // Asignar src inicia una carga asíncrona; el evento load retira el aviso.
      viewer.src = car.modelo;
    });
  });
  function updateLanguage() {
    const currentVersion =
      document.querySelector('.showroom').dataset.currentVersion;
    updateCarText(window.CATALOGO.find((car) => car.id === currentVersion));
    status.textContent = t(statusText);
    if (location.protocol === 'file:') {
      error.querySelector('p').textContent = t(
        'Abre el sitio con un servidor web para explorar el modelo 3D.',
      );
    }
  }
  // Traducir el visor conserva el modelo cargado, la cámara y la rotación.
  window.addEventListener('languagechange', updateLanguage);
  updateLanguage();
})();
