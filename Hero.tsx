import Link from "next/link";
import type { Product } from "@/types";
import { ButtonLink } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { formatUSD } from "@/utils/format";

export function Hero({ spotlight, secondary }: { spotlight: Product; secondary?: Product }) {
  return (
    <section className="container-site grid items-center gap-10 pb-16 pt-8 sm:pt-12 lg:grid-cols-[1.08fr_1fr] lg:gap-8 lg:pb-24 lg:pt-16">
      <div className="animate-rise">
        <h1 className="display text-[3.2rem] leading-[0.86] sm:text-[5.2rem] lg:text-[5.9rem] xl:text-[6.6rem]">
          Tu próximo
          <br />
          <span className="normal-case">iPHONE</span>
          <br />
          está en <span className="text-blue">Phone Haus.</span>
        </h1>
        <p className="lead mt-7 max-w-md">
          iPhones nuevos y seminuevos.
          <br />
          Garantía, recambio y financiación.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/iphones" size="lg" variant="dark">
            Ver iPhones
          </ButtonLink>
          <ButtonLink href="/plan-recambio" size="lg" variant="outline">
            Cotizar mi iPhone
          </ButtonLink>
        </div>
      </div>

      <div className="relative animate-[fade_.9s_ease_.15s_both]">
        <div className="relative mx-auto aspect-[4/4.4] w-full max-w-[540px] overflow-visible">
          <div className="absolute inset-x-0 bottom-0 top-[14%] rounded-md bg-ink" aria-hidden />
          <div className="absolute inset-x-[6%] top-[22%] h-px bg-blue/80" aria-hidden />
          {secondary && (
            <div className="absolute bottom-[12%] left-[10%] h-[70%] -rotate-[8deg] opacity-95">
              <ProductImage product={secondary} view="front" priority />
            </div>
          )}
          <div className="absolute bottom-[8%] right-[12%] h-[88%] animate-float">
            <ProductImage product={spotlight} priority sizes="(max-width: 1024px) 80vw, 40vw" />
          </div>
          <Link
            href={`/iphones/${spotlight.slug}`}
            className="group absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white sm:bottom-6 sm:left-6 sm:right-6"
          >
            <span className="text-sm leading-snug">
              <span className="block font-semibold">{spotlight.name}</span>
              <span className="text-white/60">{spotlight.color.name}</span>
            </span>
            <span className="text-right text-sm leading-snug">
              <span className="block text-white/60">{spotlight.condition === "nuevo" ? "Nuevo" : "Seminuevo"}</span>
              <span className="font-semibold underline-offset-4 group-hover:text-blue group-hover:underline">{formatUSD(spotlight.priceUSD)}</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
