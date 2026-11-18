import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: { absolute: "iPhones nuevos y seminuevos | Phone Haus" },
  description: "Catálogo de iPhones nuevos sellados y seminuevos verificados. Garantía, Plan Recambio y cuotas con Mercado Pago.",
  alternates: { canonical: "/iphones" },
};

type SearchParams = Promise<{ estado?: string | string[]; q?: string | string[] }>;

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const [products, params] = await Promise.all([getProducts(), searchParams]);
  return (
    <>
      <PageHeader
        title={<span className="normal-case">iPHONES</span>}
        intro="Nuevos sellados con garantía Apple y seminuevos verificados por Phone Haus."
        crumbs={[{ label: "Inicio", href: "/" }, { label: "iPhones" }]}
      />
      {/* Sin Suspense: la lista sale completa en el HTML para que Google vea los productos. */}
      <CatalogView products={products} initialCondition={first(params.estado)} initialQuery={first(params.q) ?? ""} />
    </>
  );
}
