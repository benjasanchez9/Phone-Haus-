import type { TradeInModel } from "@/types";

/* =========================================================
   PLAN RECAMBIO — MODELOS Y VALORES BASE
   // DEMO DATA - REPLACE BEFORE PRODUCTION
   Valores base en USD por modelo y capacidad (GB).
   Si una combinación no tiene valor cargado, el cotizador deriva
   a evaluación personalizada por WhatsApp (no se rompe).
   ========================================================= */

export const tradeInModels: TradeInModel[] = [
  { id: "iphone-11", name: "iPhone 11", generation: 11, capacities: [64, 128, 256] },
  { id: "iphone-11-pro", name: "iPhone 11 Pro", generation: 11, capacities: [64, 256, 512] },
  { id: "iphone-11-pro-max", name: "iPhone 11 Pro Max", generation: 11, capacities: [64, 256, 512] },
  { id: "iphone-12", name: "iPhone 12", generation: 12, capacities: [64, 128, 256] },
  { id: "iphone-12-pro", name: "iPhone 12 Pro", generation: 12, capacities: [128, 256, 512] },
  { id: "iphone-12-pro-max", name: "iPhone 12 Pro Max", generation: 12, capacities: [128, 256, 512] },
  { id: "iphone-13", name: "iPhone 13", generation: 13, capacities: [128, 256, 512] },
  { id: "iphone-13-pro", name: "iPhone 13 Pro", generation: 13, capacities: [128, 256, 512, 1024] },
  { id: "iphone-13-pro-max", name: "iPhone 13 Pro Max", generation: 13, capacities: [128, 256, 512, 1024] },
  { id: "iphone-14", name: "iPhone 14", generation: 14, capacities: [128, 256, 512] },
  { id: "iphone-14-plus", name: "iPhone 14 Plus", generation: 14, capacities: [128, 256, 512] },
  { id: "iphone-14-pro", name: "iPhone 14 Pro", generation: 14, capacities: [128, 256, 512, 1024] },
  { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", generation: 14, capacities: [128, 256, 512, 1024] },
  { id: "iphone-15", name: "iPhone 15", generation: 15, capacities: [128, 256, 512] },
  { id: "iphone-15-plus", name: "iPhone 15 Plus", generation: 15, capacities: [128, 256, 512] },
  { id: "iphone-15-pro", name: "iPhone 15 Pro", generation: 15, capacities: [128, 256, 512, 1024] },
  { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", generation: 15, capacities: [256, 512, 1024] },
  { id: "iphone-16", name: "iPhone 16", generation: 16, capacities: [128, 256, 512] },
  { id: "iphone-16-plus", name: "iPhone 16 Plus", generation: 16, capacities: [128, 256, 512] },
  { id: "iphone-16-pro", name: "iPhone 16 Pro", generation: 16, capacities: [128, 256, 512, 1024] },
  { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", generation: 16, capacities: [256, 512, 1024] },
];

// DEMO DATA - REPLACE BEFORE PRODUCTION
export const tradeInBaseValues: Record<string, Record<number, number>> = {
  "iphone-11": { 64: 150, 128: 175, 256: 200 },
  "iphone-11-pro": { 64: 190, 256: 230, 512: 260 },
  "iphone-11-pro-max": { 64: 220, 256: 270, 512: 300 },
  "iphone-12": { 64: 210, 128: 240, 256: 270 },
  "iphone-12-pro": { 128: 300, 256: 340, 512: 380 },
  "iphone-12-pro-max": { 128: 340, 256: 390, 512: 430 },
  "iphone-13": { 128: 330, 256: 375, 512: 420 },
  "iphone-13-pro": { 128: 430, 256: 480, 512: 530 },
  "iphone-13-pro-max": { 128: 480, 256: 540, 512: 590 },
  "iphone-14": { 128: 420, 256: 470, 512: 520 },
  "iphone-14-pro": { 128: 550, 256: 620, 512: 680 },
  "iphone-14-pro-max": { 128: 620, 256: 690, 512: 750 },
  "iphone-15": { 128: 530, 256: 590, 512: 650 },
  "iphone-15-pro": { 128: 690, 256: 760, 512: 830 },
  "iphone-15-pro-max": { 256: 820, 512: 900 },
  "iphone-16": { 128: 680, 256: 740, 512: 800 },
  "iphone-16-pro": { 128: 850, 256: 920, 512: 990 },
  // Sin valor demo cargado (→ evaluación personalizada):
  // iphone-14-plus, iphone-15-plus, iphone-16-plus, iphone-16-pro-max, capacidades de 1 TB.
};
