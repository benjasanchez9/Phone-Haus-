import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Tone = "new" | "used" | "blue" | "neutral" | "ok" | "warn" | "danger";

const tones: Record<Tone, string> = {
  new: "bg-ink text-white",
  used: "bg-surface text-ink ring-1 ring-inset ring-ink/15",
  blue: "bg-blue text-white",
  neutral: "bg-ink/[0.05] text-ink",
  ok: "text-ok",
  warn: "text-warn",
  danger: "text-danger",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  const dot = tone === "ok" || tone === "warn" || tone === "danger";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-[0.72rem] font-semibold leading-none",
        dot ? "" : "rounded-sm px-2 py-1",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}
