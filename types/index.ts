/* =========================================================
   Tipos de dominio PHONE HAUS
   Diseñados para que la fuente de datos (archivos locales hoy)
   pueda reemplazarse por CMS / Supabase / API sin tocar la UI.
   ========================================================= */

export type Condition = "nuevo" | "seminuevo";

export type StockStatus = "disponible" | "ultimas-unidades" | "agotado";

export type CosmeticGrade = "excelente" | "muy-bueno" | "bueno";

/** Identificador de modelo, compartido entre catálogo y especificaciones. */
export type ModelId =
  | "iphone-13"
  | "iphone-14"
  | "iphone-14-pro"
  | "iphone-15"
  | "iphone-15-pro"
  | "iphone-15-pro-max"
  | "iphone-16"
  | "iphone-16-pro"
  | "iphone-16-pro-max"
  | "iphone-17"
  | "iphone-17-pro"
  | "iphone-17-pro-max";

export interface ProductColor {
  name: string;
  /** Color aproximado para el render placeholder. */
  hex: string;
}

export interface UsedDetails {
  batteryHealth: number;
  cosmetic: CosmeticGrade;
  /** Descripción del estado funcional. */
  functional: string;
}

export interface Product {
  id: string;
  slug: string;
  modelId: ModelId;
  name: string;
  condition: Condition;
  storageGB: number;
  color: ProductColor;
  priceUSD: number;
  stock: StockStatus;
  featured: boolean;
  /** Mayor = más reciente. Se usa para ordenar por "Más recientes". */
  releaseOrder: number;
  /** Rutas en /public/products. Si están vacías se usa el render placeholder. */
  images: string[];
  used?: UsedDetails;
  shortDescription?: string;
}

/* ---------- Especificaciones ---------- */

/** null = dato no confirmado → la UI muestra "Consultar ficha oficial". */
export type SpecValue = string | null;

export interface IphoneSpecs {
  modelId: ModelId;
  name: string;
  year: number;
  /** Valores numéricos usados por las reglas de comparación. */
  metrics: {
    screenInches: number;
    weightGrams: number;
    videoHours: number | null;
    maxOpticalZoom: number;
    chipGeneration: number;
  };
  display: SpecValue;
  size: SpecValue;
  weight: SpecValue;
  chip: SpecValue;
  material: SpecValue;
  mainCamera: SpecValue;
  ultraWide: SpecValue;
  telephoto: SpecValue;
  zoom: SpecValue;
  frontCamera: SpecValue;
  video: SpecValue;
  battery: SpecValue;
  connector: SpecValue;
  magsafe: boolean | null;
  dynamicIsland: boolean | null;
  appleIntelligence: boolean | null;
  waterResistance: SpecValue;
  family: "base" | "pro" | "pro-max";
}

/* ---------- Plan Recambio ---------- */

export type TradeInModelId = string;

export interface TradeInModel {
  id: TradeInModelId;
  name: string;
  generation: number;
  capacities: number[];
}

export type ScreenCondition = "excelente" | "rayas-leves" | "rayas-visibles" | "rota";
export type SidesCondition = "excelente" | "marcas-leves" | "golpes-visibles";
export type BackCondition = "excelente" | "marcas-leves" | "vidrio-roto";

export interface FunctionalChecks {
  powersOn: boolean;
  faceId: boolean;
  cameras: boolean;
  buttons: boolean;
  charging: boolean;
  audio: boolean;
  icloudFree: boolean;
  imeiClean: boolean;
}

export interface TradeInInput {
  modelId: TradeInModelId;
  storageGB: number;
  repairedParts: boolean;
  batteryHealth: number;
  screen: ScreenCondition;
  sides: SidesCondition;
  back: BackCondition;
  functional: FunctionalChecks;
}

export interface TradeInAdjustment {
  label: string;
  percent: number;
  amountUSD: number;
}

export type TradeInResult =
  | {
      status: "quoted";
      baseUSD: number;
      adjustments: TradeInAdjustment[];
      estimatedUSD: number;
    }
  | { status: "manual-review"; reasons: string[] }
  | { status: "ineligible"; reasons: string[] }
  | { status: "unavailable"; reasons: string[] };

/* ---------- FAQ / contenido ---------- */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  product?: string;
  isDemo: boolean;
}
