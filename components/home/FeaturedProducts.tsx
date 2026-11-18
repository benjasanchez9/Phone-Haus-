import type { Product } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="section border-t border-line" aria-labelledby="destacados">
      <div className="container-site">
        <SectionHeader
          title={<span id="destacados">Destacados</span>}
          intro="Precios finales en dólares. Los seminuevos muestran la batería que medimos en la revisión."
          action={
            <ButtonLink href="/iphones" variant="outline">
              Ver todo el catálogo
            </ButtonLink>
          }
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
