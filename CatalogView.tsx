"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import type { Condition, Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { IconClose, IconFilter, IconSearch, IconWhatsApp } from "@/components/ui/Icon";
import { Button, buttonClass } from "@/components/ui/Button";
import { whatsappUrl } from "@/lib/whatsapp";
import { formatStorage, formatUSD } from "@/utils/format";
import { cn } from "@/utils/cn";

type SortId = "destacados" | "precio-asc" | "precio-desc" | "recientes";
type ConditionFilter = "todos" | Condition;

const SORTS: { id: SortId; label: string }[] = [
  { id: "destacados", label: "Destacados" },
  { id: "precio-asc", label: "Menor precio" },
  { id: "precio-desc", label: "Mayor precio" },
  { id: "recientes", label: "Más recientes" },
];

interface Filters {
  condition: ConditionFilter;
  models: string[];
  storages: number[];
  colors: string[];
  maxPrice: number;
}

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function CatalogView({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const priceCeil = Math.ceil(Math.max(...products.map((p) => p.priceUSD)) / 50) * 50;
  const priceFloor = Math.floor(Math.min(...products.map((p) => p.priceUSD)) / 50) * 50;

  const initialCondition = params.get("estado");
  const empty: Filters = { condition: "todos", models: [], storages: [], colors: [], maxPrice: priceCeil };
  const [filters, setFilters] = useState<Filters>({
    ...empty,
    condition: initialCondition === "nuevo" || initialCondition === "seminuevo" ? initialCondition : "todos",
  });
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState<SortId>("destacados");
  const [drawer, setDrawer] = useState(false);

  // Mantener el estado en la URL para compartir (sin recargar)
  useEffect(() => {
    const url = new URL(window.location.href);
    filters.condition === "todos" ? url.searchParams.delete("estado") : url.searchParams.set("estado", filters.condition);
    query ? url.searchParams.set("q", query) : url.searchParams.delete("q");
    window.history.replaceState(null, "", url.toString());
  }, [filters.condition, query]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  const options = useMemo(() => {
    const models = Array.from(new Map(products.map((p) => [p.name, p.releaseOrder])).entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
    const storages = Array.from(new Set(products.map((p) => p.storageGB))).sort((a, b) => a - b);
    const colors = Array.from(new Map(products.map((p) => [p.color.name, p.color.hex])).entries());
    return { models, storages, colors };
  }, [products]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    const list = products.filter((p) => {
      if (filters.condition !== "todos" && p.condition !== filters.condition) return false;
      if (filters.models.length && !filters.models.includes(p.name)) return false;
      if (filters.storages.length && !filters.storages.includes(p.storageGB)) return false;
      if (filters.colors.length && !filters.colors.includes(p.color.name)) return false;
      if (p.priceUSD > filters.maxPrice) return false;
      if (q) {
        const hay = normalize(`${p.name} ${p.color.name} ${p.storageGB}gb ${formatStorage(p.storageGB)} ${p.condition}`);
        if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
      }
      return true;
    });
    const stockRank = (p: Product) => (p.stock === "agotado" ? 1 : 0);
    const sorted = [...list].sort((a, b) => {
      if (stockRank(a) !== stockRank(b)) return stockRank(a) - stockRank(b);
      switch (sort) {
        case "precio-asc":
          return a.priceUSD - b.priceUSD;
        case "precio-desc":
          return b.priceUSD - a.priceUSD;
        case "recientes":
          return b.releaseOrder - a.releaseOrder;
        default:
          return Number(b.featured) - Number(a.featured) || b.releaseOrder - a.releaseOrder;
      }
    });
    return sorted;
  }, [products, filters, query, sort]);

  const activeCount =
    (filters.condition !== "todos" ? 1 : 0) +
    filters.models.length +
    filters.storages.length +
    filters.colors.length +
    (filters.maxPrice < priceCeil ? 1 : 0);

  const reset = () => {
    setFilters(empty);
    setQuery("");
  };

  const toggleIn = <K extends "models" | "storages" | "colors">(key: K, value: Filters[K][number]) =>
    setFilters((f) => {
      const arr = f[key] as (typeof value)[];
      return { ...f, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });

  const panel = (
    <FilterPanel
      filters={filters}
      setFilters={setFilters}
      options={options}
      toggleIn={toggleIn}
      priceFloor={priceFloor}
      priceCeil={priceCeil}
    />
  );

  return (
    <div className="container-site pb-24">
      {/* Barra superior: estado + búsqueda + orden */}
      <div className="flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="radiogroup" aria-label="Estado" className="flex gap-1 overflow-x-auto scrollbar-none">
          {(["todos", "nuevo", "seminuevo"] as ConditionFilter[]).map((c) => (
            <button
              key={c}
              role="radio"
              aria-checked={filters.condition === c}
              onClick={() => setFilters((f) => ({ ...f, condition: c }))}
              className={cn(
                "h-10 shrink-0 rounded px-4 text-sm font-semibold transition-colors",
                filters.condition === c ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5 hover:text-ink",
              )}
            >
              {c === "todos" ? "Todos" : c === "nuevo" ? "Nuevos" : "Seminuevos"}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <label className="relative flex-1 lg:w-72 lg:flex-none">
            <span className="sr-only">Buscar iPhone</span>
            <IconSearch size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar modelo, color, capacidad"
              className="field h-11 py-0 pl-10"
            />
          </label>
          <label className="hidden sm:block">
            <span className="sr-only">Ordenar por</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortId)} className="field h-11 w-auto cursor-pointer py-0 pr-9">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="inline-flex h-11 items-center gap-2 rounded border border-line bg-surface px-4 text-sm font-semibold lg:hidden"
            aria-haspopup="dialog"
          >
            <IconFilter size={18} />
            Filtros
            {activeCount > 0 && <span className="rounded-sm bg-blue px-1.5 text-xs text-white">{activeCount}</span>}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="sticky top-[calc(var(--header-h)+24px)]">
            {panel}
            {activeCount > 0 && (
              <button type="button" onClick={reset} className="mt-6 text-sm font-medium text-blue hover:underline">
                Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        <section aria-label="Resultados">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm text-mute" aria-live="polite">
              {results.length} {results.length === 1 ? "equipo" : "equipos"}
            </p>
            <label className="sm:hidden">
              <span className="sr-only">Ordenar por</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortId)} className="h-9 rounded border border-line bg-surface px-2 text-sm">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">
              {results.map((p, i) => (
                <div key={p.id} className="animate-settle" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <ProductCard product={p} priority={i < 2} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-ink/20 px-6 py-16 text-center">
              <p className="display-sm text-2xl">Sin resultados</p>
              <p className="mx-auto mt-3 max-w-sm text-mute">
                No hay equipos que coincidan con esos filtros. Probá con menos filtros o consultanos por el modelo que buscás.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="dark" onClick={reset}>
                  Limpiar filtros
                </Button>
                <a
                  href={whatsappUrl(`Hola Phone Haus 👋 Busco un iPhone${query ? `: ${query}` : ""}. ¿Tienen disponible?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("outline")}
                >
                  <IconWhatsApp size={16} />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Drawer de filtros mobile */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <button type="button" aria-label="Cerrar filtros" className="absolute inset-0 animate-fade bg-ink/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] animate-rise flex-col rounded-t-lg bg-paper">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="text-lg font-bold">Filtros</p>
              <button type="button" onClick={() => setDrawer(false)} className="-mr-2 inline-flex h-10 w-10 items-center justify-center" aria-label="Cerrar">
                <IconClose />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{panel}</div>
            <div className="flex gap-3 border-t border-line p-4">
              <Button variant="outline" onClick={reset} className="flex-1">
                Limpiar
              </Button>
              <Button variant="dark" onClick={() => setDrawer(false)} className="flex-[2]">
                Ver {results.length} {results.length === 1 ? "equipo" : "equipos"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({
  filters,
  setFilters,
  options,
  toggleIn,
  priceFloor,
  priceCeil,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  options: { models: string[]; storages: number[]; colors: [string, string][] };
  toggleIn: <K extends "models" | "storages" | "colors">(key: K, value: Filters[K][number]) => void;
  priceFloor: number;
  priceCeil: number;
}) {
  const priceId = useId();
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-sm font-bold">Modelo</legend>
        <div className="space-y-1">
          {options.models.map((m) => (
            <Check key={m} checked={filters.models.includes(m)} onChange={() => toggleIn("models", m)} label={m} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-bold">Capacidad</legend>
        <div className="flex flex-wrap gap-2">
          {options.storages.map((s) => {
            const on = filters.storages.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => toggleIn("storages", s)}
                className={cn("h-10 rounded border px-3.5 text-sm font-semibold transition-colors", on ? "border-blue bg-blue-soft text-blue" : "border-line bg-surface hover:border-ink/40")}
              >
                {formatStorage(s)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-bold">Color</legend>
        <div className="space-y-1">
          {options.colors.map(([name, hex]) => (
            <Check
              key={name}
              checked={filters.colors.includes(name)}
              onChange={() => toggleIn("colors", name)}
              label={
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-ink/15" style={{ background: hex }} aria-hidden />
                  {name}
                </span>
              }
            />
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={priceId} className="mb-3 flex items-baseline justify-between text-sm font-bold">
          Precio máximo
          <span className="font-semibold text-blue">{formatUSD(filters.maxPrice)}</span>
        </label>
        <input
          id={priceId}
          type="range"
          min={priceFloor}
          max={priceCeil}
          step={50}
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="w-full accent-[rgb(var(--blue))]"
        />
        <div className="mt-1 flex justify-between text-xs text-mute">
          <span>{formatUSD(priceFloor)}</span>
          <span>{formatUSD(priceCeil)}</span>
        </div>
      </div>
    </div>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: React.ReactNode }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 text-[0.95rem]">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-[18px] w-[18px] cursor-pointer rounded-sm accent-[rgb(var(--blue))]" />
      {label}
    </label>
  );
}
