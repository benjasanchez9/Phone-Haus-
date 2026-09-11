"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare, MAX_COMPARE } from "./CompareProvider";
import { iphoneSpecs } from "@/data/iphone-specs";
import { IconClose } from "@/components/ui/Icon";

/** Barra discreta que aparece cuando hay modelos para comparar. */
export function CompareTray() {
  const { items, remove, ready } = useCompare();
  const pathname = usePathname();
  if (!ready || items.length === 0 || pathname.startsWith("/comparador") || pathname.startsWith("/plan-recambio")) return null;

  return (
    <div className={`pointer-events-none fixed inset-x-0 z-30 flex justify-center px-4 ${pathname.startsWith("/iphones/") ? "bottom-[84px] sm:bottom-4" : "bottom-4"}`}>
      <div className="pointer-events-auto flex w-full max-w-xl animate-rise items-center gap-3 rounded-md bg-ink p-2 pl-4 text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,.45)]">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-white/55">
            Comparador {items.length}/{MAX_COMPARE}
          </p>
          <ul className="mt-0.5 flex gap-2 overflow-x-auto scrollbar-none text-sm font-medium">
            {items.map((id) => (
              <li key={id} className="flex shrink-0 items-center gap-1">
                {iphoneSpecs[id].name.replace("iPhone ", "")}
                <button type="button" onClick={() => remove(id)} aria-label={`Quitar ${iphoneSpecs[id].name}`} className="text-white/50 hover:text-white">
                  <IconClose size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/comparador" className="inline-flex h-10 shrink-0 items-center rounded bg-blue px-4 text-sm font-semibold transition-colors hover:bg-blue-deep">
          Comparar
        </Link>
      </div>
    </div>
  );
}
