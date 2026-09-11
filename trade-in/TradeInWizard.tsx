"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { BackCondition, FunctionalChecks, Product, ScreenCondition, SidesCondition, TradeInInput, TradeInResult } from "@/types";
import { tradeInModels } from "@/data/trade-in-values";
import { backLabels, functionalQuestions, screenLabels, sidesLabels } from "@/data/trade-in-rules";
import { calculateTradeIn, getTradeInModel, isValidBattery } from "@/lib/trade-in-engine";
import { formatStorage } from "@/utils/format";
import { PhoneRender } from "@/components/product/PhoneRender";
import { Button } from "@/components/ui/Button";
import { IconChevronLeft } from "@/components/ui/Icon";
import { TradeInResultView } from "./TradeInResult";
import { cn } from "@/utils/cn";

const STEPS = ["Modelo", "Capacidad", "Reparaciones", "Batería", "Estado físico", "Funcionamiento"] as const;

type Answers = {
  modelId: string | null;
  storageGB: number | null;
  repaired: boolean | null;
  battery: string;
  screen: ScreenCondition | null;
  sides: SidesCondition | null;
  back: BackCondition | null;
  functional: Partial<Record<keyof FunctionalChecks, boolean>>;
};

const initial: Answers = {
  modelId: null,
  storageGB: null,
  repaired: null,
  battery: "",
  screen: null,
  sides: null,
  back: null,
  functional: {},
};

const generations = Array.from(new Set(tradeInModels.map((m) => m.generation))).sort((a, b) => b - a);

