import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/catalog";
import { ComparatorView } from "@/components/compare/ComparatorView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: { absolute: "Comparador de iPhones | Phone Haus" },
  description: "Compará hasta 3 iPhones: pantalla, cámaras, batería, chip y precio disponible en Phone Haus.",
  alternates: { canonical: "/comparador" },
};

export default async function ComparatorPage() {
  const products = await getProducts();
  return (
    <>
      <PageHeader
        title={
          <>
            Comparador de <span className="normal-case">iPHONES</span>
          </>
        }
        intro="Elegí hasta tres modelos y mirá las diferencias que importan, con el precio real en Phone Haus."
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Comparador" }]}
      />
      <Suspense fallback={<div className="container-site h-64 animate-pulse rounded-md bg-ink/[0.04]" />}>
        <ComparatorView products={products} />
      </Suspense>
    </>
  );
}
