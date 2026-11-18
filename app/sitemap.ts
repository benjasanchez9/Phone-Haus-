import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { siteConfig } from "@/data/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const list = await getProducts();

  // El catálogo cambia cuando cambia algún artículo: usamos la fecha más reciente.
  const latest = list.reduce<Date | null>((acc, p) => {
    const d = p.updatedAt ? new Date(p.updatedAt) : null;
    return d && (!acc || d > acc) ? d : acc;
  }, null);

  const pages = ["", "/iphones", "/plan-recambio", "/comparador", "/nosotros", "/preguntas-frecuentes", "/contacto"].map((p) => ({
    url: `${base}${p}`,
    lastModified: p === "/iphones" && latest ? latest : now,
    changeFrequency: p === "/iphones" ? ("daily" as const) : ("weekly" as const),
    priority: p === "" ? 1 : 0.8,
  }));
  const products = list.map((p) => ({
    url: `${base}/iphones/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));
  return [...pages, ...products];
}
