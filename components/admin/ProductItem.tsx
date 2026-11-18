"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProduct, updateProduct } from "@/app/admin/actions";
import { PhoneRender } from "@/components/product/PhoneRender";
import { buttonClass } from "@/components/ui/Button";
import { formatStorage } from "@/utils/format";
import { cn } from "@/utils/cn";
import { stockStatusFor, type ProductRow } from "@/lib/product-row";
import { renderFor } from "@/lib/renders";
import { stockLabel } from "@/utils/format";
import { uploadPhoto } from "./upload";
import { inputClass, labelClass } from "./styles";

type Status = { kind: "idle" } | { kind: "saved" } | { kind: "error"; message: string };

export function ProductItem({ row, name }: { row: ProductRow; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [price, setPrice] = useState(String(Number(row.precio_usd)));
  const [stock, setStock] = useState(row.stock);
  const [visible, setVisible] = useState(row.visible);
  const [featured, setFeatured] = useState(row.destacado);

  const priceNumber = Number(price.replace(",", "."));
  const dirty =
    priceNumber !== Number(row.precio_usd) || stock !== row.stock || visible !== row.visible || featured !== row.destacado;
  const busy = pending || uploading;
  const siteStatus = stockStatusFor(stock, row.condicion);

  function run(task: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    setStatus({ kind: "idle" });
    startTransition(async () => {
      const res = await task();
      if (res.ok) {
        setStatus({ kind: "saved" });
        router.refresh();
      } else {
        setStatus({ kind: "error", message: res.error });
      }
    });
  }

  function save() {
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setStatus({ kind: "error", message: "Escribí un precio mayor a 0." });
      return;
    }
    run(() => updateProduct(row.id, { precio_usd: priceNumber, stock, visible, destacado: featured }));
  }

  async function changePhoto(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setStatus({ kind: "idle" });
    const res = await uploadPhoto(file);
    setUploading(false);
    if ("error" in res) {
      setStatus({ kind: "error", message: res.error });
      return;
    }
    run(() => updateProduct(row.id, { imagenes: [res.url] }));
  }

  const photo = row.imagenes?.[0];
  const preview = photo ?? renderFor(row.model_id, row.color_nombre, row.color_hex);

  return (
    <li className={cn("rounded-lg border border-line bg-surface p-4", !row.visible && "opacity-70")}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Foto + nombre */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded bg-paper">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-contain" />
            ) : (
              <PhoneRender modelId={row.model_id} color={row.color_hex} className="h-16 w-auto" title={name} />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold leading-tight">
              {name} · {formatStorage(row.capacidad_gb)}
            </p>
            <p className="mt-0.5 text-sm text-mute">
              {row.color_nombre} · {row.condicion === "nuevo" ? "Nuevo" : `Seminuevo · Batería ${row.bateria ?? "—"}%`}
            </p>
            <p className="mt-1 text-xs text-mute">
              En el sitio:{" "}
              <span className={cn("font-semibold", siteStatus === "agotado" ? "text-danger" : siteStatus === "ultimas-unidades" ? "text-warn" : "text-ok")}>
                {visible ? stockLabel[siteStatus] : "Oculto"}
              </span>
            </p>
            <label className="mt-1 inline-block cursor-pointer text-xs font-semibold text-blue hover:underline">
              {uploading ? "Subiendo foto…" : photo ? "Cambiar foto" : "Subir foto"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={busy}
                onChange={(e) => changePhoto(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>

        {/* Precio y stock */}
        <div className="flex flex-wrap items-end gap-4">
          <label className="block w-32">
            <span className={labelClass}>Precio USD</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
            />
          </label>
          <div>
            <span className={labelClass}>Stock</span>
            <div className="mt-1 flex h-10 items-center rounded border border-line">
              <button
                type="button"
                aria-label="Restar una unidad"
                onClick={() => setStock((s) => Math.max(0, s - 1))}
                className="h-full w-9 text-lg font-semibold hover:bg-ink/5"
              >
                −
              </button>
              <input
                type="number"
                min={0}
                step={1}
                value={stock}
                aria-label="Unidades en stock"
                onChange={(e) => setStock(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                className="h-full w-12 border-x border-line bg-transparent text-center outline-none"
              />
              <button
                type="button"
                aria-label="Sumar una unidad"
                onClick={() => setStock((s) => s + 1)}
                className="h-full w-9 text-lg font-semibold hover:bg-ink/5"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 pb-0.5 text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--blue))]" />
              Visible en el sitio
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--blue))]" />
              Destacado en inicio
            </label>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 lg:w-44 lg:justify-end">
          {confirmDelete ? (
            <>
              <span className="text-sm font-medium">¿Borrar?</span>
              <button type="button" disabled={busy} onClick={() => run(() => deleteProduct(row.id))} className={buttonClass("dark", "sm", "bg-danger hover:bg-danger/85")}>
                Sí
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className={buttonClass("outline", "sm")}>
                No
              </button>
            </>
          ) : (
            <>
              <button type="button" disabled={!dirty || busy} onClick={save} className={buttonClass("primary", "sm")}>
                {pending ? "Guardando…" : "Guardar"}
              </button>
              <button type="button" disabled={busy} onClick={() => setConfirmDelete(true)} className={buttonClass("ghost", "sm", "text-danger hover:text-danger")}>
                Borrar
              </button>
            </>
          )}
        </div>
      </div>

      {status.kind === "saved" && <p className="mt-2 text-sm font-medium text-ok">Guardado. El sitio ya muestra el cambio.</p>}
      {status.kind === "error" && <p role="alert" className="mt-2 text-sm font-medium text-danger">{status.message}</p>}
    </li>
  );
}
