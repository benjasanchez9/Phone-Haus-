import type { FaqCategory } from "@/types";
import { siteConfig } from "./site-config";

const w = siteConfig.warranty;

/* =========================================================
   PREGUNTAS FRECUENTES
   Las respuestas sobre garantía se construyen desde siteConfig
   para no duplicar textos comerciales.
   ========================================================= */

export const faqCategories: FaqCategory[] = [
  {
    id: "compras",
    title: "Compras",
    items: [
      {
        id: "como-comprar",
        question: "¿Cómo compro un iPhone?",
        answer:
          "Elegí el equipo en el catálogo y tocá “Consultar por WhatsApp”. Te confirmamos disponibilidad, forma de pago y entrega en el momento.",
      },
      {
        id: "local",
        question: "¿Tienen local físico?",
        answer: "Próximamente. Mientras tanto, coordinamos cada venta y entrega por WhatsApp.",
      },
    ],
  },
  {
    id: "nuevos",
    title: "iPhones nuevos",
    items: [
      {
        id: "diferencia",
        question: "¿Qué diferencia hay entre un iPhone nuevo y uno seminuevo?",
        answer:
          "Un iPhone nuevo viene sellado de fábrica, sin uso previo y con garantía oficial de Apple. Un seminuevo tuvo un dueño anterior: lo revisamos punto por punto, informamos su salud de batería y estado estético, y lo vendemos con garantía Phone Haus.",
      },
      {
        id: "garantia-nuevos",
        question: "¿Qué garantía tienen los iPhones nuevos?",
        answer: w.new.text,
      },
    ],
  },
  {
    id: "seminuevos",
    title: "iPhones seminuevos",
    items: [
      {
        id: "garantia-seminuevos",
        question: "¿Qué garantía tienen los seminuevos?",
        answer: w.used.text,
      },
      {
        id: "checked",
        question: "¿Qué revisan en cada seminuevo?",
        answer: `Cada equipo pasa por la revisión Phone Haus Checked antes de publicarse: ${siteConfig.checkedPoints.join(", ").toLowerCase()}.`,
      },
      {
        id: "bateria",
        question: "¿Cómo sé el estado de la batería?",
        answer: "Cada seminuevo muestra su salud de batería en la ficha del producto, tal como la informa el equipo.",
      },
    ],
  },
  {
    id: "garantia",
    title: "Garantía",
    items: [
      {
        id: "cubre",
        question: "¿Qué cubre la garantía?",
        answer: `Nuevos: ${w.new.duration} de garantía oficial de Apple. Seminuevos: ${w.used.duration} de garantía Phone Haus ante fallas de software o funcionamiento interno.`,
      },
      {
        id: "no-cubre",
        question: "¿Qué no cubre la garantía?",
        answer: `La garantía no cubre: ${w.notCovered.join(", ").toLowerCase()}.`,
      },
    ],
  },
  {
    id: "recambio",
    title: "Plan Recambio",
    items: [
      {
        id: "aceptan",
        question: "¿Qué equipos aceptan en Plan Recambio?",
        answer:
          "Aceptamos iPhone 11 en adelante, siempre que no tengan piezas cambiadas, estén libres de iCloud y tengan el IMEI sin bloqueo.",
      },
      {
        id: "reparados",
        question: "¿Aceptan equipos reparados?",
        answer:
          "Los equipos con piezas cambiadas no tienen cotización automática. Escribinos y lo evaluamos de forma personalizada.",
      },
      {
        id: "calculo",
        question: "¿Cómo se calcula el valor de mi iPhone?",
        answer:
          "Partimos de un valor base según modelo y capacidad, y aplicamos ajustes por salud de batería y estado de pantalla, laterales y parte trasera.",
      },
      {
        id: "definitiva",
        question: "¿La cotización online es definitiva?",
        answer:
          "No. La cotización es estimativa y está sujeta a revisión física del equipo por parte de Phone Haus.",
      },
    ],
  },
  {
    id: "pagos",
    title: "Pagos",
    items: [
      {
        id: "mercadopago",
        question: "¿Puedo pagar con Mercado Pago?",
        answer: `Sí. Aceptamos ${siteConfig.payments.methods.map((m) => m.label.toLowerCase()).join(", ")}.`,
      },
      {
        id: "cuotas",
        question: "¿Tienen cuotas?",
        answer: `Sí, podés financiar tu compra en cuotas a través de ${siteConfig.payments.installments.provider}. ${siteConfig.payments.installments.note}`,
      },
    ],
  },
  {
    id: "envios",
    title: "Envíos",
    items: [
      {
        id: "envios",
        question: "¿Realizan envíos?",
        answer: `${siteConfig.shipping.headline} Enviamos a Montevideo e interior. ${siteConfig.shipping.note}`,
      },
    ],
  },
];
