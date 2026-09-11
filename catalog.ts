import { products } from "@/data/products";
import { iphoneSpecs } from "@/data/iphone-specs";
import { siteConfig } from "@/data/site-config";
import type { Condition, IphoneSpecs, ModelId, Product } from "@/types";

/* =========================================================
   CAPA DE ACCESO A DATOS DEL CATÁLOGO
   Hoy lee archivos locales. Para migrar a CMS / Supabase / API,
   reemplazar la implementación de estas funciones manteniendo
   las mismas firmas: la UI no cambia.
   ========================================================= */

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  return products
    .filter((p) => p.id !== product.id && p.stock !== "agotado")
    .sort((a, b) => Math.abs(a.priceUSD - product.priceUSD) - Math.abs(b.priceUSD - product.priceUSD))
    .slice(0, limit);
}

export function getSpecs(modelId: ModelId): IphoneSpecs | undefined {
  return iphoneSpecs[modelId];
}

export function getAllSpecs(): IphoneSpecs[] {
  return Object.values(iphoneSpecs).sort((a, b) => b.year - a.year || b.metrics.chipGeneration - a.metrics.chipGeneration || b.metrics.screenInches - a.metrics.screenInches);
}

export function warrantyFor(condition: Condition) {
  return condition === "nuevo" ? siteConfig.warranty.new : siteConfig.warranty.used;
}

/* ---------- Versiones síncronas para componentes cliente ---------- */
export const catalogSnapshot = {
  products,
  specs: iphoneSpecs,
};

/** Resumen de oferta por modelo: menor precio y estados disponibles. */
export function offerForModel(modelId: ModelId, list: Product[] = products) {
  const items = list.filter((p) => p.modelId === modelId && p.stock !== "agotado");
  if (items.length === 0) return null;
  const cheapest = items.reduce((a, b) => (a.priceUSD <= b.priceUSD ? a : b));
  return {
    fromPrice: cheapest.priceUSD,
    cheapest,
    conditions: Array.from(new Set(items.map((i) => i.condition))) as Condition[],
    storages: Array.from(new Set(items.map((i) => i.storageGB))).sort((a, b) => a - b),
    items,
  };
}
