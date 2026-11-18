# Imágenes de producto

## Renders automáticos (`renders/`)

`renders/<modelo>/<color>.webp` tiene la vista frontal de cada iPhone en sus
colores oficiales. El sitio los usa solo cuando un artículo no tiene fotos
propias: busca el modelo y el nombre del color cargado en /admin
(en inglés o español, ej. "Black Titanium", "Titanio negro", "Negro").

La lista de modelos y colores disponibles está en `data/renders.ts`.
Si un color no tiene imagen (ej. iPhone 17 Lavender), se muestra la
ilustración de marca.

Fuente de los marcos: github.com/jonnyjackson26/device-frames-media

## Fotos propias

Las fotos subidas desde /admin siempre tienen prioridad sobre los renders.
