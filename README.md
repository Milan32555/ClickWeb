# Click Web — Sitio Web Corporativo

Landing page profesional para una agencia de soluciones digitales. Construida con HTML, CSS y JavaScript puros — sin dependencias de terceros, lista para GitHub Pages.

## Estructura del proyecto

```
clickweb/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos completos (tokens, layout, componentes)
│   ├── js/
│   │   └── scripts.js      # Cookies, menú móvil, modales, accesibilidad
│   └── img/                # Imágenes y recursos gráficos
└── README.md
```

## Tecnologías

- **Tipografía**: Space Grotesk (headings) + Plus Jakarta Sans (body) vía Google Fonts
- **Sin frameworks** — CSS custom properties, Grid, Flexbox, IntersectionObserver
- **Accesibilidad**: ARIA roles, skip link, focus trap en modales, tecla Escape
- **SEO**: meta description, Open Graph, Twitter Card, robots

## Despliegue en GitHub Pages

1. Sube el proyecto a un repositorio de GitHub
2. Ve a **Settings → Pages**
3. Selecciona rama `main` y carpeta `/` como origen
4. Guarda — el sitio quedará en `https://<usuario>.github.io/<repositorio>`

Para dominio propio, añade un archivo `CNAME` en la raíz con tu dominio.

## Personalización

| Qué cambiar | Dónde |
|---|---|
| Número de WhatsApp | Busca `573001234567` en `index.html` |
| Datos legales (NIT, dirección) | Modales `#modal-aviso` y `#modal-privacidad` |
| Proyectos del portafolio | Sección `#portafolio` en `index.html` |
| URL canónica y og:url | `<head>` en `index.html` |
| Redes sociales | `href="#"` en los `<a class="social-link">` del footer |

## Pruebas locales

```bash
python -m http.server 8000
# Abre http://localhost:8000
```
