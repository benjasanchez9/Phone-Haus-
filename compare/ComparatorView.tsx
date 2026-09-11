"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IphoneSpecs, ModelId, Product } from "@/types";
import { iphoneSpecs, specRows } from "@/data/iphone-specs";
import { offerForModel } from "@/lib/catalog";
import { compareRules, getHighlights, getRecommendation, type CompareCandidate, type PriorityId } from "@/lib/compare-rules";
import { compareMessage, productMessage, whatsappUrl } from "@/lib/whatsapp";
import { useCompare, MAX_COMPARE } from "./CompareProvider";
import { PhoneRender } from "@/components/product/PhoneRender";
import { ProductImage } from "@/components/product/ProductImage";
import { IconClose, IconPlus, IconWhatsApp } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { conditionLabel, displayName, formatStorage, formatUSD } from "@/utils/format";
import { cn } from "@/utils/cn";

const PRESETS: { label: string; ids: ModelId[] }[] = [
  { label: "17 vs 17 Pro vs 17 Pro Max", ids: ["iphone-17", "iphone-17-pro", "iphone-17-pro-max"] },
  { label: "16 vs 17", ids: ["iphone-16", "iphone-17"] },
  { label: "15 Pro vs 16 Pro vs 17 Pro", ids: ["iphone-15-pro", "iphone-16-pro", "iphone-17-pro"] },
  { label: "13 vs 14 vs 15", ids: ["iphone-13", "iphone-14", "iphone-15"] },
];

const allModels = Object.values(iphoneSpecs).sort(
  (a, b) => b.year - a.year || b.metrics.chipGeneration - a.metrics.chipGeneration || b.metrics.screenInches - a.metrics.screenInches,
);
const years = Array.from(new Set(allModels.map((m) => m.year)));

function display(value: IphoneSpecs[keyof IphoneSpecs]) {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "object") return null;
  return String(value);
}

