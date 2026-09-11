import Link from "next/link";
import type { Product } from "@/types";
import { siteConfig } from "@/data/site-config";
import { conditionLabel, formatStorage, formatUSD, stockLabel } from "@/utils/format";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "./ProductImage";
import { CompareToggle } from "@/components/compare/CompareToggle";
import { cn } from "@/utils/cn";

export function ProductCard({ product, priority, compact }: { product: Product; priority?: boolean; compact?: boolean }) {
  const soldOut = product.stock === "agotado";
  const warranty = product.condition === "nuevo" ? `Garantía Apple ${siteConfig.warranty.new.duration}` : `Garantía ${siteConfig.warranty.used.duration}`;
  const href = `/iphones/${product.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-surface transition-[border-color,box-shadow] duration-300 hover:border-ink/25 hover:shadow-[0_20px_40px_-28px_rgba(0,0,0,.35)]">
      <Link href={href} className="relative block aspect-[4/4.2] overflow-hidden bg-gradient-to-b from-[#EFEFEB] to-surface" tabIndex={-1} aria-hidden>
        <div className={cn("absolute inset-0 flex items-center justify-center p-[12%] transition-transform duration-500 ease-out group-hover:scale-[1.035]", soldOut && "opacity-45 grayscale")}>
          <ProductImage product={product} priority={priority} />
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge tone={product.condition === "nuevo" ? "new" : "used"}>{conditionLabel[product.condition]}</Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <Badge tone={soldOut ? "danger" : product.stock === "ultimas-unidades" ? "warn" : "ok"}>{stockLabel[product.stock]}</Badge>
          {product.used && <span className="text-xs text-mute">Batería {product.used.batteryHealth}%</span>}
        </div>

        <h3 className="mt-3 text-[1.08rem] font-bold leading-tight tracking-[-0.01em] sm:text-[1.15rem]">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-mute">
          {formatStorage(product.storageGB)}, {product.color.name}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[1.35rem] font-extrabold leading-none tracking-[-0.02em]" style={{ fontStretch: "108%" }}>
              {formatUSD(product.priceUSD)}
            </p>
            {siteConfig.payments.installments.enabled && !compact && (
              <p className="mt-1.5 text-xs text-mute">Hasta {siteConfig.payments.installments.maxInstallments} cuotas con Mercado Pago</p>
            )}
          </div>
        </div>
        {!compact && <p className="mt-3 border-t border-line pt-3 text-xs text-mute">{warranty}</p>}

        <div className="relative z-10 mt-4 flex gap-2">
          <Link
            href={href}
            className="inline-flex h-11 flex-1 items-center justify-center rounded bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-blue"
          >
            {soldOut ? "Ver detalle" : "Ver equipo"}
          </Link>
          <CompareToggle modelId={product.modelId} label="Comparar" />
        </div>
      </div>
    </article>
  );
}
