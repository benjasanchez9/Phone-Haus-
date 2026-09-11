import type { Condition, CosmeticGrade, StockStatus } from "@/types";

const usd = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 });

/** 1449 → "USD 1.449" */
export function formatUSD(value: number): string {
  return `USD ${usd.format(Math.round(value))}`;
}

/** 1024 → "1 TB", 256 → "256 GB" */
export function formatStorage(gb: number): string {
  return gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`;
}

export const conditionLabel: Record<Condition, string> = {
  nuevo: "Nuevo",
  seminuevo: "Seminuevo",
};

export const stockLabel: Record<StockStatus, string> = {
  disponible: "Disponible",
  "ultimas-unidades": "Últimas unidades",
  agotado: "Agotado",
};

export const cosmeticLabel: Record<CosmeticGrade, string> = {
  excelente: "Estado excelente",
  "muy-bueno": "Muy buen estado",
  bueno: "Buen estado",
};

/** "iPhone 15 Pro" → "iPHONE 15 PRO" (respeta la i minúscula de la marca en titulares). */
export function displayName(name: string): string {
  return name.startsWith("iPhone") ? `i${name.slice(1).toUpperCase()}` : name.toUpperCase();
}
