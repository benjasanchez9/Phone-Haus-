export function CatalogSkeleton() {
  return (
    <div className="container-site pb-24" aria-busy="true" aria-label="Cargando catálogo">
      <div className="h-[74px] border-y border-line" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 animate-pulse rounded-sm bg-ink/[0.06]" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-md border border-line bg-surface">
              <div className="aspect-[4/4.2] animate-pulse bg-ink/[0.05]" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-1/3 animate-pulse rounded-sm bg-ink/[0.06]" />
                <div className="h-5 w-2/3 animate-pulse rounded-sm bg-ink/[0.08]" />
                <div className="h-6 w-1/2 animate-pulse rounded-sm bg-ink/[0.08]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
