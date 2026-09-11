import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { siteConfig } from "@/data/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const pages = ["", "/iphones", "/plan-recambio", "/comparador", "/nosotros", "/preguntas-frecuentes", "/contacto"].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === "/iphones" ? ("daily" as const) : ("weekly" as const),
    priority: p === "" ? 1 : 0.8,
  }));
  const products = (await getProducts()).map((p) => ({
    url: `${base}/iphones/${p.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));
  return [...pages, ...products];
}
