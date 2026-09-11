"use client";

import { useState } from "react";
import type { ModelId } from "@/types";
import { useCompare, MAX_COMPARE } from "./CompareProvider";
import { IconCheck, IconPlus } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

export function CompareToggle({ modelId, label = "Comparar", className, block }: { modelId: ModelId; label?: string; className?: string; block?: boolean }) {
  const { has, toggle } = useCompare();
  const [msg, setMsg] = useState<string | null>(null);
  const active = has(modelId);

  return (
    <div className={cn("relative", block && "w-full")}>
      <button
        type="button"
        aria-pressed={active}
        onClick={() => {
          const ok = toggle(modelId);
          if (!ok) {
            setMsg(`Máximo ${MAX_COMPARE} modelos`);
            window.setTimeout(() => setMsg(null), 2200);
          }
        }}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-1.5 rounded border px-3.5 text-sm font-semibold transition-colors",
          active ? "border-blue bg-blue-soft text-blue" : "border-ink/15 text-ink hover:border-ink",
          block && "w-full",
          className,
        )}
      >
        {active ? <IconCheck size={16} /> : <IconPlus size={16} />}
        {active ? "En comparador" : label}
      </button>
      <span role="status" aria-live="polite" className={cn("absolute left-0 top-full mt-1 whitespace-nowrap text-xs text-danger", !msg && "sr-only")}>
        {msg ?? ""}
      </span>
    </div>
  );
}
