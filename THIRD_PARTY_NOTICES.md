# Créditos y materiales de terceros / Third-party notices

## Alcance de la licencia MIT

El archivo `LICENSE` concede la licencia MIT únicamente sobre el código de aplicación original y la documentación original de este proyecto: su estructura HTML, estilos CSS, lógica JavaScript y herramientas de preparación.

Quedan fuera de esa concesión los modelos 3D, fotografías, emblemas, marcas, bibliotecas y materiales documentales de terceros, así como los contenidos de fuentes externas conservados en los archivos de datos. La inclusión de un recurso en el repositorio, o de sus metadatos en un archivo JavaScript o JSON, no modifica sus derechos de origen. El proyecto no concede permisos sobre material del que no es titular.

## Modelos 3D

Las licencias de esta tabla son las indicadas en los metadatos de los modelos incluidos. Se conservan sus enlaces de autoría y procedencia en el catálogo y en los créditos del visor.

| Modelo              | Autor                                              | Fuente                                                                                                  | Licencia                                                              |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| McLaren F1 de Calle | [Alex.Ka.](https://sketchfab.com/Alex.Ka.)         | [Modelo original](https://sketchfab.com/3d-models/mclaren-f1-c99f9848560c41f8b723493721ef5e93)          | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)       |
| 1995 McLaren F1 LM  | [Ddiaz Design](https://sketchfab.com/ddiaz-design) | [Modelo original](https://sketchfab.com/3d-models/1995-mclaren-f1-lm-a0ef25e23a4a423d8fca5c62da54db77)  | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |
| 1997 McLaren F1 GT  | [Ddiaz Design](https://sketchfab.com/ddiaz-design) | [Modelo original](https://sketchfab.com/3d-models/1997-mclaren-f1-gt-c1cc76945ca84c10a7ff8330fb1dd1ab)  | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |
| 1995 McLaren F1 GTR | [OUTPISTON](https://sketchfab.com/outpiston)       | [Modelo original](https://sketchfab.com/3d-models/1995-mclaren-f1-gtr-d6c603845e264a7086232d9c7aa8b270) | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |

Estas licencias requieren atribución, enlace a la licencia e indicación de cambios, y excluyen el uso comercial. En los modelos con cláusula ShareAlike, las adaptaciones se distribuyen bajo la misma licencia. La licencia MIT del código no sustituye estas condiciones.

### Adaptaciones realizadas

- **Calle:** se retiraron del escenario el fondo, el humo y la sombra plana, y se niveló la orientación del automóvil. La copia de presentación anterior a la optimización conserva la geometría y texturas del vehículo.
- **Copias web de las cuatro versiones:** se eliminaron recursos sin uso, se fusionaron vértices idénticos y se cuantizó la geometría. Se convirtieron texturas a WebP, con un máximo de 2048 px. Se mantuvo el número de triángulos visibles de cada vehículo y se conservaron los archivos originales en la carpeta fuente.
- Las copias adaptadas del F1 de Calle se distribuyen bajo **CC BY-NC 4.0**. Las del LM, GT y GTR se distribuyen bajo **CC BY-NC-SA 4.0**, respectivamente, conservando los créditos de sus autores.

## Fotografías y documentación

Las fotografías se obtuvieron de las páginas públicas de McLaren F1 Registry y de su archivo histórico. Sus direcciones de procedencia y de imagen original se conservan en `imagenes.js`, dentro de `js/` en la copia organizada. La publicación contiene copias JPEG recomprimidas, a la resolución original, con sus metadatos conservados.

La indicación «Fuente: McLaren F1 Registry» identifica el sitio consultado; no identifica necesariamente al fotógrafo ni acredita una autorización de reutilización. No consta en el proyecto una licencia general que permita ofrecer estas fotografías bajo MIT. Sus derechos corresponden a sus titulares y se conservan las marcas y créditos integrados en las imágenes.

Las fichas técnicas enlazadas fueron publicadas por McLaren Automotive y conservadas en [All Car Central](https://www.allcarcentral.com/). Las descripciones documentales y otros materiales procedentes de fuentes externas mantienen sus derechos y condiciones originales. No se concede una licencia sobre esos materiales por el mero hecho de resumirlos, enlazarlos o incorporarlos al registro.

## Emblema y marcas

El emblema utilizado en `assets/mclaren-f1.svg` procede de [Worldvectorlogo](https://worldvectorlogo.com/logo/mclaren-f1-2). Se retiró su fondo blanco y se ajustó el área visible, manteniendo trazados y colores. Sus créditos también se incluyen en `assets/creditos-emblema.txt` en la publicación.

McLaren, McLaren F1, los emblemas, nombres comerciales y demás marcas pertenecen a sus respectivos titulares. No se concede licencia de marca ni se atribuye al proyecto su titularidad. El sitio se presenta como archivo independiente, sin afiliación ni respaldo de McLaren Automotive.

## Visor 3D

El componente `vendor/model-viewer.min.js` corresponde a **model-viewer 4.4.0**, del proyecto de Google. Se distribuye con su licencia **Apache License 2.0**, incluida en [vendor/LICENSE-model-viewer.txt](vendor/LICENSE-model-viewer.txt). Los componentes de terceros integrados en la biblioteca mantienen sus propios avisos y condiciones.

## English summary

The MIT license covers only the original application code and original project documentation. It does not relicense third-party assets or source materials embedded in data files.

The Alex.Ka. road-car model and its adaptations remain under CC BY-NC 4.0. The Ddiaz Design LM and GT models, the OUTPISTON GTR model, and their adaptations remain under CC BY-NC-SA 4.0. The author, source and license links are listed above. Changes include the road-car presentation adjustments and web optimisation of all four models.

Photographs retain their owners’ rights; a source link is not a reuse license or proof of authorship. Logos and trademarks retain their owners’ rights. The model-viewer component has its separate Apache 2.0 license. No affiliation with or endorsement by McLaren Automotive is implied.
