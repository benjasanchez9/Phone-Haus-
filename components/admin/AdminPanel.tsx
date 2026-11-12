"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { logout } from "@/app/admin/actions";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { MODEL_OPTIONS, type ProductRow } from "@/lib/product-row";
import { ProductItem } from "./ProductItem";
import { NewProductForm } from "./NewProductForm";
import { inputClass } from "./styles";

type Filter = "todos" | "nuevo" | "seminuevo" | "sin-stock" | "ocultos";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "nuevo", label: "Nuevos" },
  { id: "seminuevo", label: "Seminuevos" },
  { id: "sin-stock", label: "Sin stock" },
  { id: "ocultos", label: "Ocultos" },
];

const modelName = (id: string) => MODEL_OPTIONS.find((m) => m.id === id)?.name ?? id;

export function AdminPanel({ rows, email }: { rows: ProductRow[]; email: string }) {
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "nuevo" && r.condicion !== "nuevo") return false;
      if (filter === "seminuevo" && r.condicion !== "seminuevo") return false;
      if (filter === "sin-stock" && r.stock > 0) return false;
      if (filter === "ocultos" && r.visible) return false;
      if (!q) return true;
      return `${modelName(r.model_id)} ${r.capacidad_gb} ${r.color_nombre}`.toLowerCase().includes(q);
    });
  }, [rows, filter, query]);

  const totalUnits = rows.reduce((sum, r) => sum + r.stock, 0);
  const outOfStock = rows.filter((r) => r.stock === 0).length;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Artículos</h1>
          <p className="mt-1 text-sm text-mute">
            {rows.length} artículos · {totalUnits} unidades en stock · {outOfStock} sin stock
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/iphones" target="_blank" className={buttonClass("outline", "sm")}>
            Ver sitio
          </Link>
          <form action={logout}>
            <button type="submit" className={buttonClass("ghost", "sm")} title={email}>
              Salir
            </button>
          </form>
        </div>
      </header>

      <div className="mt-6">
        {adding ? (
          <NewProductForm onDone={() => setAdding(false)} />
        ) : (
          <button type="button" onClick={() => setAdding(true)} className={buttonClass("primary", "md")}>
            + Cargar artículo nuevo
          </button>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "h-9 rounded-full px-4 text-sm font-semibold transition-colors",
              filter === f.id ? "bg-ink text-white" : "bg-ink/[0.05] text-ink hover:bg-ink/10",
            )}
          >
            {f.label}
          </button>
        ))}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar modelo o color…"
          aria-label="Buscar"
          className={cn(inputClass, "mt-0 ml-auto w-full sm:w-64")}
        />
      </div>

      <ul className="mt-4 space-y-3">
        {visible.map((row) => (
          <ProductItem key={row.id} row={row} name={modelName(row.model_id)} />
        ))}
      </ul>
      {visible.length === 0 && <p className="mt-8 text-center text-sm text-mute">No hay artículos para mostrar.</p>}
    </div>
  );
}
