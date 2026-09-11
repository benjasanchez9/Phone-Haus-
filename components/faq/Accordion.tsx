"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/types";
import { IconPlus } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

/* Acordeón accesible: botón con aria-expanded + región asociada. */
export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const base = useId();
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => {
        const isOpen = open === item.id;
        const btn = `${base}-${item.id}-b`;
        const panel = `${base}-${item.id}-p`;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-semibold transition-colors hover:text-blue"
              >
                {item.question}
                <IconPlus size={20} className={cn("shrink-0 transition-transform duration-300", isOpen && "rotate-45 text-blue")} />
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={btn}
              className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-2xl pb-6 leading-relaxed text-mute">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
