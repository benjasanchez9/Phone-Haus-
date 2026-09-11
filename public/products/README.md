# Renders de producto

Subí acá los renders definitivos (PNG/WebP con fondo transparente, ~1200 px de alto).

Nombre sugerido: `<slug-del-producto>-1.png`, `<slug-del-producto>-2.png`

Después agregá las rutas en `data/products.ts`:

```ts
images: ["/products/iphone-17-pro-256-cosmic-orange-1.png"],
```

Si `images` queda vacío, o si el archivo no existe, el sitio muestra automáticamente
el render placeholder de marca (nunca una imagen rota).