export function TradeInWizard({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(initial);
  const [done, setDone] = useState<{ input: TradeInInput; result: TradeInResult } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const model = a.modelId ? getTradeInModel(a.modelId) : undefined;
  const batteryNum = a.battery === "" ? NaN : Number(a.battery);
  const batteryOk = isValidBattery(batteryNum);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const top = topRef.current;
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, done]);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return !!a.modelId;
      case 1:
        return !!a.storageGB;
      case 2:
        return a.repaired !== null;
      case 3:
        return batteryOk;
      case 4:
        return !!a.screen && !!a.sides && !!a.back;
      case 5:
        return functionalQuestions.every((q) => typeof a.functional[q.key] === "boolean");
      default:
        return false;
    }
  }, [step, a, batteryOk]);

  const buildInput = (): TradeInInput => ({
    modelId: a.modelId!,
    storageGB: a.storageGB!,
    repairedParts: a.repaired === true,
    batteryHealth: batteryOk ? batteryNum : 0,
    screen: a.screen ?? "excelente",
    sides: a.sides ?? "excelente",
    back: a.back ?? "excelente",
    functional: {
      powersOn: a.functional.powersOn ?? true,
      faceId: a.functional.faceId ?? true,
      cameras: a.functional.cameras ?? true,
      buttons: a.functional.buttons ?? true,
      charging: a.functional.charging ?? true,
      audio: a.functional.audio ?? true,
      icloudFree: a.functional.icloudFree ?? true,
      imeiClean: a.functional.imeiClean ?? true,
    },
  });

  const finish = () => {
    const input = buildInput();
    setDone({ input, result: calculateTradeIn(input) });
  };

  const next = () => {
    if (!canContinue) return;
    if (step === 2 && a.repaired) return finish(); // Regla: piezas cambiadas → evaluación personalizada
    if (step === STEPS.length - 1) return finish();
    setStep((s) => s + 1);
  };

  const back = () => {
    if (done) {
      setDone(null);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const restart = () => {
    setA(initial);
    setDone(null);
    setStep(0);
  };

  if (done && model) {
    return (
      <div ref={topRef} className="scroll-mt-[calc(var(--header-h)+16px)]">
        <TradeInResultView
          headingRef={headingRef}
          modelName={model.name}
          input={done.input}
          result={done.result}
          products={products}
          onBack={back}
          onRestart={restart}
        />
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-[calc(var(--header-h)+16px)]">
      {/* Progreso */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between text-sm">
          <p className="font-semibold">
            Paso {step + 1} <span className="font-normal text-mute">de {STEPS.length}</span>
          </p>
          <p className="text-mute">{STEPS[step]}</p>
        </div>
        <div
          className="mt-3 grid gap-1"
          style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          aria-label="Progreso de la cotización"
        >
          {STEPS.map((s, i) => (
            <span key={s} className="h-[3px] overflow-hidden bg-ink/10">
              <span
                className="block h-full bg-blue transition-[width] duration-500 ease-out"
                style={{ width: i < step ? "100%" : i === step ? (canContinue ? "100%" : "40%") : "0%" }}
              />
            </span>
          ))}
        </div>
      </div>

      <div key={step} className="animate-settle">
        {step === 0 && (
          <StepFrame title="¿Qué iPhone tenés?" hint="Aceptamos desde iPhone 11 en adelante." headingRef={headingRef}>
            <div className="space-y-6">
              {generations.map((g) => (
                <fieldset key={g}>
                  <legend className="mb-2 text-xs font-semibold text-mute">iPhone {g}</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {tradeInModels
                      .filter((m) => m.generation === g)
                      .map((m) => (
                        <Choice
                          key={m.id}
                          selected={a.modelId === m.id}
                          onSelect={() => setA((p) => ({ ...p, modelId: m.id, storageGB: p.modelId === m.id ? p.storageGB : null }))}
                          label={m.name.replace("iPhone ", "")}
                          name="modelo"
                        />
                      ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </StepFrame>
        )}

        {step === 1 && model && (
          <StepFrame title="¿Qué capacidad tiene?" hint={`Capacidades disponibles para ${model.name}.`} headingRef={headingRef}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {model.capacities.map((c) => (
                <Choice key={c} selected={a.storageGB === c} onSelect={() => setA((p) => ({ ...p, storageGB: c }))} label={formatStorage(c)} name="capacidad" large />
              ))}
            </div>
            <p className="mt-4 text-sm text-mute">Lo ves en Ajustes, General, Información.</p>
          </StepFrame>
        )}

        {step === 2 && (
          <StepFrame title="¿El equipo tuvo piezas cambiadas o reparaciones?" hint="Pantalla, batería, cámaras u otras piezas reemplazadas." headingRef={headingRef}>
            <div className="grid grid-cols-2 gap-2">
              <Choice selected={a.repaired === false} onSelect={() => setA((p) => ({ ...p, repaired: false }))} label="No" name="reparado" large />
              <Choice selected={a.repaired === true} onSelect={() => setA((p) => ({ ...p, repaired: true }))} label="Sí" name="reparado" large />
            </div>
            {a.repaired && (
              <p className="mt-4 animate-fade rounded-md bg-blue-soft p-4 text-sm text-ink/80">
                Los equipos con piezas cambiadas no tienen cotización automática. Te pasamos directo a una evaluación personalizada.
              </p>
            )}
          </StepFrame>
        )}

        {step === 3 && (
          <StepFrame title="¿Cuál es la salud de la batería?" hint="Ajustes, Batería, Estado y carga de la batería." headingRef={headingRef}>
            <BatteryInput value={a.battery} onChange={(v) => setA((p) => ({ ...p, battery: v }))} valid={batteryOk} />
          </StepFrame>
        )}

        {step === 4 && (
          <StepFrame title="¿En qué estado está?" hint="Elegí la opción que mejor lo describa. Mirá el equipo con buena luz." headingRef={headingRef}>
            <div className="space-y-8">
              <ConditionGroup
                legend="Pantalla"
                options={Object.entries(screenLabels) as [ScreenCondition, string][]}
                value={a.screen}
                onChange={(v) => setA((p) => ({ ...p, screen: v }))}
              />
              <ConditionGroup
                legend="Laterales"
                options={Object.entries(sidesLabels) as [SidesCondition, string][]}
                value={a.sides}
                onChange={(v) => setA((p) => ({ ...p, sides: v }))}
              />
              <ConditionGroup
                legend="Parte trasera"
                options={Object.entries(backLabels) as [BackCondition, string][]}
                value={a.back}
                onChange={(v) => setA((p) => ({ ...p, back: v }))}
              />
            </div>
          </StepFrame>
        )}

        {step === 5 && (
          <StepFrame title="¿Cómo funciona?" hint="Respondé cada punto. Si algo falla, lo evaluamos de forma personalizada." headingRef={headingRef}>
            <ul className="divide-y divide-line border-y border-line">
              {functionalQuestions.map((q) => (
                <li key={q.key} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p id={`q-${q.key}`} className="font-medium">
                    {q.question}
                  </p>
                  <div role="radiogroup" aria-labelledby={`q-${q.key}`} className="grid shrink-0 grid-cols-2 gap-2 sm:w-44">
                    {[true, false].map((v) => {
                      const on = a.functional[q.key] === v;
                      return (
                        <button
                          key={String(v)}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => setA((p) => ({ ...p, functional: { ...p.functional, [q.key]: v } }))}
                          className={cn(
                            "h-11 rounded border text-sm font-semibold transition-colors",
                            on ? (v ? "border-blue bg-blue text-white" : "border-ink bg-ink text-white") : "border-line bg-surface hover:border-ink/40",
                          )}
                        >
                          {v ? "Sí" : "No"}
                        </button>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </StepFrame>
        )}
      </div>

      {/* Acciones: fijas abajo en mobile para usar con una mano */}
      <div className="sticky bottom-0 z-10 -mx-5 mt-10 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={back} className="px-4" aria-label="Paso anterior">
              <IconChevronLeft size={18} />
              <span className="hidden sm:inline">Atrás</span>
            </Button>
          )}
          <Button variant="dark" size="lg" onClick={next} disabled={!canContinue} className="flex-1 sm:flex-none sm:px-10">
            {step === STEPS.length - 1 || (step === 2 && a.repaired) ? "Ver resultado" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Subcomponentes ---------- */

function StepFrame({
  title,
  hint,
  children,
  headingRef,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="display-sm text-[1.9rem] outline-none sm:text-[2.5rem]">
        {title}
      </h2>
      {hint && <p className="mt-3 text-mute">{hint}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Choice({ selected, onSelect, label, name, large }: { selected: boolean; onSelect: () => void; label: string; name: string; large?: boolean }) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer items-center justify-center rounded border px-3 text-center font-semibold transition-[border-color,background-color,color] duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue",
        large ? "h-16 text-lg" : "h-12 text-[0.95rem]",
        selected ? "border-blue bg-blue text-white" : "border-line bg-surface hover:border-ink/40",
      )}
    >
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="sr-only" />
      {label}
    </label>
  );
}

function ConditionGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: [T, string][];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold">{legend}</legend>
      <div className={cn("grid gap-2", options.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 min-[420px]:grid-cols-3")}>
        {options.map(([k, label]) => (
          <Choice key={k} selected={value === k} onSelect={() => onChange(k)} label={label} name={legend} />
        ))}
      </div>
    </fieldset>
  );
}

function BatteryInput({ value, onChange, valid }: { value: string; onChange: (v: string) => void; valid: boolean }) {
  const id = useId();
  const num = Number(value);
  const showError = value !== "" && !valid;
  const tone = !valid ? "text-ink" : num >= 90 ? "text-blue" : num >= 80 ? "text-ink" : "text-warn";
  return (
    <div>
      <div className="flex items-end gap-6">
        <div className="relative">
          <label htmlFor={id} className="sr-only">
            Salud de batería en porcentaje
          </label>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            step={1}
            placeholder="—"
            value={value}
            aria-invalid={showError}
            aria-describedby={`${id}-help`}
            onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, "").slice(0, 3))}
            className={cn(
              "w-[4.2ch] border-b-2 bg-transparent text-[4.5rem] font-extrabold leading-none tracking-[-0.04em] outline-none transition-colors sm:text-[6rem]",
              showError ? "border-danger text-danger" : "border-ink focus:border-blue",
              tone,
            )}
            style={{ fontStretch: "110%" }}
          />
          <span className="absolute -right-8 bottom-3 text-3xl font-bold text-mute sm:-right-10 sm:text-4xl">%</span>
        </div>
        <div className="ml-10 hidden h-28 sm:block">
          <PhoneRender modelId="iphone-15" color="#D8D8D3" view="front" className="h-full w-auto" />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={valid ? num : 90}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Salud de batería"
        className="mt-8 w-full max-w-md accent-[rgb(var(--blue))]"
      />
      <p id={`${id}-help`} className={cn("mt-3 text-sm", showError ? "text-danger" : "text-mute")}>
        {showError ? "Ingresá un número entero entre 0 y 100." : "Un valor entre 0 y 100. Si no lo sabés, usá el deslizador como aproximación."}
      </p>
    </div>
  );
}
