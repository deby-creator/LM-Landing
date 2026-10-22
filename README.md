# LIQUI MOLY Service Station — Angular

Landing editorial en Angular 21.2, TypeScript y SCSS. El HTML original permanece en `reference/`; la página actual refleja las eliminaciones y cambios de texto solicitados después. El recorrido visible tiene seis secciones y un formulario de contacto minimalista.

## Desarrollo local

Requiere Node 20.19+, 22.12+ o 24+ dentro de las versiones compatibles con Angular 21.

```sh
npm ci --legacy-peer-deps
npm start
```

Abrir **http://localhost:4200**. `npm start` ejecuta `ng serve --host 127.0.0.1 --port 4200`. También se puede ejecutar `npx ng serve`.

La opción `--legacy-peer-deps` evita un fallo de npm 10.8.2 al resolver dependencias opcionales de herramientas de pruebas que esta aplicación no utiliza. Las dependencias Angular están alineadas en la serie 21.2 y fijadas en `package-lock.json`.

## Compilación y comprobación

```sh
npm run build
npm run check
```

`npm run build` ejecuta `ng build` en producción y prerenderiza la ruta principal. El sitio estático se genera en `dist/angular/browser/`, listo para un servidor estático con fallback a `index.html`. Se conserva `dist/index.html` como versión estática previa para referencia; no es la salida Angular.

La comprobación revisa el HTML prerenderizado: seis secciones, enlaces sin destinos rotos, contenido retirado por solicitud, formulario, recursos proporcionados, alternativas de imagen, encabezados y fuentes locales. No sustituye una revisión visual en navegador.

## Estructura

- `src/app/landing/`: componentes standalone visibles `hero`, `brand`, `about`, `model`, `benefits` y `contact`, cada uno con plantilla y SCSS propios. Los archivos `video` permanecen fuera del recorrido como referencia de desarrollo.
- `src/app/shared/`: navegación, enlaces de acción, barras de sección, cifras y desplegables reutilizables.
- `src/app/content/`: modelo de contenido tipado y datos extraídos del original.
- `src/styles.scss`: identidad, tipografía, estilos compartidos, accesibilidad y movimiento reducido.
- `public/assets/`: imágenes originales y variantes optimizadas. Los archivos fuente de mayor resolución permanecen en `Assets/`.
- `public/fonts/`: Barlow y Barlow Condensed, las fuentes del diseño anterior, alojadas localmente.
- `reference/Landing_Liqui_Moly_Evolucion.html`: fuente original de contenido, sin cambios.
- `scripts/`: extracción, preparación de imágenes/fuentes y verificación de fidelidad.

Para volver a extraer el contenido tras modificar intencionalmente la referencia: `npm run content:generate`. El archivo JSON generado contiene datos, no HTML ejecutable. Las plantillas Angular utilizan interpolación, entradas tipadas, señales y detección de cambios OnPush; no se incrusta el HTML anterior con `innerHTML`.

## Diseño e interacciones

Hero fotográfico, banda curva de cifras, composición con mapa, sección de identidad asimétrica, Service Station con mockup flotante, beneficios con selección y cierre con formulario. Los enlaces a las secciones visibles (`#inicio`, `#respaldo`, `#quienes`, `#service`, `#beneficios`, `#contacto`) usan Angular Router, historial y restauración de scroll. La cabecera ajusta el destino a su altura fija.

Los desplegables usan `details/summary`; el menú móvil expone su estado a tecnologías de asistencia y se cierra con Escape. Las imágenes secundarias se cargan de forma diferida; el hero dispone de JPEG de 960 y 1920 px. Las animaciones respetan `prefers-reduced-motion` y el contenido permanece disponible sin animaciones.

## Envío del formulario

El formulario contiene nombre, empresa, ciudad, teléfono, correo y la elección entre solicitar información o agendar una llamada. Sus campos tienen etiquetas, autocompletado y validación nativa. El usuario aún no ha definido correo, WhatsApp ni endpoint receptor: el botón de envío permanece deshabilitado y la página no guarda ni transmite los datos.

No se ha publicado el sitio en un servicio externo.
