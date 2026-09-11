import type { IphoneSpecs, ModelId } from "@/types";

/* =========================================================
   REGLAS DEL COMPARADOR (declarativas, sin IA)
   Cada regla elige un ganador entre los modelos comparados
   usando solo datos de data/iphone-specs.ts y precios del catálogo.
   ========================================================= */

export type PriorityId = "precio-calidad" | "camara" | "rendimiento" | "bateria" | "compacto";

export interface CompareCandidate {
  specs: IphoneSpecs;
  /** Menor precio disponible en Phone Haus, null si no hay stock. */
  price: number | null;
}

interface Rule {
  id: PriorityId;
  title: string;
  /** Pregunta que ve el usuario al elegir prioridad. */
  prompt: string;
  pick: (c: CompareCandidate[]) => CompareCandidate | null;
  reason: (winner: CompareCandidate) => string;
}

const by = <T,>(list: T[], score: (x: T) => number[]) =>
  [...list].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    for (let i = 0; i < sa.length; i++) if (sb[i] !== sa[i]) return sb[i] - sa[i];
    return 0;
  })[0] ?? null;

/** "Prestaciones modernas": Apple Intelligence o modelo 2023 en adelante. */
const isModern = (s: IphoneSpecs) => s.appleIntelligence === true || s.year >= 2023;

export const compareRules: Rule[] = [
  {
    id: "precio-calidad",
    title: "Mejor relación precio/calidad",
    prompt: "Precio/calidad",
    pick: (c) => {
      const priced = c.filter((x) => x.price !== null);
      const modern = priced.filter((x) => isModern(x.specs));
      const pool = modern.length ? modern : priced;
      return by(pool, (x) => [-(x.price as number), x.specs.metrics.chipGeneration]);
    },
    reason: (w) =>
      `Es la opción de menor precio que mantiene prestaciones actuales${w.specs.appleIntelligence ? ", incluida Apple Intelligence" : ""}.`,
  },
  {
    id: "camara",
    title: "Mejor cámara",
    prompt: "Cámara",
    pick: (c) => by(c, (x) => [x.specs.metrics.maxOpticalZoom > 1 ? 1 : 0, x.specs.year, x.specs.metrics.maxOpticalZoom, x.specs.metrics.screenInches]),
    reason: (w) =>
      w.specs.metrics.maxOpticalZoom > 1
        ? `Tiene teleobjetivo (${w.specs.telephoto ?? "ver ficha"}) y el sistema de cámaras Pro más reciente de la comparación.`
        : "Tiene el sistema de cámaras más reciente de la comparación.",
  },
  {
    id: "rendimiento",
    title: "Mejor rendimiento",
    prompt: "Rendimiento",
    pick: (c) => by(c, (x) => [x.specs.metrics.chipGeneration]),
    reason: (w) => `Tiene el chip más nuevo de la comparación: ${w.specs.chip ?? "ver ficha"}.`,
  },
  {
    id: "bateria",
    title: "Mejor batería",
    prompt: "Batería",
    pick: (c) => {
      // Solo se declara ganador si todos los modelos tienen el dato confirmado.
      if (c.some((x) => x.specs.metrics.videoHours === null)) return null;
      return by(c, (x) => [x.specs.metrics.videoHours as number]);
    },
    reason: (w) => `La mayor autonomía declarada por Apple entre los comparados: ${w.specs.battery?.toLowerCase() ?? "ver ficha"}.`,
  },
  {
    id: "compacto",
    title: "Más compacto",
    prompt: "Tamaño compacto",
    pick: (c) => by(c, (x) => [-x.specs.metrics.screenInches, -x.specs.metrics.weightGrams]),
    reason: (w) => `Pantalla de ${String(w.specs.metrics.screenInches).replace(".", ",")}" y ${w.specs.weight ?? "peso liviano"}: el más cómodo para usar con una mano.`,
  },
];

export function getHighlights(candidates: CompareCandidate[]) {
  if (candidates.length < 2) return [];
  return compareRules
    .map((rule) => {
      const winner = rule.pick(candidates);
      return winner ? { rule, winner, modelId: winner.specs.modelId as ModelId } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

export function getRecommendation(candidates: CompareCandidate[], priority: PriorityId) {
  const rule = compareRules.find((r) => r.id === priority);
  if (!rule || candidates.length === 0) return null;
  const winner = rule.pick(candidates);
  if (!winner) return null;
  return { rule, winner, text: rule.reason(winner) };
}
