import { iphoneSpecs } from "@/data/iphone-specs";
import { imagesFor } from "@/lib/renders";
import type { Condition, CosmeticGrade, ModelId, Product, StockStatus } from "@/types";

/** Fila tal como está guardada en la tabla `productos` de Supabase. */
export interface ProductRow {
  id: string;
  slug: string;
  model_id: ModelId;
  condicion: Condition;
  capacidad_gb: number;
  color_nombre: string;
  color_hex: string;
  precio_usd: number | string;
  stock: number;
  destacado: boolean;
  imagenes: string[] | null;
  bateria: number | null;
  estetica: CosmeticGrade | null;
  estado_funcional: string | null;
  descripcion: string | null;
  visible: boolean;
  creado_en: string;
  actualizado_en: string;
}

export const PRODUCT_COLUMNS =
  "id, slug, model_id, condicion, capacidad_gb, color_nombre, color_hex, precio_usd, stock, destacado, imagenes, bateria, estetica, estado_funcional, descripcion, visible, creado_en, actualizado_en";

/** Modelos ordenados del más nuevo al más viejo (para el formulario). */
export const MODEL_OPTIONS: { id: ModelId; name: string }[] = (Object.keys(iphoneSpecs) as ModelId[])
  .map((id) => ({ id, name: iphoneSpecs[id].name }))
  .sort((a, b) => releaseOrderFor(b.id) - releaseOrderFor(a.id));

export const STORAGE_OPTIONS = [64, 128, 256, 512, 1024, 2048];

/** "iphone-17-pro-max" → 1703. Mayor = más reciente. */
export function releaseOrderFor(modelId: ModelId): number {
  const gen = Number(modelId.match(/\d+/)?.[0] ?? 0);
  const tier = modelId.endsWith("pro-max") ? 3 : modelId.endsWith("pro") ? 2 : 1;
  return gen * 100 + tier;
}

/**
 * Unidades en stock → estado que muestra el sitio.
 * Un seminuevo es una unidad única, así que con 1 ya figura "Disponible".
 */
export function stockStatusFor(units: number, condition: Condition): StockStatus {
  if (units <= 0) return "agotado";
  if (condition === "nuevo" && units <= 2) return "ultimas-unidades";
  return "disponible";
}

export function rowToProduct(row: ProductRow): Product {
  const spec = iphoneSpecs[row.model_id];
  const product: Product = {
    id: row.id,
    slug: row.slug,
    modelId: row.model_id,
    name: spec?.name ?? row.model_id,
    condition: row.condicion,
    storageGB: row.capacidad_gb,
    color: { name: row.color_nombre, hex: row.color_hex },
    priceUSD: Number(row.precio_usd),
    stock: stockStatusFor(row.stock, row.condicion),
    featured: row.destacado,
    releaseOrder: releaseOrderFor(row.model_id),
    images: imagesFor(row.imagenes ?? [], row.model_id, row.color_nombre, row.color_hex),
  };
  if (row.condicion === "seminuevo") {
    product.used = {
      batteryHealth: row.bateria ?? 0,
      cosmetic: row.estetica ?? "muy-bueno",
      functional: row.estado_funcional ?? "100% funcional. Revisado y verificado.",
    };
  }
  if (row.descripcion) product.shortDescription = row.descripcion;
  return product;
}

/** Genera la dirección web del producto: iphone-16-pro-256-black-titanium-seminuevo */
export function buildSlug(modelId: string, storageGB: number, colorName: string, condition: Condition) {
  const color = colorName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return [modelId, String(storageGB), color, condition === "seminuevo" ? "seminuevo" : ""].filter(Boolean).join("-");
}
