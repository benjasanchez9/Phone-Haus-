import type { BackCondition, FunctionalChecks, ScreenCondition, SidesCondition } from "@/types";

/* =========================================================
   PLAN RECAMBIO — REGLAS DE NEGOCIO
   // DEMO DATA - REPLACE BEFORE PRODUCTION
   Porcentajes negativos = descuento sobre el valor base.
   "manual" = no se cotiza automáticamente → evaluación personalizada.
   "ineligible" = no se acepta el equipo.
   ========================================================= */

export type RuleOutcome = number | "manual" | "ineligible";

export const tradeInRules = {
  minGeneration: 11,

  /** Tramos de batería: se aplica el primero cuyo `min` se cumpla. */
  battery: [
    { min: 90, percent: 0, label: "90% o más" },
    { min: 85, percent: -3, label: "85–89%" },
    { min: 80, percent: -6, label: "80–84%" },
    { min: 0, percent: -10, label: "Menos de 80%" },
  ],

  screen: {
    excelente: 0,
    "rayas-leves": -4,
    "rayas-visibles": -8,
    rota: "manual",
  } satisfies Record<ScreenCondition, RuleOutcome>,

  sides: {
    excelente: 0,
    "marcas-leves": -3,
    "golpes-visibles": -8,
  } satisfies Record<SidesCondition, RuleOutcome>,

  back: {
    excelente: 0,
    "marcas-leves": -3,
    "vidrio-roto": "manual",
  } satisfies Record<BackCondition, RuleOutcome>,

  repairedParts: "ineligible-auto" as const,

  /** Resultado cuando el chequeo funcional da `false`. */
  functional: {
    powersOn: "manual",
    faceId: "manual",
    cameras: "manual",
    buttons: "manual",
    charging: "manual",
    audio: "manual",
    icloudFree: "ineligible",
    imeiClean: "ineligible",
  } satisfies Record<keyof FunctionalChecks, RuleOutcome>,

  /** Redondeo del valor final (múltiplos de USD). */
  roundTo: 5,
};

/* Etiquetas en lenguaje de usuario (UI + mensaje de WhatsApp) */
export const screenLabels: Record<ScreenCondition, string> = {
  excelente: "Excelente",
  "rayas-leves": "Rayas leves",
  "rayas-visibles": "Rayas visibles",
  rota: "Pantalla rota",
};

export const sidesLabels: Record<SidesCondition, string> = {
  excelente: "Excelente",
  "marcas-leves": "Marcas leves",
  "golpes-visibles": "Golpes visibles",
};

export const backLabels: Record<BackCondition, string> = {
  excelente: "Excelente",
  "marcas-leves": "Marcas leves",
  "vidrio-roto": "Vidrio roto",
};

export const functionalQuestions: { key: keyof FunctionalChecks; question: string; failReason: string }[] = [
  { key: "powersOn", question: "¿El equipo enciende?", failReason: "El equipo no enciende" },
  { key: "faceId", question: "¿Funciona Face ID?", failReason: "Falla de Face ID" },
  { key: "cameras", question: "¿Funcionan correctamente todas las cámaras?", failReason: "Falla en cámaras" },
  { key: "buttons", question: "¿Funcionan correctamente los botones?", failReason: "Falla en botones" },
  { key: "charging", question: "¿Carga correctamente?", failReason: "Problemas de carga" },
  { key: "audio", question: "¿Funcionan micrófono y parlantes?", failReason: "Falla de micrófono o parlantes" },
  { key: "icloudFree", question: "¿Podés cerrar sesión de iCloud (sin bloqueo de activación)?", failReason: "Bloqueo de iCloud / activación" },
  { key: "imeiClean", question: "¿El IMEI está libre (sin reporte ni bloqueo)?", failReason: "IMEI bloqueado" },
];