export function ComparatorView({ products }: { products: Product[] }) {
  const { items, setAt, replaceAll, ready } = useCompare();
  const params = useSearchParams();
  const applied = useRef(false);
  const [extraSlot, setExtraSlot] = useState(false);
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [priority, setPriority] = useState<PriorityId>("precio-calidad");

  // Modelo recibido por URL (?m=iphone-17-pro) se suma al comparador
  useEffect(() => {
    if (!ready || applied.current) return;
    applied.current = true;
    const m = params.get("m")?.split(",").filter((x): x is ModelId => x in iphoneSpecs) ?? [];
    if (m.length) replaceAll([...m, ...items.filter((i) => !m.includes(i))].slice(0, MAX_COMPARE));
  }, [ready, params, items, replaceAll]);

  const selected = items.map((id) => iphoneSpecs[id]);
  const candidates: CompareCandidate[] = useMemo(
    () => selected.map((specs) => ({ specs, price: offerForModel(specs.modelId, products)?.fromPrice ?? null })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, products],
  );

  const slotCount = Math.min(MAX_COMPARE, Math.max(2, items.length + (extraSlot && items.length >= 2 ? 1 : 0)));
  const canAddSlot = slotCount < MAX_COMPARE && items.length >= 2;
  const cols = Math.max(selected.length, 1);

  const groups = useMemo(() => {
    const map = new Map<string, typeof specRows>();
    for (const row of specRows) map.set(row.group, [...(map.get(row.group) ?? []), row]);
    return Array.from(map.entries());
  }, []);

  const highlights = getHighlights(candidates);
  const recommendation = selected.length >= 2 ? getRecommendation(candidates, priority) : null;
  const recOffer = recommendation ? offerForModel(recommendation.winner.specs.modelId, products) : null;

  return (
    <div className="container-site pb-24">
      {/* ---------- Selectores ---------- */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${slotCount + (canAddSlot ? 1 : 0)}, minmax(0, 1fr))` }}>
        {Array.from({ length: slotCount }).map((_, i) => {
          const current = items[i];
          const specs = current ? iphoneSpecs[current] : null;
          const offer = current ? offerForModel(current, products) : null;
          return (
            <div key={i} className={cn("relative rounded-md border bg-surface p-3 sm:p-4", specs ? "border-line" : "border-dashed border-ink/25")}>
              {specs && (
                <button
                  type="button"
                  onClick={() => {
                    setAt(i, null);
                    setExtraSlot(false);
                  }}
                  className="absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded text-mute hover:bg-ink/5 hover:text-ink"
                  aria-label={`Quitar ${specs.name}`}
                >
                  <IconClose size={16} />
                </button>
              )}
              <div className="flex h-28 items-center justify-center sm:h-44">
                {specs ? (
                  offer ? (
                    <div key={current} className="flex h-full animate-settle items-center">
                      <ProductImage product={offer.cheapest} />
                    </div>
                  ) : (
                    <PhoneRender key={current} modelId={specs.modelId} color="#CFCFCB" className="h-full w-auto animate-settle" title={specs.name} />
                  )
                ) : (
                  <span className="text-4xl font-light text-ink/20" aria-hidden>
                    {i + 1}
                  </span>
                )}
              </div>
              <label className="mt-3 block">
                <span className="sr-only">Modelo {i + 1}</span>
                <select
                  value={current ?? ""}
                  onChange={(e) => e.target.value && setAt(i, e.target.value as ModelId)}
                  className={cn(
                    "h-11 w-full cursor-pointer rounded border bg-surface px-2 text-[0.8rem] font-semibold sm:px-3 sm:text-sm",
                    specs ? "border-line" : "border-blue text-blue",
                  )}
                >
                  <option value="" disabled>
                    Elegir iPhone
                  </option>
                  {years.map((y) => (
                    <optgroup key={y} label={String(y)}>
                      {allModels
                        .filter((m) => m.year === y)
                        .map((m) => (
                          <option key={m.modelId} value={m.modelId} disabled={items.includes(m.modelId) && m.modelId !== current}>
                            {m.name}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </label>
            </div>
          );
        })}
        {canAddSlot && (
          <button
            type="button"
            onClick={() => setExtraSlot(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-ink/25 p-3 text-sm font-semibold text-mute transition-colors hover:border-blue hover:text-blue"
          >
            <IconPlus size={22} />
            Agregar
          </button>
        )}
      </div>

      {/* ---------- Estado vacío ---------- */}
      {ready && selected.length < 2 && (
        <div className="mt-10 rounded-md bg-surface p-6 sm:p-10">
          <p className="display-sm text-2xl">{selected.length === 0 ? "Elegí dos o tres iPhones" : "Elegí otro iPhone para comparar"}</p>
          <p className="mt-2 text-mute">O arrancá con una comparación frecuente:</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  replaceAll(p.ids);
                  setExtraSlot(false);
                }}
                className="h-10 rounded border border-line px-4 text-sm font-semibold transition-colors hover:border-blue hover:text-blue"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected.length >= 2 && (
        <>
          {/* ---------- Tabla comparativa ---------- */}
          <section className="mt-12" aria-labelledby="tabla">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="tabla" className="display-sm text-[1.8rem] sm:text-[2.3rem]">
                Lado a lado
              </h2>
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium">
                <span>Mostrar solo diferencias</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={onlyDiff}
                  onClick={() => setOnlyDiff((v) => !v)}
                  className={cn("relative h-6 w-11 rounded-full transition-colors", onlyDiff ? "bg-blue" : "bg-ink/20")}
                >
                  <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", onlyDiff ? "translate-x-[22px]" : "translate-x-0.5")} />
                </button>
              </label>
            </div>

            <div className="-mx-5 mt-6 px-5 max-sm:overflow-x-auto sm:mx-0 sm:px-0">
              <div style={{ minWidth: cols >= 3 ? 480 : undefined }}>
                {/* cabecera fija con modelo y oferta */}
                <div className="sticky top-[var(--header-h)] z-10 grid gap-3 border-b-2 border-ink bg-paper py-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
                  {selected.map((s) => (
                    <p key={s.modelId} className="text-sm font-bold sm:text-base">
                      {s.name}
                    </p>
                  ))}
                </div>

                <OfferRows selected={selected} products={products} cols={cols} />

                {groups.map(([group, rows]) => {
                  const visible = rows.filter((row) => {
                    if (!onlyDiff) return true;
                    const vals = selected.map((s) => display(s[row.key]) ?? "—");
                    return new Set(vals).size > 1;
                  });
                  if (!visible.length) return null;
                  return (
                    <div key={group} className="mt-8">
                      <h3 className="sticky left-0 text-xs font-bold text-blue">{group}</h3>
                      <dl>
                        {visible.map((row) => {
                          const vals = selected.map((s) => display(s[row.key]));
                          const differs = new Set(vals.map((v) => v ?? "—")).size > 1;
                          return (
                            <div key={row.key} className="border-b border-line py-3.5">
                              <dt className="sticky left-0 flex w-fit items-center gap-2 text-xs text-mute">
                                {row.label}
                                {differs && <span className="h-1.5 w-1.5 rounded-full bg-blue" aria-label="difiere" />}
                              </dt>
                              <div className="mt-1.5 grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
                                {vals.map((v, i) => (
                                  <dd key={selected[i].modelId} className={cn("text-[0.85rem] leading-snug sm:text-[0.95rem]", v === null ? "text-mute/80" : "font-medium")}>
                                    {v ?? "Consultar ficha oficial"}
                                  </dd>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-4 text-xs text-mute">
              Especificaciones según fichas técnicas oficiales de Apple. “Consultar ficha oficial” indica datos pendientes de confirmar.
            </p>
          </section>

          {/* ---------- En qué destaca cada uno ---------- */}
          {highlights.length > 0 && (
            <section className="mt-20" aria-labelledby="destaca">
              <span className="rule mb-5" aria-hidden />
              <h2 id="destaca" className="display text-[2.2rem] sm:text-[3.2rem]">
                ¿En qué destaca cada uno?
              </h2>
              <div className="mt-8 grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))` }}>
                {selected.map((s) => {
                  const wins = highlights.filter((h) => h.modelId === s.modelId);
                  return (
                    <div key={s.modelId} className="rounded-md border border-line bg-surface p-5">
                      <p className="font-bold">{s.name}</p>
                      {wins.length ? (
                        <ul className="mt-4 space-y-2">
                          {wins.map((w) => (
                            <li key={w.rule.id} className="flex items-center gap-2 text-sm">
                              <span className="h-[3px] w-4 bg-blue" aria-hidden />
                              {w.rule.title}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-4 text-sm text-mute">No lidera ninguna categoría en esta comparación.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ---------- Recomendación ---------- */}
          <section className="mt-20 rounded-md bg-ink p-6 text-white sm:p-10" aria-labelledby="recomendacion">
            <h2 id="recomendacion" className="display text-[2.1rem] sm:text-[3rem]">
              Nuestra recomendación
            </h2>
            <p className="mt-3 text-white/60">¿Qué es lo más importante para vos?</p>
            <div role="radiogroup" aria-label="Prioridad" className="mt-5 flex flex-wrap gap-2">
              {compareRules.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  aria-checked={priority === r.id}
                  onClick={() => setPriority(r.id)}
                  className={cn(
                    "h-10 rounded border px-4 text-sm font-semibold transition-colors",
                    priority === r.id ? "border-blue bg-blue text-white" : "border-white/20 text-white/80 hover:border-white/60",
                  )}
                >
                  {r.prompt}
                </button>
              ))}
            </div>

            {recommendation ? (
              <div key={`${priority}-${recommendation.winner.specs.modelId}`} className="mt-8 grid animate-settle items-center gap-8 border-t border-white/15 pt-8 sm:grid-cols-[160px_1fr]">
                <div className="mx-auto h-56 sm:h-64">
                  {recOffer ? (
                    <ProductImage product={recOffer.cheapest} />
                  ) : (
                    <PhoneRender modelId={recommendation.winner.specs.modelId} color="#CFCFCB" className="h-full w-auto" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-blue">{recommendation.rule.title}</p>
                  <p className="display-sm mt-2 text-[2rem] normal-case sm:text-[2.6rem]">{displayName(recommendation.winner.specs.name)}</p>
                  <p className="mt-3 max-w-lg text-white/70">{recommendation.text}</p>
                  {recOffer && <p className="mt-4 text-lg font-bold">Desde {formatUSD(recOffer.fromPrice)}</p>}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {recOffer ? (
                      <Link href={`/iphones/${recOffer.cheapest.slug}`} className={buttonClass("light", "lg")}>
                        Ver equipo
                      </Link>
                    ) : (
                      <Link href="/iphones" className={buttonClass("light", "lg")}>
                        Ver iPhones disponibles
                      </Link>
                    )}
                    <a
                      href={whatsappUrl(recOffer ? productMessage(recOffer.cheapest) : compareMessage(selected.map((s) => s.name)))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass("primary", "lg")}
                    >
                      <IconWhatsApp size={18} />
                      Consultar por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-8 border-t border-white/15 pt-8 text-white/70">
                No hay datos suficientes para recomendar según esta prioridad. Escribinos y te asesoramos.
              </p>
            )}
            <p className="mt-8 text-xs text-white/40">
              Recomendación generada con reglas simples a partir de especificaciones y precios publicados. No reemplaza el asesoramiento personalizado.
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function OfferRows({ selected, products, cols }: { selected: IphoneSpecs[]; products: Product[]; cols: number }) {
  const offers = selected.map((s) => offerForModel(s.modelId, products));
  const grid = { gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` };
  return (
    <div className="border-b border-line bg-blue-soft/60 px-0 py-4">
      <p className="sticky left-0 w-fit text-xs font-bold text-blue">En Phone Haus</p>
      <div className="mt-2 grid gap-3" style={grid}>
        {offers.map((o, i) => (
          <div key={selected[i].modelId} className="text-[0.85rem] sm:text-[0.95rem]">
            {o ? (
              <>
                <p className="text-lg font-extrabold leading-tight sm:text-xl">desde {formatUSD(o.fromPrice)}</p>
                <p className="mt-1 text-mute">{o.storages.map(formatStorage).join(", ")}</p>
                <p className="text-mute">{o.conditions.map((c) => conditionLabel[c]).join(" y ")}</p>
                <Link href={`/iphones/${o.cheapest.slug}`} className="mt-2 inline-block font-semibold text-blue hover:underline">
                  Ver equipo
                </Link>
              </>
            ) : (
              <>
                <p className="font-semibold">Sin stock publicado</p>
                <a
                  href={whatsappUrl(`Hola Phone Haus 👋 ¿Consiguen ${selected[i].name}?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block font-semibold text-blue hover:underline"
                >
                  Consultar
                </a>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
