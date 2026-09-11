import { siteConfig } from "@/data/site-config";
import { backLabels, screenLabels, sidesLabels } from "@/data/trade-in-rules";
import type { Product, TradeInInput, TradeInResult } from "@/types";
import { conditionLabel, formatStorage, formatUSD } from "@/utils/format";

/* =========================================================
   GENERADOR DE LINKS DE WHATSAPP
   Si no hay número configurado, abre WhatsApp con el mensaje
   listo para elegir el contacto (el link nunca queda roto).
   ========================================================= */

export function whatsappUrl(message: string = siteConfig.whatsapp.defaultMessage): string {
  const number = siteConfig.whatsapp.number.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function productMessage(product: Product): string {
  const lines = [
    "Hola Phone Haus 👋",
    "",
    "Quiero consultar por este equipo:",
    `${product.name} ${formatStorage(product.storageGB)} — ${product.color.name}`,
    `Estado: ${conditionLabel[product.condition]}`,
    `Precio publicado: ${formatUSD(product.priceUSD)}`,
  ];
  if (product.used) lines.push(`Batería: ${product.used.batteryHealth}%`);
  lines.push("", `${siteConfig.url}/iphones/${product.slug}`);
  return lines.join("\n");
}

export function compareMessage(names: string[]): string {
  return ["Hola Phone Haus 👋", "", `Estoy comparando: ${names.join(", ")}.`, "¿Me ayudan a elegir?"].join("\n");
}

export function tradeInMessage(opts: {
  modelName: string;
  input: TradeInInput;
  result: TradeInResult;
  target?: Product | null;
  toPay?: number;
}): string {
  const { modelName, input, result, target, toPay } = opts;
  const lines = [
    "Hola Phone Haus 👋",
    "",
    "Hice una cotización mediante la web.",
    "",
    "Mi equipo:",
    modelName,
    formatStorage(input.storageGB),
  ];

  if (input.repairedParts) lines.push("Tuvo piezas cambiadas o reparaciones");
  else {
    lines.push(`Batería: ${input.batteryHealth}%`);
    lines.push(`Pantalla: ${screenLabels[input.screen].toLowerCase()}`);
    lines.push(`Laterales: ${sidesLabels[input.sides].toLowerCase()}`);
    lines.push(`Parte trasera: ${backLabels[input.back].toLowerCase()}`);
  }

  if (result.status === "quoted") {
    lines.push("", "Cotización estimada:", formatUSD(result.estimatedUSD));
  } else {
    lines.push("", "Resultado: requiere evaluación personalizada.");
    if (result.reasons.length) lines.push(`Motivo: ${result.reasons.join(", ")}`);
  }

  if (target) {
    lines.push("", "Quiero cambiarlo por:", `${target.name} ${formatStorage(target.storageGB)} (${conditionLabel[target.condition].toLowerCase()})`);
    lines.push("", "Precio:", formatUSD(target.priceUSD));
    if (result.status === "quoted" && typeof toPay === "number") {
      lines.push("", "Diferencia estimada:", formatUSD(toPay));
    }
  }

  lines.push("", result.status === "quoted" ? "Quiero coordinar una revisión del equipo." : "¿Me ayudan a evaluarlo?");
  return lines.join("\n");
}
