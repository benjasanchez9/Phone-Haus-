"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product, TradeInInput, TradeInResult } from "@/types";
import { backLabels, screenLabels, sidesLabels } from "@/data/trade-in-rules";
import { calculateDifference } from "@/lib/trade-in-engine";
import { tradeInMessage, whatsappUrl } from "@/lib/whatsapp";
import { conditionLabel, formatStorage, formatUSD } from "@/utils/format";
import { ProductImage } from "@/components/product/ProductImage";
import { Button, buttonClass } from "@/components/ui/Button";
import { IconAlert, IconWhatsApp } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

export const DISCLAIMER = "Esta cotización es estimativa y está sujeta a revisión física del equipo por parte de Phone Haus.";

export function TradeInResultView({
  modelName,
  input,
  result,
  products,
  onBack,
  onRestart,
  headingRef,
}: {
  modelName: string;
  input: TradeInInput;
  result: TradeInResult;
  products: Product[];
  onBack: () => void;
  onRestart: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const [targetId, setTargetId] = useState<string | null>(null);
  const available = useMemo(() => [...products].filter((p) => p.stock !== "agotado").sort((a, b) => b.priceUSD - a.priceUSD), [products]);
  const target = available.find((p) => p.id === targetId) ?? null;

  if (result.status !== "quoted") {
    const copy = {
      "manual-review": {
        title: "Tu equipo requiere una evaluación personalizada.",
        text: "Por las respuestas que diste no podemos darte un valor automático, pero sí evaluarlo. Escribinos y lo vemos juntos.",
      },
      unavailable: {
        title: "Cotización no disponible online.",
        text: "Todavía no tenemos un valor online para este equipo. Escribinos y te pasamos una cotización personalizada.",
      },
      ineligible: {
        title: "No podemos recibir este equipo.",
        text: "Para aceptar un equipo en Plan Recambio tiene que estar libre de iCloud y con el IMEI sin bloqueo. Si podés resolverlo, volvé a cotizar.",
      },
    }[result.status];

    const wa = whatsappUrl(tradeInMessage({ modelName, input, result }));
    return (
      <div className="animate-settle">
        <div className="rounded-md border-2 border-ink p-6 sm:p-10">
          <IconAlert size={28} className={result.status === "ineligible" ? "text-danger" : "text-blue"} />
          <h2 ref={headingRef} tabIndex={-1} className="display-sm mt-5 text-[1.9rem] outline-none sm:text-[2.6rem]">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-lg text-mute">{copy.text}</p>
          {result.reasons.length > 0 && (
            <ul className="mt-6 space-y-2">
              {result.reasons.map((r) => (
                <li key={r} className="flex items-center gap-3 text-sm font-medium">
                  <span className="h-[3px] w-4 bg-blue" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-sm text-mute">
            {modelName}, {formatStorage(input.storageGB)}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {result.status !== "ineligible" && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "lg")}>
                <IconWhatsApp size={20} />
                Consultar por WhatsApp
              </a>
            )}
            <Button variant="outline" size="lg" onClick={onBack}>
              Revisar respuestas
            </Button>
            <Button variant="ghost" size="lg" onClick={onRestart}>
              Empezar de nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const diff = target ? calculateDifference(target.priceUSD, result.estimatedUSD) : null;
  const totalDiscount = result.adjustments.reduce((acc, a) => acc + a.amountUSD, 0);
  const wa = whatsappUrl(tradeInMessage({ modelName, input, result, target, toPay: diff?.toPay }));

  return (
    <div className="animate-settle">
      {/* Valor estimado */}
      <section className="overflow-hidden rounded-md bg-ink text-white">
        <div className="p-6 sm:p-10">
          <h2 ref={headingRef} tabIndex={-1} className="text-sm font-semibold text-white/60 outline-none">
            Valor estimado de tu <span className="normal-case">iPhone</span>
          </h2>
          <p className="mt-3 text-[3.6rem] font-extrabold leading-none tracking-[-0.04em] text-white sm:text-[6rem]" style={{ fontStretch: "112%" }}>
            {formatUSD(result.estimatedUSD)}
          </p>
          <div className="mt-2 h-[3px] w-16 bg-blue" aria-hidden />

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
            <Item k="Modelo" v={modelName} />
            <Item k="Capacidad" v={formatStorage(input.storageGB)} />
            <Item k="Batería" v={`${input.batteryHealth}%`} />
            <Item
              k="Estado"
              v={
                input.screen === "excelente" && input.sides === "excelente" && input.back === "excelente"
                  ? "Excelente"
                  : [screenLabels[input.screen], sidesLabels[input.sides], backLabels[input.back]].filter((x) => x !== "Excelente").join(", ")
              }
            />
          </dl>

          <details className="group mt-8 border-t border-white/15 pt-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-white/70 hover:text-white">
              <span className="group-open:hidden">Ver cómo se calculó</span>
              <span className="hidden group-open:inline">Ocultar detalle</span>
            </summary>
            <dl className="mt-4 max-w-sm space-y-2 text-sm">
              <Row k="Valor base" v={formatUSD(result.baseUSD)} />
              {result.adjustments.map((a) => (
                <Row key={a.label} k={`${a.label} (${a.percent}%)`} v={`− ${formatUSD(Math.abs(a.amountUSD))}`} muted />
              ))}
              {result.adjustments.length === 0 && <Row k="Descuentos por condición" v="USD 0" muted />}
              {totalDiscount !== 0 && <Row k="Descuentos por condición" v={`− ${formatUSD(Math.abs(totalDiscount))}`} />}
              <div className="border-t border-white/15 pt-2">
                <Row k="Valor estimado (redondeado)" v={formatUSD(result.estimatedUSD)} strong />
              </div>
            </dl>
          </details>
        </div>
        <p className="bg-white/[0.06] px-6 py-4 text-xs leading-relaxed text-white/60 sm:px-10">{DISCLAIMER}</p>
      </section>

      {/* Elegir el nuevo iPhone */}
      <section className="mt-14" aria-labelledby="elegir">
        <span className="rule mb-5" aria-hidden />
        <h2 id="elegir" className="display text-[2.1rem] sm:text-[3rem]">
          ¿Qué <span className="normal-case">iPHONE</span> querés llevarte?
        </h2>
        <p className="mt-3 text-mute">Elegí un equipo del catálogo para ver la diferencia a pagar.</p>

        <div role="radiogroup" aria-labelledby="elegir" className="mt-6 grid gap-2 sm:grid-cols-2">
          {available.map((p) => {
            const on = p.id === targetId;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setTargetId(p.id)}
                className={cn(
                  "flex items-center gap-4 rounded border p-3 text-left transition-[border-color,background-color] duration-200",
                  on ? "border-blue bg-blue-soft" : "border-line bg-surface hover:border-ink/35",
                )}
              >
                <span className="flex h-16 w-10 shrink-0 items-center justify-center">
                  <ProductImage product={p} sizes="40px" className="drop-shadow-none" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-tight">{p.name}</span>
                  <span className="block text-sm text-mute">
                    {formatStorage(p.storageGB)}, {conditionLabel[p.condition].toLowerCase()}
                  </span>
                </span>
                <span className={cn("shrink-0 text-sm font-bold", on && "text-blue")}>{formatUSD(p.priceUSD)}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Diferencia */}
      <section aria-live="polite" className="mt-10">
        {target && diff ? (
          <div key={target.id} className="animate-settle rounded-md border-2 border-blue bg-surface p-6 sm:p-10">
            <dl className="max-w-md space-y-3 text-[1.05rem]">
              <div className="flex justify-between gap-6">
                <dt>
                  {target.name} {formatStorage(target.storageGB)}
                </dt>
                <dd className="font-semibold">{formatUSD(target.priceUSD)}</dd>
              </div>
              <div className="flex justify-between gap-6 text-mute">
                <dt>Tu {modelName}</dt>
                <dd className="font-semibold text-blue">− {formatUSD(result.estimatedUSD)}</dd>
              </div>
              <div className="flex justify-between gap-6 border-t-2 border-ink pt-3">
                <dt className="font-bold">Diferencia</dt>
                <dd className="font-extrabold">{formatUSD(diff.toPay)}</dd>
              </div>
            </dl>

            <p className="display mt-10 text-[2.4rem] sm:text-[3.6rem]">
              {diff.toPay > 0 ? (
                <>
                  Te faltan {formatUSD(diff.toPay)}
                  <br />
                  para cambiarlo.
                </>
              ) : (
                <>Tu equipo cubre el total.</>
              )}
            </p>
            {diff.surplus > 0 && (
              <p className="mt-3 text-mute">Tu equipo supera el precio por {formatUSD(diff.surplus)}. Lo coordinamos por WhatsApp.</p>
            )}
            <p className="mt-4 text-xs text-mute">{DISCLAIMER}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "lg")}>
                <IconWhatsApp size={20} />
                Continuar por WhatsApp
              </a>
              <Link href={`/iphones/${target.slug}`} className={buttonClass("outline", "lg")}>
                Ver {target.name}
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-md border border-dashed border-ink/20 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-mute">Elegí un iPhone para calcular la diferencia, o enviá solo tu cotización.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "md", "shrink-0")}>
              <IconWhatsApp size={18} />
              Enviar cotización
            </a>
          </div>
        )}
      </section>

      <div className="mt-10 flex gap-4 text-sm">
        <button type="button" onClick={onBack} className="font-medium text-mute hover:text-ink">
          Revisar respuestas
        </button>
        <button type="button" onClick={onRestart} className="font-medium text-blue hover:underline">
          Cotizar otro equipo
        </button>
      </div>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-white/50">{k}</dt>
      <dd className="mt-0.5 font-semibold">{v}</dd>
    </div>
  );
}

function Row({ k, v, muted, strong }: { k: string; v: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-6", muted && "text-white/55", strong && "font-bold")}>
      <dt>{k}</dt>
      <dd className="shrink-0">{v}</dd>
    </div>
  );
}
