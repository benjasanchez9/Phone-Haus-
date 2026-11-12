"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createProduct } from "@/app/admin/actions";
import { buttonClass } from "@/components/ui/Button";
import { formatStorage } from "@/utils/format";
import { MODEL_OPTIONS, STORAGE_OPTIONS } from "@/lib/product-row";
import type { Condition, CosmeticGrade, ModelId } from "@/types";
import { uploadPhoto } from "./upload";
import { inputClass, labelClass } from "./styles";

export function NewProductForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [modelId, setModelId] = useState<ModelId>(MODEL_OPTIONS[0].id);
  const [condition, setCondition] = useState<Condition>("nuevo");
  const [storage, setStorage] = useState(256);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#CFCFCB");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [featured, setFeatured] = useState(false);
  const [battery, setBattery] = useState("");
  const [cosmetic, setCosmetic] = useState<CosmeticGrade>("muy-bueno");
  const [functional, setFunctional] = useState("100% funcional. Revisado y verificado.");
  const [file, setFile] = useState<File | null>(null);

  const used = condition === "seminuevo";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      let imagenes: string[] = [];
      if (file) {
        const up = await uploadPhoto(file);
        if ("error" in up) {
          setError(up.error);
          return;
        }
        imagenes = [up.url];
      }
      const res = await createProduct({
        model_id: modelId,
        condicion: condition,
        capacidad_gb: storage,
        color_nombre: colorName,
        color_hex: colorHex,
        precio_usd: Number(price.replace(",", ".")),
        stock: Math.floor(Number(stock)),
        destacado: featured,
        imagenes,
        bateria: used ? Math.round(Number(battery)) : null,
        estetica: used ? cosmetic : null,
        estado_funcional: used ? functional : null,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
      onDone();
    });
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-surface p-5">
      <h2 className="text-lg font-bold">Cargar artículo nuevo</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className={labelClass}>Modelo</span>
          <select value={modelId} onChange={(e) => setModelId(e.target.value as ModelId)} className={inputClass}>
            {MODEL_OPTIONS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Condición</span>
          <select value={condition} onChange={(e) => setCondition(e.target.value as Condition)} className={inputClass}>
            <option value="nuevo">Nuevo (sellado)</option>
            <option value="seminuevo">Seminuevo</option>
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Capacidad</span>
          <select value={storage} onChange={(e) => setStorage(Number(e.target.value))} className={inputClass}>
            {STORAGE_OPTIONS.map((gb) => (
              <option key={gb} value={gb}>
                {formatStorage(gb)}
              </option>
            ))}
          </select>
        </label>
        <div>
          <span className={labelClass}>Color</span>
          <div className="mt-1 flex gap-2">
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value.toUpperCase())}
              aria-label="Tono del color"
              className="h-10 w-12 shrink-0 cursor-pointer rounded border border-line bg-surface p-1"
            />
            <input
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="Ej: Black Titanium"
              required
              aria-label="Nombre del color"
              className={inputClass.replace("mt-1 ", "")}
            />
          </div>
        </div>
        <label className="block">
          <span className={labelClass}>Precio USD</span>
          <input type="number" inputMode="decimal" min={1} step="1" value={price} onChange={(e) => setPrice(e.target.value)} required className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Unidades en stock</span>
          <input type="number" min={0} step={1} value={stock} onChange={(e) => setStock(e.target.value)} required className={inputClass} />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Foto (opcional)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm file:mr-3 file:h-10 file:rounded file:border-0 file:bg-ink/[0.06] file:px-4 file:font-semibold"
          />
          <span className="mt-1 block text-xs text-mute">Sin foto, el sitio muestra la ilustración del modelo con el color elegido.</span>
        </label>
      </div>

      {used && (
        <div className="mt-4 grid gap-4 rounded border border-dashed border-line p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className={labelClass}>Salud de batería %</span>
            <input type="number" min={0} max={100} value={battery} onChange={(e) => setBattery(e.target.value)} required className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Estado estético</span>
            <select value={cosmetic} onChange={(e) => setCosmetic(e.target.value as CosmeticGrade)} className={inputClass}>
              <option value="excelente">Excelente</option>
              <option value="muy-bueno">Muy bueno</option>
              <option value="bueno">Bueno</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Estado funcional</span>
            <input value={functional} onChange={(e) => setFunctional(e.target.value)} className={inputClass} />
          </label>
        </div>
      )}

      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--blue))]" />
        Mostrar como destacado en la página de inicio
      </label>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-danger">{error}</p>}

      <div className="mt-5 flex gap-2">
        <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
          {pending ? "Guardando…" : "Guardar artículo"}
        </button>
        <button type="button" onClick={onDone} disabled={pending} className={buttonClass("outline", "md")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
