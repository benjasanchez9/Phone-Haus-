"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ModelId } from "@/types";
import { iphoneSpecs } from "@/data/iphone-specs";

/* Estado global del comparador (hasta 3 modelos), persistido en el navegador. */

export const MAX_COMPARE = 3;
const KEY = "phonehaus:compare";

interface CompareCtx {
  items: ModelId[];
  ready: boolean;
  has: (id: ModelId) => boolean;
  add: (id: ModelId) => boolean;
  remove: (id: ModelId) => void;
  toggle: (id: ModelId) => boolean;
  setAt: (index: number, id: ModelId | null) => void;
  replaceAll: (ids: ModelId[]) => void;
  clear: () => void;
  isFull: boolean;
}

const Ctx = createContext<CompareCtx | null>(null);

const valid = (ids: unknown): ModelId[] =>
  Array.isArray(ids)
    ? Array.from(new Set(ids.filter((x): x is ModelId => typeof x === "string" && x in iphoneSpecs))).slice(0, MAX_COMPARE)
    : [];

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ModelId[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(valid(JSON.parse(raw)));
    } catch {
      /* almacenamiento no disponible: el comparador funciona en memoria */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* noop */
    }
  }, [items, ready]);

  const has = useCallback((id: ModelId) => items.includes(id), [items]);

  const add = useCallback(
    (id: ModelId) => {
      if (items.includes(id)) return true;
      if (items.length >= MAX_COMPARE) return false;
      setItems((prev) => valid([...prev, id]));
      return true;
    },
    [items],
  );

  const remove = useCallback((id: ModelId) => setItems((prev) => prev.filter((x) => x !== id)), []);

  const toggle = useCallback(
    (id: ModelId) => {
      if (items.includes(id)) {
        remove(id);
        return true;
      }
      return add(id);
    },
    [items, add, remove],
  );

  const setAt = useCallback((index: number, id: ModelId | null) => {
    setItems((prev) => {
      const next = [...prev];
      if (id === null) next.splice(index, 1);
      else if (index >= next.length) next.push(id);
      else next[index] = id;
      return valid(next);
    });
  }, []);

  const value = useMemo<CompareCtx>(
    () => ({
      items,
      ready,
      has,
      add,
      remove,
      toggle,
      setAt,
      replaceAll: (ids) => setItems(valid(ids)),
      clear: () => setItems([]),
      isFull: items.length >= MAX_COMPARE,
    }),
    [items, ready, has, add, remove, toggle, setAt],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCompare() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCompare debe usarse dentro de <CompareProvider>");
  return ctx;
}
