/* =========================================================
   CONFIGURACIÓN CENTRAL — PHONE HAUS
   Todo dato comercial se edita acá. Ningún componente debería
   repetir estos textos o valores.
   ========================================================= */

export const siteConfig = {
  brandName: "PHONE HAUS",
  shortName: "Phone Haus",
  claim: "TECNOLOGÍA CON CONFIANZA",
  description:
    "iPhones nuevos sellados y seminuevos verificados en Uruguay. Garantía, Plan Recambio y financiación con Mercado Pago.",

  // REPLACE: dominio definitivo. También configurable con NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://phonehaus.uy",

  instagram: {
    handle: "@phonehaus.uy",
    url: "https://www.instagram.com/phonehaus.uy/",
  },

  /**
   * WhatsApp: número en formato internacional, SOLO dígitos (ej. 59899123456).
   * Se toma de NEXT_PUBLIC_WHATSAPP_NUMBER; si está vacío, los links abren
   * WhatsApp con el mensaje listo para elegir el contacto (no se rompen).
   * REPLACE: definir el número real en .env.local o en Vercel.
   */
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    defaultMessage: "Hola Phone Haus 👋 Quiero consultar por un iPhone.",
  },

  // REPLACE: completar cuando exista el local. null = se muestra "Próximamente".
  location: {
    status: "proximamente" as "proximamente" | "abierto",
    label: "Próximamente",
    address: null as string | null,
    hours: null as string | null,
    phone: null as string | null,
    mapsUrl: null as string | null,
  },

  email: null as string | null, // REPLACE: email de contacto si existe

  payments: {
    methods: [
      { id: "efectivo", label: "Efectivo", detail: "Al retirar o coordinar la entrega." },
      { id: "transferencia", label: "Transferencia", detail: "Transferencia bancaria." },
      { id: "mercadopago", label: "Mercado Pago", detail: "Pagá con tu cuenta o tarjeta." },
      { id: "cuotas", label: "Cuotas", detail: "Financiación con tarjeta a través de Mercado Pago." },
    ],
    installments: {
      enabled: true,
      // DEMO DATA - REPLACE BEFORE PRODUCTION: confirmar cantidad de cuotas vigente
      maxInstallments: 12,
      provider: "Mercado Pago",
      note: "Cuotas sujetas a las condiciones de tu tarjeta y de Mercado Pago.",
    },
  },

  shipping: {
    headline: "Realizamos envíos.",
    // REPLACE: completar zonas, tiempos y costos. null = "A coordinar".
    zones: [
      { id: "montevideo", label: "Montevideo", time: null as string | null, cost: null as string | null },
      { id: "interior", label: "Interior", time: null as string | null, cost: null as string | null },
    ],
    note: "Coordinamos cada envío por WhatsApp.",
  },

  warranty: {
    new: {
      title: "Nuevos y sellados",
      duration: "1 año",
      text: "Todos nuestros dispositivos nuevos vienen sellados de fábrica y cuentan con 1 año de garantía oficial de Apple, válida a nivel internacional.",
    },
    used: {
      title: "Seminuevos",
      duration: "6 meses",
      text: "Nuestros equipos seminuevos están certificados y verificados por técnicos especializados. Incluyen 6 meses de garantía ante fallas de software o funcionamiento interno.",
    },
    notCovered: ["Golpes", "Caídas", "Daños por líquidos", "Mal uso"],
  },

  checkedPoints: [
    "Pantalla",
    "Batería",
    "Face ID",
    "Cámaras",
    "Carga",
    "Botones",
    "Conectividad",
    "Audio",
  ],

  features: {
    /** Sin testimonios reales todavía: la sección queda oculta. */
    SHOW_TESTIMONIALS: false,
  },

  nav: [
    { href: "/iphones", label: "iPhones" },
    { href: "/plan-recambio", label: "Plan Recambio" },
    { href: "/comparador", label: "Comparador" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
