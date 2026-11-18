import { getProducts } from "@/lib/catalog";
import { siteConfig } from "@/data/site-config";
import { faqCategories } from "@/data/faq";
import { conditionLabel, formatStorage, formatUSD } from "@/utils/format";

/* =========================================================
   /llms.txt — resumen del sitio para buscadores con IA
   (ChatGPT, Perplexity, Gemini…). Se arma con los mismos
   datos del sitio, así que se actualiza solo.
   ========================================================= */

export const revalidate = 3600;

export async function GET() {
  const products = (await getProducts()).filter((p) => p.stock !== "agotado");
  const url = siteConfig.url;
  const w = siteConfig.warranty;

  const lines = [
    `# ${siteConfig.shortName}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.shortName} es un revendedor independiente de iPhones en Uruguay. Vende equipos nuevos sellados y seminuevos verificados, y acepta el iPhone del cliente como parte de pago (Plan Recambio).`,
    "",
    "## Garantía",
    "",
    `- ${w.new.title}: ${w.new.text}`,
    `- ${w.used.title}: ${w.used.text}`,
    "",
    "## Formas de pago",
    "",
    ...siteConfig.payments.methods.map((m) => `- ${m.label}: ${m.detail}`),
    "",
    "## Páginas principales",
    "",
    `- [Catálogo de iPhones](${url}/iphones): equipos disponibles con precio en dólares`,
    `- [Plan Recambio](${url}/plan-recambio): cotización online del iPhone usado como parte de pago`,
    `- [Comparador](${url}/comparador): comparación de modelos de iPhone`,
    `- [Preguntas frecuentes](${url}/preguntas-frecuentes): compras, garantía, pagos y envíos`,
    `- [Contacto](${url}/contacto): WhatsApp e Instagram ${siteConfig.instagram.handle}`,
    "",
    "## Equipos disponibles",
    "",
    ...products.map(
      (p) =>
        `- [${p.name} ${formatStorage(p.storageGB)} ${p.color.name}, ${conditionLabel[p.condition].toLowerCase()}](${url}/iphones/${p.slug}): ${formatUSD(p.priceUSD)}`,
    ),
    "",
    "## Preguntas frecuentes",
    "",
    ...faqCategories.flatMap((c) => c.items.map((q) => `- ${q.question}`)),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
