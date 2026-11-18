import type { ModelId } from "@/types";

/* =========================================================
   RENDERS AUTOMÁTICOS POR MODELO Y COLOR
   Archivo generado: vista frontal de cada iPhone en
   /public/products/renders/<modelo>/<color>.webp.
   Fuente de los marcos: github.com/jonnyjackson26/device-frames-media
   Se usan cuando un artículo no tiene fotos propias cargadas.
   ========================================================= */

export interface RenderVariant {
  name: string;
  hex: string;
  src: string;
}

export const renders: Partial<Record<ModelId, RenderVariant[]>> = {
  "iphone-13": [
    {
      "name": "Midnight",
      "hex": "#232831",
      "src": "/products/renders/iphone-13/midnight.webp"
    },
    {
      "name": "Starlight",
      "hex": "#F2EDE6",
      "src": "/products/renders/iphone-13/starlight.webp"
    },
    {
      "name": "Blue",
      "hex": "#3F6A8F",
      "src": "/products/renders/iphone-13/blue.webp"
    },
    {
      "name": "Pink",
      "hex": "#F4D7D3",
      "src": "/products/renders/iphone-13/pink.webp"
    },
    {
      "name": "Red",
      "hex": "#B5161D",
      "src": "/products/renders/iphone-13/red.webp"
    }
  ],
  "iphone-14": [
    {
      "name": "Midnight",
      "hex": "#262B33",
      "src": "/products/renders/iphone-14/midnight.webp"
    },
    {
      "name": "Starlight",
      "hex": "#F2EDE6",
      "src": "/products/renders/iphone-14/starlight.webp"
    },
    {
      "name": "Blue",
      "hex": "#A0B4C7",
      "src": "/products/renders/iphone-14/blue.webp"
    },
    {
      "name": "Red",
      "hex": "#B5161D",
      "src": "/products/renders/iphone-14/red.webp"
    }
  ],
  "iphone-14-pro": [
    {
      "name": "Space Black",
      "hex": "#2F2E30",
      "src": "/products/renders/iphone-14-pro/space-black.webp"
    },
    {
      "name": "Silver",
      "hex": "#F0F0EB",
      "src": "/products/renders/iphone-14-pro/silver.webp"
    },
    {
      "name": "Gold",
      "hex": "#F4E8CE",
      "src": "/products/renders/iphone-14-pro/gold.webp"
    },
    {
      "name": "Deep Purple",
      "hex": "#594F63",
      "src": "/products/renders/iphone-14-pro/deep-purple.webp"
    }
  ],
  "iphone-15": [
    {
      "name": "Pink",
      "hex": "#F2D9DA",
      "src": "/products/renders/iphone-15/pink.webp"
    },
    {
      "name": "Yellow",
      "hex": "#EDE6C8",
      "src": "/products/renders/iphone-15/yellow.webp"
    },
    {
      "name": "Black",
      "hex": "#35373A",
      "src": "/products/renders/iphone-15/black.webp"
    }
  ],
  "iphone-15-pro": [
    {
      "name": "Black Titanium",
      "hex": "#3C3C3D",
      "src": "/products/renders/iphone-15-pro/black-titanium.webp"
    },
    {
      "name": "Blue Titanium",
      "hex": "#4A5364",
      "src": "/products/renders/iphone-15-pro/blue-titanium.webp"
    },
    {
      "name": "Natural Titanium",
      "hex": "#BDB6A9",
      "src": "/products/renders/iphone-15-pro/natural-titanium.webp"
    },
    {
      "name": "White Titanium",
      "hex": "#F2F1ED",
      "src": "/products/renders/iphone-15-pro/white-titanium.webp"
    }
  ],
  "iphone-15-pro-max": [
    {
      "name": "Black Titanium",
      "hex": "#3C3C3D",
      "src": "/products/renders/iphone-15-pro-max/black-titanium.webp"
    },
    {
      "name": "Blue Titanium",
      "hex": "#4A5364",
      "src": "/products/renders/iphone-15-pro-max/blue-titanium.webp"
    },
    {
      "name": "Natural Titanium",
      "hex": "#BDB6A9",
      "src": "/products/renders/iphone-15-pro-max/natural-titanium.webp"
    },
    {
      "name": "White Titanium",
      "hex": "#F2F1ED",
      "src": "/products/renders/iphone-15-pro-max/white-titanium.webp"
    }
  ],
  "iphone-16": [
    {
      "name": "Black",
      "hex": "#3C3C3D",
      "src": "/products/renders/iphone-16/black.webp"
    },
    {
      "name": "White",
      "hex": "#F5F5F2",
      "src": "/products/renders/iphone-16/white.webp"
    },
    {
      "name": "Pink",
      "hex": "#F2ADDA",
      "src": "/products/renders/iphone-16/pink.webp"
    },
    {
      "name": "Teal",
      "hex": "#B0D4D2",
      "src": "/products/renders/iphone-16/teal.webp"
    },
    {
      "name": "Ultramarine",
      "hex": "#5A6FE0",
      "src": "/products/renders/iphone-16/ultramarine.webp"
    }
  ],
  "iphone-16-pro": [
    {
      "name": "Black Titanium",
      "hex": "#3B3B3A",
      "src": "/products/renders/iphone-16-pro/black-titanium.webp"
    },
    {
      "name": "White Titanium",
      "hex": "#F2F1ED",
      "src": "/products/renders/iphone-16-pro/white-titanium.webp"
    },
    {
      "name": "Natural Titanium",
      "hex": "#BFB8AC",
      "src": "/products/renders/iphone-16-pro/natural-titanium.webp"
    },
    {
      "name": "Desert Titanium",
      "hex": "#BFA48F",
      "src": "/products/renders/iphone-16-pro/desert-titanium.webp"
    }
  ],
  "iphone-16-pro-max": [
    {
      "name": "Black Titanium",
      "hex": "#3B3B3A",
      "src": "/products/renders/iphone-16-pro-max/black-titanium.webp"
    },
    {
      "name": "White Titanium",
      "hex": "#F2F1ED",
      "src": "/products/renders/iphone-16-pro-max/white-titanium.webp"
    },
    {
      "name": "Natural Titanium",
      "hex": "#BFB8AC",
      "src": "/products/renders/iphone-16-pro-max/natural-titanium.webp"
    },
    {
      "name": "Desert Titanium",
      "hex": "#BFA48F",
      "src": "/products/renders/iphone-16-pro-max/desert-titanium.webp"
    }
  ],
  "iphone-17": [
    {
      "name": "Black",
      "hex": "#2A2A2C",
      "src": "/products/renders/iphone-17/black.webp"
    },
    {
      "name": "White",
      "hex": "#F5F5F2",
      "src": "/products/renders/iphone-17/white.webp"
    }
  ],
  "iphone-17-pro": [
    {
      "name": "Cosmic Orange",
      "hex": "#E0762F",
      "src": "/products/renders/iphone-17-pro/cosmic-orange.webp"
    },
    {
      "name": "Deep Blue",
      "hex": "#2E3A55",
      "src": "/products/renders/iphone-17-pro/deep-blue.webp"
    },
    {
      "name": "Silver",
      "hex": "#DADAD6",
      "src": "/products/renders/iphone-17-pro/silver.webp"
    }
  ],
  "iphone-17-pro-max": [
    {
      "name": "Cosmic Orange",
      "hex": "#E0762F",
      "src": "/products/renders/iphone-17-pro-max/cosmic-orange.webp"
    },
    {
      "name": "Deep Blue",
      "hex": "#2E3A55",
      "src": "/products/renders/iphone-17-pro-max/deep-blue.webp"
    },
    {
      "name": "Silver",
      "hex": "#DADAD6",
      "src": "/products/renders/iphone-17-pro-max/silver.webp"
    }
  ]
};
