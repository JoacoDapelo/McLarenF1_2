# McLaren F1 — Archivo independiente

<img src="assets/mclaren-f1.svg" alt="Emblema McLaren F1" width="150" />

Un archivo visual e interactivo del McLaren F1: sus versiones **Calle, LM, GT y GTR**, las especificaciones de fábrica y la historia de cada chasis documentado.

Sitio independiente, sin afiliación ni respaldo de McLaren Automotive. Disponible en **español e inglés**.

## Qué incluye

- Cuatro modelos 3D interactivos, con controles de cámara, zoom y rotación.
- Especificaciones de fábrica con enlaces a las fuentes consultadas.
- Registro de **106 unidades**, con búsqueda por chasis, VIN, matrícula, color e historial.
- Filtros por versión y ubicación; selector de evolución para los GTR.
- Galería de **110 fotografías**, vinculadas a sus unidades y fuentes.
- Fichas con imágenes ampliables y botón para regresar a la unidad.
- Diseño adaptable a PC y móvil, navegación por teclado y selector de idioma con preferencia guardada.

La distribución del registro es de 69 unidades de Calle —incluidos cinco prototipos—, seis LM, tres GT y 28 GTR. Los datos de propiedad, ubicación y configuración son históricos; no certifican la situación actual de cada vehículo. Los campos sin información se indican como «Sin dato» y se mantienen los valores «???» sin confirmar.

## Explorar el sitio

| Página                                         | Contenido                                 |
| ---------------------------------------------- | ----------------------------------------- |
| `index.html` / `mclaren.html`                  | Inicio y explorador de la familia F1      |
| `calle.html`, `lm.html`, `gt.html`, `gtr.html` | Visor y especificaciones de cada versión  |
| `registro.html`                                | Registro, filtros y fichas individuales   |
| `galeria.html`                                 | Colección de fotografías y visor ampliado |

Los enlaces como `registro.html#002` abren directamente la ficha de un chasis.

## Verlo en tu equipo

Sirve la carpeta del sitio mediante HTTP para cargar los modelos 3D. En la copia de publicación (`dist/` o `github-subida/`), ejecuta el siguiente comando desde la carpeta que contiene `index.html`, si tienes Python 3 instalado:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8080/index.html`. En la carpeta fuente del proyecto puedes ejecutar `iniciar-web.cmd` en Windows; ese lanzador abre `mclaren.html`, que es la entrada durante el desarrollo.

La web publicada utiliza HTML, CSS y JavaScript, sin proceso de compilación ni servidor de aplicación. Los recursos se sirven como archivos estáticos; la preferencia de idioma se guarda en el navegador.

## Organización para GitHub

La copia preparada para subir por carpetas contiene:

```text
index.html y las demás páginas HTML
README.md
LICENSE
THIRD_PARTY_NOTICES.md
assets/           Emblema y créditos
css/              Estilos
js/               Código, traducciones y datos para el navegador
vendor/           Visor 3D y su licencia
modelos/          Los cuatro modelos GLB
imagenes-calle/   Fotografías de Calle, agrupadas por chasis
imagenes-lm/      Fotografías de LM
imagenes-gt/      Fotografías de GT
imagenes-gtr/     Fotografías de GTR
```

Sube los archivos de la raíz y después cada carpeta completa a la raíz del repositorio, conservando sus nombres. Cada grupo preparado tiene menos de 25 MB y menos de 100 archivos. Espera a subir todos los grupos antes de comprobar el sitio.

Puedes alojar esta estructura en un servicio de sitios estáticos. Subir los archivos al repositorio y activar un alojamiento web son pasos distintos.

## Desarrollo y preparación

La carpeta fuente conserva los HTML, CSS y JavaScript por página, los datos originales y las herramientas PowerShell. Las copias publicables mantienen todos los chasis y fotografías; utilizan recursos optimizados para reducir el tamaño de descarga.

Estos comandos se ejecutan desde la **carpeta fuente**, que contiene los scripts de preparación:

```powershell
# Actualizar la publicación y el ZIP.
powershell -NoProfile -ExecutionPolicy Bypass -File .\preparar-publicacion.ps1

# Actualizar la copia organizada para subir por carpetas.
powershell -NoProfile -ExecutionPolicy Bypass -File .\preparar-github.ps1
```

Para editar páginas generadas, modifica `generar-paginas.ps1` y `catalogo.json` antes de regenerarlas. Los estilos y los scripts de comportamiento se mantienen por separado. Las traducciones se encuentran en `traducciones.js`; `idiomas.js` aplica el idioma elegido.

Los modelos y fotografías originales permanecen en la carpeta fuente. Si se modifican, se deben regenerar sus copias ligeras con `optimizar-publicacion.ps1` antes de preparar la publicación.

## Fuentes, créditos y licencia

Las especificaciones enlazan a fichas de McLaren Automotive conservadas en All Car Central. El registro y las fotografías incluyen referencias a [McLaren F1 Registry](https://www.mclf1.com/) y a documentación histórica de las unidades.

El **código original y la documentación original del proyecto** se distribuyen bajo [licencia MIT](LICENSE). Esa licencia no se aplica a los modelos 3D, fotografías, emblemas, marcas ni materiales documentales de terceros. Los contenidos de fuentes externas incorporados en los archivos de datos conservan sus derechos y condiciones de origen.

Consulta [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) para conocer los autores, las licencias de los modelos, sus adaptaciones y el alcance de los derechos sobre los demás recursos. Las licencias no comerciales de los modelos siguen vigentes en sus copias optimizadas.

---

## English

An independent, bilingual McLaren F1 archive covering the Road car, LM, GT and GTR. It includes four interactive 3D models, factory specifications, 106 documented cars and 110 photographs, with a responsive interface and searchable chassis records.

Serve the website directory over HTTP and open `index.html`. For the organised GitHub copy, upload the root files and each complete folder to the repository root, preserving the structure above. Development and packaging scripts are available in the source workspace.

The original application code and original project documentation are licensed under MIT. Third-party models, photographs, logos, trademarks and source materials are excluded from that grant. Their own terms apply; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). This project is not affiliated with or endorsed by McLaren Automotive.
