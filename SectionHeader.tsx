import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function SectionHeader({
  title,
  intro,
  action,
  className,
  as: Tag = "h2",
  invert,
}: {
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
  invert?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        <span className="rule mb-5" aria-hidden />
        <Tag className={cn("display text-[2.4rem] sm:text-[3.4rem]", invert && "text-white")}>{title}</Tag>
        {intro && <p className={cn("lead mt-4 max-w-xl", invert && "text-white/65")}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
