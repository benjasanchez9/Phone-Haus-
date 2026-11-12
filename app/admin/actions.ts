"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionClient, requireAdmin } from "@/lib/supabase/server";
import { CATALOG_TAG } from "@/lib/supabase/config";
import { buildSlug, MODEL_OPTIONS, STORAGE_OPTIONS } from "@/lib/product-row";
import type { Condition, CosmeticGrade, ModelId } from "@/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

const NOT_LOGGED = "Tu sesión expiró. Volvé a iniciar sesión.";

/** Actualiza el sitio público después de un cambio. */
function refreshSite() {
  revalidateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
}

function isNonNegativeNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

/* ---------- Sesión ---------- */

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return "Completá email y contraseña.";

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return "Email o contraseña incorrectos.";
  redirect("/admin");
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------- Editar un artículo existente ---------- */

export interface ProductPatch {
  precio_usd?: number;
  stock?: number;
  visible?: boolean;
  destacado?: boolean;
  imagenes?: string[];
}

export async function updateProduct(id: string, patch: ProductPatch): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: NOT_LOGGED };

  const clean: ProductPatch = {};
  if (patch.precio_usd !== undefined) {
    if (!isNonNegativeNumber(patch.precio_usd)) return { ok: false, error: "El precio no es válido." };
    clean.precio_usd = Math.round(patch.precio_usd * 100) / 100;
  }
  if (patch.stock !== undefined) {
    if (!Number.isInteger(patch.stock) || patch.stock < 0) return { ok: false, error: "El stock debe ser un número entero, 0 o más." };
    clean.stock = patch.stock;
  }
  if (patch.visible !== undefined) clean.visible = Boolean(patch.visible);
  if (patch.destacado !== undefined) clean.destacado = Boolean(patch.destacado);
  if (patch.imagenes !== undefined) {
    if (!Array.isArray(patch.imagenes) || patch.imagenes.some((u) => typeof u !== "string" || !u.startsWith("https://")))
      return { ok: false, error: "La foto no es válida." };
    clean.imagenes = patch.imagenes;
  }
  if (Object.keys(clean).length === 0) return { ok: true };

  const { data, error } = await admin.supabase.from("productos").update(clean).eq("id", id).select("id");
  if (error) return { ok: false, error: `No se pudo guardar: ${error.message}` };
  if (!data || data.length === 0) return { ok: false, error: "No se encontró el artículo." };

  refreshSite();
  return { ok: true };
}

/* ---------- Cargar un artículo nuevo ---------- */

export interface NewProduct {
  model_id: ModelId;
  condicion: Condition;
  capacidad_gb: number;
  color_nombre: string;
  color_hex: string;
  precio_usd: number;
  stock: number;
  destacado: boolean;
  imagenes: string[];
  bateria?: number | null;
  estetica?: CosmeticGrade | null;
  estado_funcional?: string | null;
  descripcion?: string | null;
}

export async function createProduct(input: NewProduct): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: NOT_LOGGED };

  if (!MODEL_OPTIONS.some((m) => m.id === input.model_id)) return { ok: false, error: "Elegí un modelo." };
  if (input.condicion !== "nuevo" && input.condicion !== "seminuevo") return { ok: false, error: "Elegí la condición." };
  if (!STORAGE_OPTIONS.includes(input.capacidad_gb)) return { ok: false, error: "Elegí la capacidad." };
  const colorName = String(input.color_nombre ?? "").trim();
  if (!colorName) return { ok: false, error: "Escribí el nombre del color." };
  if (!/^#[0-9A-Fa-f]{6}$/.test(input.color_hex)) return { ok: false, error: "El color no es válido." };
  if (!isNonNegativeNumber(input.precio_usd) || input.precio_usd === 0) return { ok: false, error: "Escribí un precio mayor a 0." };
  if (!Number.isInteger(input.stock) || input.stock < 0) return { ok: false, error: "El stock debe ser un número entero, 0 o más." };

  const used = input.condicion === "seminuevo";
  if (used && (!Number.isInteger(input.bateria) || (input.bateria as number) < 0 || (input.bateria as number) > 100))
    return { ok: false, error: "Para un seminuevo, escribí la salud de batería (0 a 100)." };

  const row = {
    model_id: input.model_id,
    condicion: input.condicion,
    capacidad_gb: input.capacidad_gb,
    color_nombre: colorName,
    color_hex: input.color_hex,
    precio_usd: Math.round(input.precio_usd * 100) / 100,
    stock: input.stock,
    destacado: Boolean(input.destacado),
    imagenes: (input.imagenes ?? []).filter((u) => typeof u === "string" && u.startsWith("https://")),
    bateria: used ? input.bateria : null,
    estetica: used ? input.estetica ?? "muy-bueno" : null,
    estado_funcional: used ? input.estado_funcional?.trim() || "100% funcional. Revisado y verificado." : null,
    descripcion: input.descripcion?.trim() || null,
  };

  // Si ya existe un artículo con la misma dirección, se le agrega un sufijo.
  const base = buildSlug(row.model_id, row.capacidad_gb, colorName, row.condicion);
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await admin.supabase.from("productos").insert({ ...row, slug });
    if (!error) {
      refreshSite();
      return { ok: true };
    }
    if (error.code !== "23505") return { ok: false, error: `No se pudo guardar: ${error.message}` };
  }
  return { ok: false, error: "No se pudo generar una dirección única para el artículo." };
}

/* ---------- Borrar ---------- */

export async function deleteProduct(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: NOT_LOGGED };

  const { data, error } = await admin.supabase.from("productos").delete().eq("id", id).select("id");
  if (error) return { ok: false, error: `No se pudo borrar: ${error.message}` };
  if (!data || data.length === 0) return { ok: false, error: "No se encontró el artículo." };

  refreshSite();
  return { ok: true };
}
