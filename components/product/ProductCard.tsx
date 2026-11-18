import Link from "next/link";
import type { Product } from "@/types";
import { conditionLabel, formatStorage, formatUSD, stockLabel } from "@/utils/format";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "./ProductImage";
import { CompareToggle } from "@/components/compare/CompareToggle";
import { cn } from "@/utils/cn";

/**
 * Tarjeta de producto. Muestra solo lo que cambia entre equipos
 * (estado, precio, batería, stock si es poco). Cuotas y garantía se
 * explican una vez arriba del listado. Toda la tarjeta es el link.
 */
export function ProductCard({ product, priority }: { product: Product; priority?: boolean; compact?: boolean }) {
  const soldOut = product.stock === "agotado";
  const href = `/iphones/${product.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-surface transition-colors duration-200 hover:border-ink/30">
      <div className="relative block aspect-[4/4.2] overflow-hidden bg-gradient-to-b from-[#EFEFEB] to-surface">
        <div className={cn("absolute inset-0 flex items-center justify-center p-[12%]", soldOut && "opacity-45 grayscale")}>
          <ProductImage product={product} priority={priority} sizes="(max-width: 640px) 45vw, 25vw" />
        </div>
        <div className="absolute left-2.5 top-2.5 flex gap-1.5 sm:left-3 sm:top-3">
          <Badge tone={product.condition === "nuevo" ? "new" : "used"}>{conditionLabel[product.condition]}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="text-[0.98rem] font-bold leading-tight tracking-[-0.01em] sm:text-[1.15rem]">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[0.8rem] text-mute sm:text-sm">
          {formatStorage(product.storageGB)}, {product.color.name}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 sm:mt-4">
          <p className="text-[1.15rem] font-extrabold leading-none tracking-[-0.02em] sm:text-[1.35rem]" style={{ fontStretch: "108%" }}>
            {formatUSD(product.priceUSD)}
          </p>
          {product.used && (
            <p className="text-[0.8rem] text-mute sm:text-sm">
              Batería <span className="font-bold text-blue">{product.used.batteryHealth}%</span>
            </p>
          )}
        </div>

        {product.stock !== "disponible" && (
          <div className="mt-3">
            <Badge tone={soldOut ? "danger" : "warn"}>{stockLabel[product.stock]}</Badge>
          </div>
        )}

        <div className="relative z-10 mt-auto pt-4">
          <CompareToggle modelId={product.modelId} label="Comparar" block className="h-10 sm:h-11" />
        </div>
      </div>
    </article>
  );
}
