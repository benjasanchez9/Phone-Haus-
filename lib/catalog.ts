import { cache } from "react";
import { products as localProducts } from "@/data/products";
import { iphoneSpecs } from "@/data/iphone-specs";
import { siteConfig } from "@/data/site-config";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import { imagesFor } from "@/lib/renders";
import { PRODUCT_COLUMNS, rowToProduct, type ProductRow } from "@/lib/product-row";
import type { Condition, IphoneSpecs, ModelId, Product } from "@/types";

/* =========================================================
   CAPA DE ACCESO A DATOS DEL CATÁLOGO
   Lee los productos de Supabase (tabla `productos`), que se
   administran desde /admin. Si las variables de Supabase no están
   configuradas (ej. en una PC sin .env.local), usa los datos de
   ejemplo de data/products.ts.
   ========================================================= */

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!supabaseConfigured) {
    return localProducts.map((p) => ({ ...p, images: imagesFor(p.images, p.modelId, p.color.name, p.color.hex) }));
  }
  const { data, error } = await createPublicClient()
    .from("productos")
    .select(PRODUCT_COLUMNS)
    .eq("visible", true)
    .order("creado_en", { ascending: true });
  if (error) throw new Error(`No se pudo leer el catálogo: ${error.message}`);
  return (data as unknown as ProductRow[]).map(rowToProduct);
});

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const products = await getProducts();
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

/** Resumen de oferta por modelo: menor precio y estados disponibles. */
export function offerForModel(modelId: ModelId, list: Product[]) {
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
