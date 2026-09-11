import { cn } from "@/utils/cn";

/**
 * LOGO PHONE HAUS
 * Placeholder tipográfico hasta cargar el logo oficial.
 * REPLACE: subir el archivo a /public/brand/logo.svg (y logo-white.svg)
 * y reemplazar el <span> por:
 *   <Image src={invert ? "/brand/logo-white.svg" : "/brand/logo.svg"} alt="Phone Haus" width={140} height={28} priority />
 * No rediseñar el logo: usar el archivo original de la marca.
 */
export function Logo({ invert, className }: { invert?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline text-[1.2rem] uppercase leading-none tracking-[-0.02em]",
        invert ? "text-white" : "text-ink",
        className,
      )}
      style={{ fontWeight: 850, fontStretch: "118%" }}
    >
      Phone<span className="ml-[0.18em] text-blue">Haus</span>
      <span className="sr-only"> — inicio</span>
    </span>
  );
}
