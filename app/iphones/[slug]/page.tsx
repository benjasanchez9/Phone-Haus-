import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getRelatedProducts, getSpecs } from "@/lib/catalog";
import { productMessage, whatsappUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/data/site-config";
import { conditionLabel, cosmeticLabel, displayName, formatStorage, formatUSD, stockLabel } from "@/utils/format";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { IconBadgeCheck, IconWhatsApp } from "@/components/ui/Icon";
import { ProductGallery } from "@/components/product/ProductGallery";
import { CheckedSection } from "@/components/product/CheckedSection";
import { WarrantyBlock } from "@/components/product/WarrantyBlock";
import { ProductCard } from "@/components/product/ProductCard";
import { CompareToggle } from "@/components/compare/CompareToggle";
import { cn } from "@/utils/cn";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Equipo no encontrado" };
  const title = `${p.name} ${formatStorage(p.storageGB)} ${p.color.name} ${conditionLabel[p.condition].toLowerCase()}`;
  const description = `${title} en Phone Haus: ${formatUSD(p.priceUSD)}. ${p.condition === "nuevo" ? "Sellado, con garantía oficial de Apple." : `Batería ${p.used?.batteryHealth}%, verificado y con garantía de ${siteConfig.warranty.used.duration}.`}`;
  return {
    title,
    description,
    alternates: { canonical: `/iphones/${p.slug}` },
    openGraph: { title: `${title} | Phone Haus`, description, type: "website" },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const specs = getSpecs(product.modelId);
  const related = await getRelatedProducts(product, 3);
  const soldOut = product.stock === "agotado";
  const used = product.condition === "seminuevo" ? product.used : undefined;
  const wa = whatsappUrl(productMessage(product));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} ${formatStorage(product.storageGB)} ${product.color.name}`,
    brand: { "@type": "Brand", name: "Apple" },
    color: product.color.name,
    sku: product.id,
    itemCondition: product.condition === "nuevo" ? "https://schema.org/NewCondition" : "https://schema.org/RefurbishedCondition",
    ...(product.images[0] ? { image: `${siteConfig.url}${product.images[0]}` } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.priceUSD,
      availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `${siteConfig.url}/iphones/${product.slug}`,
      seller: { "@type": "Organization", name: siteConfig.shortName },
    },
  };

  const keySpecs = specs
    ? [
        ["Pantalla", specs.display],
        ["Chip", specs.chip],
        ["Cámara principal", specs.mainCamera],
        ["Conector", specs.connector],
      ].filter((x): x is [string, string] => Boolean(x[1]))
    : [];

  return (
    <>
      <div className="container-site pb-28 pt-6 sm:pt-10 lg:pb-20">
        <Breadcrumb
          className="mb-8"
          items={[{ label: "Inicio", href: "/" }, { label: "iPhones", href: "/iphones" }, { label: product.name }]}
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery product={product} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={product.condition === "nuevo" ? "new" : "used"}>{conditionLabel[product.condition]}</Badge>
              {used && (
                <Badge tone="blue" className="gap-1">
                  <IconBadgeCheck size={13} /> Phone Haus Checked
                </Badge>
              )}
            </div>

            <h1 className="display mt-5 text-[2.6rem] sm:text-[3.6rem]">
              <span className="normal-case">{displayName(product.name)}</span>
            </h1>
            <p className="mt-3 text-lg text-mute">
              {formatStorage(product.storageGB)}, {product.color.name}
            </p>

            <div className="mt-8 border-y border-line py-6">
              <p className="text-[2.4rem] font-extrabold leading-none tracking-[-0.03em]" style={{ fontStretch: "110%" }}>
                {formatUSD(product.priceUSD)}
              </p>
              {siteConfig.payments.installments.enabled && (
                <p className="mt-2 text-sm text-mute">
                  Hasta {siteConfig.payments.installments.maxInstallments} cuotas con Mercado Pago. Efectivo y transferencia.
                </p>
              )}
              <div className="mt-4">
                <Badge tone={soldOut ? "danger" : product.stock === "ultimas-unidades" ? "warn" : "ok"}>{stockLabel[product.stock]}</Badge>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line">
              {[
                ["Estado", conditionLabel[product.condition]],
                ["Capacidad", formatStorage(product.storageGB)],
                ["Color", product.color.name],
                ["Garantía", product.condition === "nuevo" ? `${siteConfig.warranty.new.duration} Apple` : siteConfig.warranty.used.duration],
                ...(used
                  ? [
                      ["Salud de batería", `${used.batteryHealth}%`],
                      ["Estado estético", cosmeticLabel[used.cosmetic]],
                    ]
                  : []),
              ].map(([k, v]) => (
                <div key={k} className="bg-surface p-4">
                  <dt className="text-xs text-mute">{k}</dt>
                  <dd className={cn("mt-1 font-semibold", k === "Salud de batería" && "text-blue")}>{v}</dd>
                </div>
              ))}
              {used && (
                <div className="col-span-2 bg-surface p-4">
                  <dt className="text-xs text-mute">Estado funcional</dt>
                  <dd className="mt-1 font-semibold">{used.functional}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-col gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "lg", "hidden w-full sm:inline-flex")}>
                <IconWhatsApp size={20} />
                {soldOut ? "Consultar disponibilidad" : "Consultar / Comprar por WhatsApp"}
              </a>
              <CompareToggle modelId={product.modelId} label="Agregar al comparador" block className="h-12" />
            </div>

            <Link
              href="/plan-recambio"
              className="group mt-6 flex items-center justify-between gap-4 rounded-md border border-blue/30 bg-blue-soft p-5 transition-colors hover:border-blue"
            >
              <span>
                <span className="block font-bold text-blue">¿Tenés un iPhone para entregar?</span>
                <span className="text-sm text-ink/70">Cotizalo online y usalo como parte de pago.</span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-blue underline-offset-4 group-hover:underline">Cotizar</span>
            </Link>

            <div className="mt-6">
              <WarrantyBlock condition={product.condition} />
            </div>

            {keySpecs.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-bold">Especificaciones principales</h2>
                <dl className="mt-3 divide-y divide-line border-y border-line text-sm">
                  {keySpecs.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 py-3">
                      <dt className="text-mute">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={`/comparador?m=${product.modelId}`} className="mt-3 inline-block text-sm font-medium text-blue hover:underline">
                  Ver ficha completa en el comparador
                </Link>
              </div>
            )}
          </div>
        </div>

        {used && (
          <div className="mt-16">
            <CheckedSection />
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="relacionados">
            <h2 id="relacionados" className="display-sm text-[1.8rem] sm:text-[2.2rem]">
              También te puede interesar
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Barra de compra fija en mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-mute">{product.name}</p>
            <p className="font-extrabold">{formatUSD(product.priceUSD)}</p>
          </div>
          <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md", "ml-auto flex-1")}>
            <IconWhatsApp size={18} />
            {soldOut ? "Consultar" : "Comprar por WhatsApp"}
          </a>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
