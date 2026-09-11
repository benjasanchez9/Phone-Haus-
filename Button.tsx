import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "dark" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-deep",
  dark: "bg-ink text-white hover:bg-ink/85",
  outline: "border border-ink/20 bg-transparent text-ink hover:border-ink",
  ghost: "text-ink hover:text-blue",
  light: "bg-white text-ink hover:bg-white/85",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 rounded font-semibold tracking-[-0.005em] transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    sizes[size],
    extra,
  );
}

interface LinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  "aria-label"?: string;
}

export function ButtonLink({ href, children, variant, size, className, external, ...rest }: LinkProps) {
  const cls = buttonClass(variant, size, className);
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className, type = "button", ...rest }: BtnProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...rest} />;
}
