import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/catalog";
import { CatalogView } from "@/components/catalog/CatalogView";
import { CatalogSkeleton } from "@/components/catalog/CatalogSkeleton";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: { absolute: "iPhones nuevos y seminuevos | Phone Haus" },
  description: "Catálogo de iPhones nuevos sellados y seminuevos verificados. Garantía, Plan Recambio y cuotas con Mercado Pago.",
  alternates: { canonical: "/iphones" },
};

export default async function CatalogPage() {
  const products = await getProducts();
  return (
    <>
      <PageHeader
        title={<span className="normal-case">iPHONES</span>}
        intro="Nuevos sellados con garantía Apple y seminuevos verificados por Phone Haus."
        crumbs={[{ label: "Inicio", href: "/" }, { label: "iPhones" }]}
      />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView products={products} />
      </Suspense>
    </>
  );
}
