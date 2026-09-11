import { tradeInBaseValues, tradeInModels } from "@/data/trade-in-values";
import {
  backLabels,
  functionalQuestions,
  screenLabels,
  sidesLabels,
  tradeInRules,
  type RuleOutcome,
} from "@/data/trade-in-rules";
import type { TradeInAdjustment, TradeInInput, TradeInModel, TradeInResult } from "@/types";
import { formatStorage } from "@/utils/format";

/* =========================================================
   MOTOR DE COTIZACIÓN — PLAN RECAMBIO
   Lógica pura, sin React. Recibe las respuestas del usuario
   y devuelve un resultado tipado. Reglas en data/trade-in-rules.ts.
   ========================================================= */

export function getTradeInModel(id: string): TradeInModel | undefined {
  return tradeInModels.find((m) => m.id === id);
}

export function getBaseValue(modelId: string, storageGB: number): number | null {
  return tradeInBaseValues[modelId]?.[storageGB] ?? null;
}

export function isValidBattery(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 0 && value <= 100;
}

function batteryPercent(health: number) {
  const tier = tradeInRules.battery.find((t) => health >= t.min) ?? tradeInRules.battery[tradeInRules.battery.length - 1];
  return tier;
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

export function calculateTradeIn(input: TradeInInput): TradeInResult {
  const model = getTradeInModel(input.modelId);
  if (!model) return { status: "unavailable", reasons: ["Modelo no reconocido"] };

  if (model.generation < tradeInRules.minGeneration) {
    return { status: "ineligible", reasons: [`Aceptamos desde iPhone ${tradeInRules.minGeneration} en adelante`] };
  }

  // 1. Bloqueantes absolutos (iCloud / IMEI)
  const ineligible: string[] = [];
  const manual: string[] = [];

  for (const q of functionalQuestions) {
    if (!input.functional[q.key]) {
      const outcome = tradeInRules.functional[q.key] as RuleOutcome;
      if (outcome === "ineligible") ineligible.push(q.failReason);
      else if (outcome === "manual") manual.push(q.failReason);
    }
  }
  if (ineligible.length) return { status: "ineligible", reasons: ineligible };

  // 2. Piezas cambiadas: sin cotización automática
  if (input.repairedParts) {
    return { status: "manual-review", reasons: ["El equipo tuvo piezas cambiadas o reparaciones"] };
  }

  // 3. Estado físico que requiere revisión
  if (tradeInRules.screen[input.screen] === "manual") manual.push(screenLabels[input.screen]);
  if (tradeInRules.back[input.back] === "manual") manual.push(`Parte trasera: ${backLabels[input.back].toLowerCase()}`);
  if (manual.length) return { status: "manual-review", reasons: manual };

  if (!isValidBattery(input.batteryHealth)) {
    return { status: "unavailable", reasons: ["Salud de batería inválida"] };
  }

  // 4. Valor base
  const base = getBaseValue(input.modelId, input.storageGB);
  if (base === null) {
    return {
      status: "unavailable",
      reasons: [`Todavía no tenemos valor online para ${model.name} de ${formatStorage(input.storageGB)}`],
    };
  }

  // 5. Ajustes porcentuales
  const adjustments: TradeInAdjustment[] = [];
  const push = (label: string, percent: number) => {
    if (percent !== 0) adjustments.push({ label, percent, amountUSD: Math.round((base * percent) / 100) });
  };

  const bat = batteryPercent(input.batteryHealth);
  push(`Batería ${input.batteryHealth}%`, bat.percent);
  push(`Pantalla: ${screenLabels[input.screen].toLowerCase()}`, tradeInRules.screen[input.screen] as number);
  push(`Laterales: ${sidesLabels[input.sides].toLowerCase()}`, tradeInRules.sides[input.sides] as number);
  push(`Parte trasera: ${backLabels[input.back].toLowerCase()}`, tradeInRules.back[input.back] as number);

  const totalPercent = adjustments.reduce((acc, a) => acc + a.percent, 0);
  const raw = base * (1 + totalPercent / 100);
  const estimated = Math.max(0, roundTo(raw, tradeInRules.roundTo));

  return { status: "quoted", baseUSD: base, adjustments, estimatedUSD: estimated };
}

/** Diferencia a pagar. Nunca negativa: si el equipo cubre todo, devuelve 0 y el excedente. */
export function calculateDifference(productPrice: number, tradeInValue: number) {
  const diff = productPrice - tradeInValue;
  return { toPay: Math.max(0, diff), surplus: Math.max(0, -diff) };
}
