import { createClient } from "@supabase/supabase-js";
import { CATALOG_TAG, SUPABASE_KEY, SUPABASE_URL } from "./config";

/**
 * Cliente de solo lectura para el sitio público.
 * No usa cookies, así las páginas siguen siendo estáticas y rápidas.
 * Las consultas quedan en caché hasta 5 minutos, o hasta que el panel
 * de administración guarda un cambio (invalida la etiqueta "productos").
 */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: 300, tags: [CATALOG_TAG] } }),
    },
  });
}
