# Click Web — Sitio Profesional

Esta es una página de portafolio y servicios lista para publicar en GitHub Pages.

## Estructura del proyecto

- `index.html` — Página principal con contenido actualizado y accesible.
- `assets/css/styles.css` — Estilos separados para mejor mantenimiento.
- `assets/js/scripts.js` — Lógica de banner de cookies, menú móvil, modales y accesibilidad.

## Cómo usar

1. Guarda este proyecto en un repositorio de GitHub.
2. Asegúrate de que `index.html` está en la raíz del repositorio.
3. Ve a **Settings > Pages** en GitHub.
4. Selecciona la rama `main` (o `master`) y la carpeta `/` como origen.
5. Pulsa **Save** y espera a que GitHub genere el sitio.

El sitio quedará disponible en `https://<tu-usuario>.github.io/<tu-repositorio>`.

## Personalización rápida

- Reemplaza el número de WhatsApp y el correo electrónico en `index.html` con tus datos reales.
- Cambia los proyectos de ejemplo en la sección de portafolio.
- Si necesitas otro dominio, configura el archivo `CNAME` en la raíz del repositorio y añade tu dominio en GitHub Pages.

## Buenas prácticas incluidas

- Estructura semántica con `header`, `main`, `section` y `footer`.
- Navegación accesible con `aria-label`, `aria-expanded` y foco visible.
- Banner de cookies persistente con `localStorage`.
- Modales accesibles con `role="dialog"`, `aria-modal="true"` y cierre con Escape.
- Enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`.
- CSS y JavaScript separados para un proyecto profesional.

## Pruebas locales

Puedes abrir `index.html` directamente en el navegador o usar un servidor local para pruebas:

```bash
python -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Nota

El contenido actual de Click Web se ha mantenido y organizado en una estructura profesional para que solo tengas que subirlo a GitHub y publicarlo en la nube.
