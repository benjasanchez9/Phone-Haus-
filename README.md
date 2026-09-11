# PHONE HAUS — Sitio web

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS.

## Correr en local
```bash
npm install
cp .env.example .env.local   # completar el número de WhatsApp
npm run dev                  # http://localhost:3000
```

## Deploy en Vercel
1. Subir esta carpeta a un repositorio de GitHub.
2. En vercel.com → **Add New → Project** → importar el repositorio.
3. Framework: Next.js (se detecta solo). No hace falta cambiar comandos.
4. En **Environment Variables** agregar:
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` → ej. `59899123456` (solo dígitos, sin + ni 0 inicial)
   - `NEXT_PUBLIC_SITE_URL` → dominio final, ej. `https://phonehaus.uy`
5. **Deploy**. Si cambiás una variable después, hacé *Redeploy*.

## Dónde se edita cada cosa
| Qué | Archivo |
|---|---|
| Productos, precios, stock, batería | `data/products.ts` |
| Especificaciones técnicas | `data/iphone-specs.ts` |
| Valores del Plan Recambio | `data/trade-in-values.ts` |
| Descuentos y reglas del recambio | `data/trade-in-rules.ts` |
| WhatsApp, Instagram, pagos, envíos, garantía, local | `data/site-config.ts` |
| Preguntas frecuentes | `data/faq.ts` |
| Colores de marca | `app/globals.css` (bloque `:root`) |
| Logo | `public/brand/` + `components/brand/Logo.tsx` |
| Fotos de productos | `public/products/` + campo `images` en `data/products.ts` |

Todo lo marcado `// DEMO DATA - REPLACE BEFORE PRODUCTION` debe revisarse antes de publicar.
