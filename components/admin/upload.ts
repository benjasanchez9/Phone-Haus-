"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import { PHOTOS_BUCKET } from "@/lib/supabase/config";

const MAX_MB = 8;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Sube una foto a Supabase Storage y devuelve su dirección pública. */
export async function uploadPhoto(file: File): Promise<{ url: string } | { error: string }> {
  const ext = TYPES[file.type];
  if (!ext) return { error: "La foto tiene que ser JPG, PNG o WEBP." };
  if (file.size > MAX_MB * 1024 * 1024) return { error: `La foto pesa más de ${MAX_MB} MB.` };

  const supabase = createBrowserSupabase();
  const path = `productos/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) return { error: `No se pudo subir la foto: ${error.message}` };

  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
