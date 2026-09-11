"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { ProductImage } from "./ProductImage";
import { cn } from "@/utils/cn";

/**
 * Galería: usa las imágenes reales si existen; si no, dos vistas del render
 * placeholder (dorso y frente).
 */
export function ProductGallery({ product }: { product: Product }) {
  const slides: { key: string; index: number; view: "back" | "front"; label: string }[] =
    product.images.length > 0
      ? product.images.map((_, i) => ({ key: `img-${i}`, index: i, view: "back" as const, label: `Imagen ${i + 1}` }))
      : [
          { key: "back", index: 99, view: "back", label: "Dorso" },
          { key: "front", index: 99, view: "front", label: "Frente" },
        ];
  const [active, setActive] = useState(0);
  const current = slides[active];

  return (
    <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md bg-gradient-to-b from-[#ECECE7] to-surface">
        <div key={current.key} className="absolute inset-0 flex animate-settle items-center justify-center p-[11%]">
          <ProductImage product={product} index={current.index} view={current.view} priority sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
      </div>
      {slides.length > 1 && (
        <div className="mt-3 flex gap-3" role="tablist" aria-label="Vistas del producto">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={s.label}
              onClick={() => setActive(i)}
              className={cn(
                "relative flex h-20 w-20 items-center justify-center overflow-hidden rounded bg-surface p-2 ring-1 ring-inset transition-shadow",
                i === active ? "ring-2 ring-blue" : "ring-line hover:ring-ink/30",
              )}
            >
              <ProductImage product={product} index={s.index} view={s.view} sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
