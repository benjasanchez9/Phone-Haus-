import { renders } from "@/data/renders";
import type { ModelId } from "@/types";

/* =========================================================
   ELECCIÓN DEL RENDER AUTOMÁTICO
   Dado un modelo y el color cargado en /admin (texto libre),
   devuelve la imagen del iPhone en ese color, si existe.
   1. Coincidencia por nombre (inglés o español: "Negro", "Titanio natural"…).
   2. Si no, el color más parecido según el tono elegido en /admin,
      solo si es realmente parecido.
   3. Si no hay nada parecido → undefined (el sitio usa la ilustración).
   ========================================================= */

const ALIASES: Record<string, string> = {
  negro: "black",
  blanco: "white",
  plata: "silver",
  plateado: "silver",
  azul: "blue",
  rosa: "pink",
  rosado: "pink",
  rojo: "red",
  amarillo: "yellow",
  dorado: "gold",
  oro: "gold",
  naranja: "orange",
  violeta: "purple",
  morado: "purple",
  purpura: "purple",
  verde: "green",
  "verde azulado": "teal",
  ultramar: "ultramarine",
  medianoche: "midnight",
  "blanco estelar": "starlight",
  "luz estelar": "starlight",
  natural: "natural",
  desierto: "desert",
  "negro espacial": "space black",
  "azul profundo": "deep blue",
  "naranja cosmico": "cosmic orange",
  "morado oscuro": "deep purple",
  "purpura oscuro": "deep purple",
};

const KNOWN_COLORS = new Set([
  ...Object.values(ALIASES),
  "lavender", "sage", "mist blue", "sky blue", "light gold", "cloud white", "graphite",
  "sierra blue", "alpine green", "pacific blue", "space gray", "space grey", "rose gold",
]);

function normalize(name: string): string {
  let s = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\(product\)\s*/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  s = s.replace(/\btitanio\b/g, "titanium");
  // "titanium negro" → "negro"
  const bare = s.replace(/\btitanium\b/g, "").trim();
  const translated = ALIASES[bare] ?? ALIASES[s] ?? bare;
  return s.includes("titanium") ? `${translated} titanium` : translated;
}

function rgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

function distance(a: string, b: string): number {
  const x = rgb(a), y = rgb(b);
  if (!x || !y) return Infinity;
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

/** Distancia máxima para aceptar un color "parecido" (0–441). */
const MAX_DISTANCE = 60;

export function renderFor(modelId: ModelId | string, colorName: string, colorHex?: string): string | undefined {
  const variants = renders[modelId as ModelId];
  if (!variants?.length) return undefined;

  const wanted = normalize(colorName);
  const byName =
    variants.find((v) => normalize(v.name) === wanted) ??
    // "Black" también encuentra "Black Titanium" y viceversa
    variants.find((v) => {
      const n = normalize(v.name).replace(" titanium", "");
      return n === wanted.replace(" titanium", "");
    });
  if (byName) return byName.src;

  // Si el nombre es un color conocido que no tenemos en imagen (ej. "Verde"),
  // mejor la ilustración que un iPhone de otro color.
  if (KNOWN_COLORS.has(wanted.replace(" titanium", ""))) return undefined;

  if (colorHex) {
    const closest = variants
      .map((v) => ({ v, d: distance(v.hex, colorHex) }))
      .sort((a, b) => a.d - b.d)[0];
    if (closest && closest.d <= MAX_DISTANCE) return closest.v.src;
  }
  return undefined;
}

/** Fotos cargadas del artículo; si no tiene, el render automático. */
export function imagesFor(images: string[], modelId: ModelId | string, colorName: string, colorHex?: string): string[] {
  if (images.length > 0) return images;
  const auto = renderFor(modelId, colorName, colorHex);
  return auto ? [auto] : [];
}
