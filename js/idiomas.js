'use strict';

(() => {
  const translations = window.TRADUCCIONES_EN;
  const storageKey = 'mclaren-language';
  let language = 'es';

  // La web sigue funcionando si el navegador bloquea el almacenamiento local.
  try {
    if (localStorage.getItem(storageKey) === 'en') language = 'en';
  } catch {
    // En este caso la elección se aplica a la página actual.
  }

  const normalize = (text) => String(text).replace(/\s+/g, ' ').trim();

  function t(source, values = {}, targetLanguage = language) {
    const original = String(source ?? '');
    const key = normalize(original);
    let translated = original;
    if (targetLanguage === 'en') {
      translated = translations[key] ?? original;
      // Las decoraciones conservan su nombre; solo se traduce «dorsal».
      const raceNumber = key.match(/^(.*) · dorsal (\d+)$/);
      const ordinal = key.match(/^(\d+)\.º$/);
      if (raceNumber) {
        translated =
          t(raceNumber[1], {}, targetLanguage) + ' · race no. ' + raceNumber[2];
      } else if (ordinal) {
        const number = Number(ordinal[1]);
        const suffix =
          number % 100 >= 11 && number % 100 <= 13
            ? 'th'
            : ({ 1: 'st', 2: 'nd', 3: 'rd' }[number % 10] ?? 'th');
        translated = number + suffix;
      }
    }
    return translated.replace(
      /\{(\w+)\}/g,
      (match, key) => values[key] ?? match,
    );
  }

  // Se guardan los textos originales una vez. Cambiar el idioma no reemplaza
  // elementos HTML ni sus eventos, enlaces o controles interactivos.
  const texts = [];
  const attributes = [];
  const walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement?.closest('script, style, noscript, [data-language]'))
      continue;
    if (Object.hasOwn(translations, normalize(node.nodeValue))) {
      texts.push({ node, source: node.nodeValue });
    }
  }
  for (const element of document.querySelectorAll('*')) {
    for (const attribute of ['aria-label', 'alt', 'title', 'placeholder']) {
      const source = element.getAttribute(attribute);
      if (source && Object.hasOwn(translations, normalize(source))) {
        attributes.push({ element, attribute, source });
      }
    }
  }
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    attributes.push({
      element: description,
      attribute: 'content',
      source: description.content,
    });
  }

  function apply() {
    document.documentElement.lang = language;
    for (const { node, source } of texts) {
      if (!node.isConnected) continue;
      const translated = t(source);
      // Mantiene los espacios entre enlaces y otros fragmentos en línea.
      node.nodeValue = source.replace(/\S[\s\S]*\S|\S/, translated.trim());
    }
    for (const { element, attribute, source } of attributes) {
      if (element.isConnected) element.setAttribute(attribute, t(source));
    }
    for (const button of document.querySelectorAll('[data-language]')) {
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.language === language),
      );
    }
  }

  function setLanguage(next) {
    if (!['es', 'en'].includes(next) || next === language) return;
    language = next;
    try {
      localStorage.setItem(storageKey, language);
    } catch {
      // No es necesario almacenar la preferencia para traducir esta página.
    }
    apply();
    window.dispatchEvent(new CustomEvent('languagechange'));
  }

  window.Idiomas = {
    t,
    // Buscar siempre en ambos idiomas conserva los resultados al cambiar
    // de idioma, incluso si la consulta está escrita en inglés.
    searchText: (source) => String(source ?? '') + ' ' + t(source, {}, 'en'),
    setLanguage,
    get language() {
      return language;
    },
  };
  for (const button of document.querySelectorAll('[data-language]')) {
    button.addEventListener('click', () =>
      setLanguage(button.dataset.language),
    );
  }
  apply();
})();
