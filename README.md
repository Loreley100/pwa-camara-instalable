# Inspección Visual PWA

PWA de vista previa local de cámara con instalación nativa y flujo de consentimiento previo.

## Archivos

- `index.html`: estructura de la interfaz.
- `styles.css`: estilos sencillos y adaptables.
- `app.js`: lógica de instalación, pre-permiso y control de cámara.
- `sw.js`: Service Worker con estrategia Cache First.
- `manifest.json`: metadatos de instalabilidad.
- `icons/icon-192.png` e `icons/icon-512.png`: iconos físicos 192x192 y 512x512.

## Ejecución local

No abrir con `file://`. Servir con un servidor local (por ejemplo `npx serve` o cualquier servidor estático) y abrir la URL `http://localhost`.

## Publicación

GitHub Pages desde la rama `main` y la carpeta `/ (root)`.

URL esperada: https://loreley100.github.io/pwa-camara-instalable/

## Pruebas en Android/Chrome

1. Revisar manifiesto y Service Worker en DevTools.
2. Instalar cuando el navegador ofrezca la instalación.
3. Abrir desde el icono y comprobar standalone.
4. Verificar aviso previo.
5. Conceder permiso.
6. Comprobar físicamente frontal y trasera.
7. Apagar y comprobar que se libera la cámara.

## Conceptos

- `facingMode`: indica qué lente solicitar (`environment` trasera, `user` frontal).
- `srcObject`: asigna el stream de video al elemento `<video>`.
- `getTracks()`: obtiene las pistas del stream.
- `track.stop()`: libera el sensor de cámara.
- El aviso de la aplicación es informativo; el permiso nativo lo gestiona el navegador.
- `beforeinstallprompt` permite ofrecer instalación propia; `prompt()` la dispara y `userChoice` informa el resultado.

## Instalación

- Android: instalación mediante el evento `beforeinstallprompt` y el botón cuando estén disponibles.
- iPhone: instrucciones manuales Compartir → Agregar a inicio. Las instrucciones se ocultan cuando se abre en modo standalone.
- El permiso de cámara puede solicitarse nuevamente al abrir la aplicación instalada; no debe asumirse que haberlo concedido en Safari evita otra solicitud.

## Prueba pendiente

Prueba pendiente en un iPhone real: instalación, apertura standalone, pre-permiso, alternancia y apagado.