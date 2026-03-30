# M-Wipe — Cookie & Paywall Destroyer

![M-Wipe Extension](icons/icon.png)

Extensión para Chrome que elimina automáticamente banners de cookies, muros de pago y avisos de privacidad. Sin clics, sin interrupciones, sin aceptar nada.

> Proyecto en GitHub: [github.com/mmirandamartinez/m-wipe](https://github.com/mmirandamartinez/m-wipe)

---

## Qué hace

M-Wipe actúa en silencio en cada página que visitas:

- Detecta y elimina banners de cookies de más de 16 plataformas conocidas (Didomi, OneTrust, Cookiebot, SourcePoint...).
- Usa heurística inteligente para los banners que no están en el diccionario.
- Rechaza cuando hay botón de rechazar. Elimina cuando no lo hay.
- Nunca acepta cookies en tu nombre.
- Desbloquea el scroll cuando la página lo bloquea para forzarte a aceptar.
- Envía señales TCF y GPC para indicar al sitio que no consientes el rastreo.

---

## Instalación manual

No está en la Chrome Web Store (de momento). Instálala en modo desarrollador:

```bash
git clone https://github.com/mmirandamartinez/m-wipe.git
```

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el **Modo desarrollador** (esquina superior derecha)
3. Haz clic en **Cargar descomprimida**
4. Selecciona la carpeta del proyecto

---

## Plataformas soportadas

| Plataforma | Estado |
|---|---|
| Didomi | Rechaza |
| OneTrust | Rechaza |
| Cookiebot | Rechaza |
| SourcePoint | Rechaza |
| CookieYes | Rechaza |
| Iubenda | Rechaza |
| Axeptio | Rechaza |
| Complianz (WP) | Rechaza |
| Borlabs Cookie (WP) | Rechaza |
| Usercentrics | Rechaza |
| Quantcast | Rechaza |
| Klaro | Rechaza |
| TrustArc | Rechaza |
| Fc (Marca) | Elimina |
| ContentPass (AS.com) | Elimina |
| Resto (heurística) | Rechaza o elimina |

---

## Estructura del proyecto

```plain
m-wipe/
├── manifest.json       # Configuración de la extensión
├── content.js          # Lógica principal — detección y eliminación
├── menu.html           # Popup de la extensión
├── menu.js             # Lógica del popup — toggle y contador
└── icons/
    ├── icon.png
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Tecnologías

- JavaScript (vanilla) — Lógica de detección y eliminación.
- Chrome Extensions API (MV3) — Storage, scripting, activeTab.
- MutationObserver — Vigilancia de cambios en el DOM en tiempo real.
- TCF API / GPC — Señales estándar de rechazo de rastreo.

---

## Reportar un sitio que no funciona

Si encuentras una web donde el banner no desaparece:

1. Abre DevTools (`F12`)
2. Inspecciona el elemento del banner
3. Copia el `id` o `class` del contenedor
4. Abre un issue en [github.com/mmirandamartinez/m-wipe/issues](https://github.com/mmirandamartinez/m-wipe/issues) con la URL y el selector

---

## Autor

Manuel Miranda Martínez

- Sitio web: [mmirandamartinez.com](https://mmirandamartinez.com)
- GitHub: [github.com/mmirandamartinez](https://github.com/mmirandamartinez)
- LinkedIn: [linkedin.com/in/mmirandamartinez](https://www.linkedin.com/in/mmirandamartinez/)

---

## Licencia

Este proyecto es de código abierto y está disponible bajo la [licencia MIT](LICENSE).
