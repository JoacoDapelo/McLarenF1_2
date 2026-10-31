'use strict';
// js/datos.js aporta el registro; las imágenes se relacionan por chasis
// mediante IMAGENES_UNIDADES, definido en js/imagenes.js.
const records = window.UNIDADES;
const t = window.Idiomas.t;
const search = document.querySelector('#buscar');
const version = document.querySelector('#version');
const locationFilter = document.querySelector('#ubicacion');
const evolutionFilter = document.querySelector('#evolucion');
const evolutionContainer = document.querySelector('#filtro-evolucion');
const tbody = document.querySelector('#unidades');
const dialog = document.querySelector('#ficha');
const photoDialog = document.querySelector('#ficha-foto');
const enlargedPhoto = document.querySelector('#ficha-foto-imagen');
let activeRecord = null;
let activePhoto = null;
const versionNames = {
  calle: 'Calle',
  lm: 'LM',
  gt: 'GT',
  gtr: 'GTR',
};
const fields = {
  chasis: 'Chasis',
  version: 'Versión',
  tipo: 'Tipo de unidad',
  anio: 'Año / evolución',
  ordenFabricacion: 'Orden de fabricación documentado',
  color: 'Color exterior',
  interior: 'Interior',
  decoracion: 'Decoración / dorsal',
  dueno: 'Propietario o custodio documentado',
  estado: 'Estado documentado',
  choques: 'Incidentes documentados',
  vin: 'VIN',
  matricula: 'Matrícula documentada',
  ubicacion: 'Ubicación documentada',
  homologacion: 'Uso en carretera documentado',
  competicion: 'Historial de competición',
  referenciaHistorica: 'Referencia histórica',
  observaciones: 'Notas de la unidad',
  columna1: 'Observaciones',
  columna2: 'Información adicional',
  unidadesColor: 'Unidades de este color',
};
// Se ocultan los campos complementarios vacíos. VIN y otros datos básicos
// permanecen visibles como «Sin dato» para no confundir ausencia con certeza.
const optionalFields = new Set([
  'tipo',
  'anio',
  'ordenFabricacion',
  'decoracion',
  'matricula',
  'homologacion',
  'competicion',
  'referenciaHistorica',
  'observaciones',
  'columna1',
  'columna2',
  'unidadesColor',
]);
// Permite buscar sin distinguir mayúsculas ni tildes. El registro original
// se conserva; esta transformación se utiliza únicamente para comparar.
const normalize = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
const chassisKey = (value) =>
  normalize(value).replace(/^#/, '').replace(/\s/g, '');
const variantName = (record) =>
  record.version === 'gtr' && record.anio
    ? 'GTR ' + record.anio
    : t(versionNames[record.version] || record.version);
const colorDescription = (record) => {
  // En GTR se presentan juntos color, livery y dorsal; los datos de origen
  // siguen separados para poder conservar su significado y procedencia.
  const values = [record.color];
  if (record.version === 'gtr') values.push(record.decoracion);
  return (
    values
      .filter((value) => value && value !== '???')
      .map((value) => t(value))
      .join(' · ') ||
    record.color ||
    t('Sin dato')
  );
};
const versionOrder = ['calle', 'lm', 'gt', 'gtr'];
const sorted = [...records].sort((a, b) => {
  const group =
    versionOrder.indexOf(a.version) - versionOrder.indexOf(b.version);
  return group || a.chasis.localeCompare(b.chasis, 'es', { numeric: true });
});

function renderSummary() {
  const summary = document.querySelector('#resumen-versiones');
  summary.replaceChildren();
  for (const [key, label] of Object.entries(versionNames)) {
    const count = records.filter((record) => record.version === key).length;
    const item = document.createElement('span');
    item.textContent = t(label) + ': ' + count;
    summary.append(item);
  }
}
renderSummary();
for (const place of [
  ...new Set(
    records.map((r) => r.ubicacion.trim()).filter((p) => p && p !== '???'),
  ),
].sort((a, b) => a.localeCompare(b, 'es'))) {
  const option = document.createElement('option');
  option.value = place;
  option.textContent = t(place);
  locationFilter.append(option);
}
const initialVersion = new URLSearchParams(window.location.search).get(
  'version',
);
if (['calle', 'lm', 'gt', 'gtr'].includes(initialVersion))
  version.value = initialVersion;
function openPhoto(photo, record) {
  activePhoto = { photo, record };
  enlargedPhoto.src = photo.src;
  enlargedPhoto.alt = t(
    photo.alt || t('McLaren F1, chasis {chassis}', { chassis: record.chasis }),
  );
  document.querySelector('#ficha-foto-titulo').textContent = enlargedPhoto.alt;
  if (!photoDialog.open) photoDialog.showModal();
}
function openRecord(record) {
  activeRecord = record;
  // Reutiliza el mismo diálogo para cada unidad y sustituye su contenido;
  // así no quedan fotos ni referencias de la ficha abierta anteriormente.
  document.querySelector('#ficha-titulo').textContent = t('Chasis {chassis}', {
    chassis: record.chasis,
  });
  document.querySelector('#ficha-version').textContent = t(
    'FICHA DE UNIDAD / {version}',
    { version: variantName(record).toUpperCase() },
  );
  const gallery = document.querySelector('#ficha-galeria');
  gallery.replaceChildren();
  const photos = (window.IMAGENES_UNIDADES || {})[record.chasis] || [];
  gallery.hidden = photos.length === 0;
  for (const photo of photos) {
    const figure = document.createElement('figure');
    const enlargeButton = document.createElement('button');
    enlargeButton.type = 'button';
    enlargeButton.className = 'unit-photo-open';
    enlargeButton.setAttribute(
      'aria-label',
      t('Ampliar imagen del chasis {chassis}', { chassis: record.chasis }),
    );
    const image = document.createElement('img');
    image.src = photo.src;
    image.alt =
      photo.alt ||
      t('McLaren F1, chasis {chassis}', { chassis: record.chasis });
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      figure.hidden = true;
    });
    // El visor se abre sobre la ficha: al volver se conserva la unidad,
    // su posición de lectura y el foco en la miniatura seleccionada.
    enlargeButton.addEventListener('click', () => {
      openPhoto(photo, record);
    });
    enlargeButton.append(image);
    figure.append(enlargeButton);
    if (photo.credito) {
      const caption = document.createElement('figcaption');
      if (photo.fuente) {
        const source = document.createElement('a');
        source.href = photo.fuente;
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        source.textContent = t(photo.credito);
        caption.append(source);
      } else {
        caption.textContent = t(photo.credito);
      }
      figure.append(caption);
    }
    gallery.append(figure);
  }
  const list = document.querySelector('#ficha-datos');
  list.replaceChildren();
  for (const [key, label] of Object.entries(fields)) {
    if (optionalFields.has(key) && !record[key]) continue;
    if (key === 'decoracion' && record.version === 'gtr') continue;
    const term = document.createElement('dt');
    term.textContent = t(label);
    const detail = document.createElement('dd');
    detail.textContent =
      key === 'version'
        ? t(versionNames[record.version])
        : t(record[key] || 'Sin dato');
    if (key === 'color') detail.textContent = colorDescription(record);
    list.append(term, detail);
  }
  const source = document.querySelector('#ficha-fuente');
  source.replaceChildren();
  source.hidden = !record.fuente;
  if (record.fuente) {
    const label = document.createElement('span');
    label.textContent = t('Referencia:') + ' ';
    const link = document.createElement('a');
    link.href = record.fuenteUrl;
    link.textContent = t(record.fuente);
    source.append(label, link);
  }
  document.querySelector('#ficha-contexto').textContent = t(
    record.contexto ||
      'Configuración e información documentadas de esta unidad. Los campos sin información se muestran como «Sin dato».',
  );
  dialog.scrollTop = 0;
  if (!dialog.open) dialog.showModal();
}
function render() {
  // Un filtro oculto no debe seguir excluyendo unidades de otras versiones.
  const isGtr = version.value === 'gtr';
  evolutionContainer.hidden = !isGtr;
  evolutionFilter.disabled = !isGtr;
  document.querySelector('#filtros').setAttribute('data-gtr', String(isGtr));
  if (!isGtr) evolutionFilter.value = '';
  const query = normalize(search.value);
  // Todos los filtros se combinan: una unidad debe cumplir cada condición.
  const filtered = sorted.filter(
    (r) =>
      (version.value === 'todas' || r.version === version.value) &&
      (!evolutionFilter.value ||
        (r.version === 'gtr' && r.anio === evolutionFilter.value)) &&
      (!locationFilter.value || r.ubicacion.trim() === locationFilter.value) &&
      normalize(
        [
          ...Object.keys(fields).map((key) =>
            window.Idiomas.searchText(r[key] || ''),
          ),
          window.Idiomas.searchText(versionNames[r.version]),
          variantName(r),
        ].join(' '),
      ).includes(query),
  );
  tbody.replaceChildren();
  for (const record of filtered) {
    const row = document.createElement('tr');
    for (const key of ['chasis', 'version', 'color', 'vin', 'ubicacion']) {
      const cell = document.createElement('td');
      cell.textContent =
        key === 'version' ? variantName(record) : t(record[key] || 'Sin dato');
      if (key === 'color') cell.textContent = colorDescription(record);
      if (key === 'chasis') cell.className = 'chasis';
      if (key === 'vin') cell.className = 'vin';
      // En móvil, el CSS transforma la fila en tarjeta y muestra esta etiqueta
      // junto al valor. Se usa el mismo contenido que en la tabla de escritorio.
      cell.setAttribute('data-label', t(fields[key] || key));
      row.append(cell);
    }
    const cell = document.createElement('td');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = t('Ver ficha ↗');
    button.setAttribute(
      'aria-label',
      t('Ver ficha del chasis {chassis}', { chassis: record.chasis }),
    );
    button.addEventListener('click', () => openRecord(record));
    cell.append(button);
    row.append(cell);
    tbody.append(row);
  }
  document.querySelector('#contador').textContent = t(
    '{count} de {total} unidades',
    { count: filtered.length, total: records.length },
  );
  document.querySelector('#vacio').hidden = filtered.length !== 0;
}
search.addEventListener('input', render);
version.addEventListener('change', () => {
  if (version.value !== 'gtr' && version.value !== 'todas') {
    evolutionFilter.value = '';
  }
  render();
});
evolutionFilter.addEventListener('change', () => {
  if (evolutionFilter.value) version.value = 'gtr';
  render();
});
locationFilter.addEventListener('change', render);
document
  .querySelector('#filtros')
  .addEventListener('submit', (event) => event.preventDefault());
