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
          intro="Nuevos sellados y seminuevos verificados. Precio final en dólares."
          action={
            <ButtonLink href="/iphones" variant="outline">
              Ver todo el catálogo
            </ButtonLink>
          }
        />
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-none px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
