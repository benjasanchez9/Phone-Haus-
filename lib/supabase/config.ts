/* Datos de conexión a Supabase (se cargan como variables de entorno en Vercel). */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/** Etiqueta de caché del catálogo: el panel la invalida al guardar cambios. */
export const CATALOG_TAG = "productos";

/** Carpeta (bucket) de Supabase Storage donde se guardan las fotos. */
export const PHOTOS_BUCKET = "fotos";