document.querySelector('#filtros').addEventListener('reset', () => {
  // El navegador restablece los controles después de emitir reset.
  // Esperar al siguiente turno evita leer los valores anteriores.
  setTimeout(() => {
    version.value = 'todas';
    render();
  }, 0);
});
document
  .querySelector('#cerrar')
  .addEventListener('click', () => dialog.close());
document
  .querySelector('#ficha-foto-volver')
  .addEventListener('click', () => photoDialog.close());
dialog.addEventListener('click', (event) => {
  // Cierra al pulsar el fondo exterior, pero no al tocar el contenido
  // o los espacios interiores del diálogo.
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
});
render();
// Enlaces como registro.html#002 abren directamente la ficha del chasis.
function openLinkedRecord() {
  const record = records.find(
    (item) =>
      chassisKey(item.chasis) ===
      chassisKey(decodeURIComponent(location.hash.slice(1))),
  );
  if (record) openRecord(record);
}
window.addEventListener('hashchange', openLinkedRecord);
window.addEventListener('languagechange', () => {
  renderSummary();
  for (const option of locationFilter.options) {
    if (option.value) option.textContent = t(option.value);
  }
  render();
  if (dialog.open && activeRecord) {
    const scroll = dialog.scrollTop;
    openRecord(activeRecord);
    dialog.scrollTop = scroll;
  }
  if (photoDialog.open && activePhoto)
    openPhoto(activePhoto.photo, activePhoto.record);
});
openLinkedRecord();
