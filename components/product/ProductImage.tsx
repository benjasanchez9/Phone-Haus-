"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types";
import { PhoneRender } from "./PhoneRender";
import { cn } from "@/utils/cn";

/**
 * Imagen de producto con fallback elegante.
 * - Si `product.images[index]` existe → next/image optimizada.
 * - Si no existe o falla la carga → render placeholder de marca.
 * Nunca se muestra una imagen rota.
 */
export function ProductImage({
  product,
  index = 0,
  view = "back",
  priority,
  sizes = "(max-width: 640px) 50vw, 25vw",
  className,
}: {
  product: Pick<Product, "name" | "modelId" | "color" | "images">;
  index?: number;
  view?: "back" | "front";
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const src = product.images[index];
  const [failed, setFailed] = useState(false);
  const alt = `${product.name} color ${product.color.name}`;

  if (!src || failed) {
    return (
      <PhoneRender
        modelId={product.modelId}
        color={product.color.hex}
        view={view}
        title={alt}
        className={cn("h-full w-auto drop-shadow-[0_24px_30px_rgba(0,0,0,0.16)]", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn("object-contain", className)}
    />
  );
}
