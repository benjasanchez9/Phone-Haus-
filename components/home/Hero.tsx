import Link from "next/link";
import type { Product } from "@/types";
import { siteConfig } from "@/data/site-config";
import { ButtonLink } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { IconBadgeCheck } from "@/components/ui/Icon";
import { formatStorage, formatUSD } from "@/utils/format";
import type { CosmeticGrade } from "@/types";

const cosmeticShort: Record<CosmeticGrade, string> = { excelente: "Excelente", "muy-bueno": "Muy bueno", bueno: "Bueno" };

/**
 * PORTADA
 * El elemento de marca es la etiqueta de revisión: la ficha que acompaña
 * a cada equipo, con la batería como dato principal. Muestra un equipo
 * real del catálogo (el seminuevo más reciente con mejor batería).
 */
export function Hero({ spotlight }: { spotlight: Product }) {
  const used = spotlight.used;
  const warranty = spotlight.condition === "nuevo" ? siteConfig.warranty.new : siteConfig.warranty.used;
  const installments = siteConfig.payments.installments;

  return (
    <section className="container-site grid items-center gap-10 pb-16 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-16">
      <div className="animate-rise">
        <h1 className="display text-[2.9rem] leading-[0.88] sm:text-[4.6rem] lg:text-[5rem] xl:text-[5.6rem]">
          <span className="normal-case">iPHONES</span> revisados uno por uno.
        </h1>
        <p className="lead mt-7 max-w-md">
          Nuevos sellados y seminuevos con la batería a la vista. Garantía, Plan Recambio
          {installments.enabled ? ` y hasta ${installments.maxInstallments} cuotas.` : "."}
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

      <Link
        href={`/iphones/${spotlight.slug}`}
        className="group mx-auto block w-full max-w-[520px] animate-[fade_.9s_ease_.15s_both] overflow-hidden rounded-md border border-line bg-surface transition-colors hover:border-ink/30"
        aria-label={`Ver ${spotlight.name} ${formatStorage(spotlight.storageGB)} ${spotlight.color.name}`}
      >
        <div className="grid grid-cols-[36%_1fr] sm:grid-cols-[44%_1fr]">
          <div className="relative flex items-center justify-center bg-gradient-to-b from-[#ECECE7] to-surface p-[14%]">
            <div className="relative h-full min-h-[200px] w-full sm:min-h-[260px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <ProductImage product={spotlight} priority sizes="(max-width: 1024px) 40vw, 20vw" />
              </div>
            </div>
          </div>

          <div className="flex flex-col p-5 sm:p-6">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
              <IconBadgeCheck size={17} />
              {spotlight.condition === "nuevo" ? "Sellado de fábrica" : "Phone Haus Checked"}
            </p>
            <p className="mt-3 text-[1.1rem] font-bold leading-tight tracking-[-0.01em]">{spotlight.name}</p>
            <p className="mt-0.5 text-sm text-mute">
              {formatStorage(spotlight.storageGB)}, {spotlight.color.name}
            </p>

            {used ? (
              <p className="mt-5 leading-none">
                <span className="display-sm block text-[3.4rem] normal-case text-blue sm:text-[4rem]">{used.batteryHealth}%</span>
                <span className="mt-1.5 block text-sm text-mute">de batería, medida en la revisión</span>
              </p>
            ) : (
              <p className="mt-5 text-sm text-mute">Batería nueva, equipo sin uso.</p>
            )}

            <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
              {used && (
                <div className="flex justify-between gap-3 py-2">
                  <dt className="text-mute">Estética</dt>
                  <dd className="font-semibold">{cosmeticShort[used.cosmetic]}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3 py-2">
                <dt className="text-mute">Garantía</dt>
                <dd className="font-semibold">{warranty.duration}</dd>
              </div>
              <div className="flex justify-between gap-3 py-2">
                <dt className="text-mute">Precio</dt>
                <dd className="font-semibold group-hover:text-blue">{formatUSD(spotlight.priceUSD)}</dd>
              </div>
            </dl>

            {used && (
              <p className="mt-4 text-xs leading-relaxed text-mute">
                Revisado: {siteConfig.checkedPoints.map((p) => (p === "Face ID" ? p : p.toLowerCase())).join(", ")}.
              </p>
            )}
          </div>
        </div>
      </Link>
    </section>
  );
}
