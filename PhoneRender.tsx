import { useId } from "react";
import type { ModelId } from "@/types";

/**
 * RENDER PLACEHOLDER DE MARCA
 * Ilustración vectorial neutra (sin logos de Apple) que se usa mientras
 * no existan renders reales en /public/products. Se tiñe con el color
 * del producto y cambia el módulo de cámaras según la familia.
 */

type Layout = "dual" | "triple" | "plateau";

export function cameraLayout(modelId: ModelId | string): Layout {
  if (modelId.startsWith("iphone-17-pro")) return "plateau";
  if (modelId.includes("pro")) return "triple";
  return "dual";
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amt);
  const g = clamp(((n >> 8) & 0xff) + amt);
  const b = clamp((n & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}

function isLight(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = n >> 16, g = (n >> 8) & 0xff, b = n & 0xff;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export function PhoneRender({
  modelId,
  color,
  view = "back",
  className,
  title,
}: {
  modelId: ModelId | string;
  color: string;
  view?: "back" | "front";
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const layout = cameraLayout(modelId);
  const light = isLight(color);
  const edge = shade(color, light ? -38 : -18);
  const gen = parseInt(String(modelId).split("-")[1] ?? "0", 10);
  const hasIsland = gen >= 15 || (gen === 14 && String(modelId).includes("pro"));

  if (view === "front") {
    return (
      <svg viewBox="0 0 200 400" className={className} role="img" aria-label={title}>
        <defs>
          <linearGradient id={`scr-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={shade(color, light ? -60 : 30)} />
            <stop offset="0.55" stopColor="rgb(18,24,60)" />
            <stop offset="1" stopColor="rgb(26,72,255)" />
          </linearGradient>
        </defs>
        <rect x="21" y="11" width="158" height="378" rx="31" fill={edge} />
        <rect x="24" y="14" width="152" height="372" rx="28" fill="#050505" />
        <rect x="30" y="20" width="140" height="360" rx="23" fill={`url(#scr-${uid})`} />
        {hasIsland ? (
          <rect x="78" y="30" width="44" height="13" rx="6.5" fill="#000" />
        ) : (
          <path d="M72 20h56v6a8 8 0 0 1-8 8H80a8 8 0 0 1-8-8z" fill="#000" />
        )}
        <rect x="80" y="364" width="40" height="3.5" rx="1.75" fill="rgba(255,255,255,.7)" />
      </svg>
    );
  }

  const lens = (cx: number, cy: number, r: number, key: string) => (
    <g key={key}>
      <circle cx={cx} cy={cy} r={r + 2.5} fill={shade(color, light ? -24 : 22)} />
      <circle cx={cx} cy={cy} r={r} fill="#0b0c10" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill={`url(#lens-${uid})`} />
      <circle cx={cx - r * 0.25} cy={cy - r * 0.3} r={r * 0.16} fill="rgba(255,255,255,.55)" />
    </g>
  );

  return (
    <svg viewBox="0 0 200 400" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0" stopColor={shade(color, 22)} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={shade(color, -26)} />
        </linearGradient>
        <radialGradient id={`lens-${uid}`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#3a4a8a" />
          <stop offset="0.5" stopColor="#141a33" />
          <stop offset="1" stopColor="#050608" />
        </radialGradient>
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,.28)" />
          <stop offset="0.35" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      <rect x="21" y="11" width="158" height="378" rx="31" fill={edge} />
      <rect x="23" y="13" width="154" height="374" rx="29" fill={`url(#body-${uid})`} />
      <rect x="23" y="13" width="154" height="374" rx="29" fill={`url(#sheen-${uid})`} />
      {/* botones laterales */}
      <rect x="18.5" y="92" width="3" height="22" rx="1.5" fill={edge} />
      <rect x="18.5" y="124" width="3" height="36" rx="1.5" fill={edge} />
      <rect x="178.5" y="118" width="3" height="52" rx="1.5" fill={edge} />

      {layout === "plateau" && (
        <g>
          <rect x="27" y="22" width="146" height="84" rx="24" fill={shade(color, light ? -14 : 14)} />
          <rect x="27" y="22" width="146" height="84" rx="24" fill="none" stroke={edge} strokeWidth="1" />
          {lens(56, 46, 13, "a")}
          {lens(56, 82, 13, "b")}
          {lens(88, 64, 13, "c")}
          <circle cx="146" cy="48" r="5" fill="#f5efe0" opacity=".85" />
          <circle cx="146" cy="80" r="4" fill="#0b0c10" />
        </g>
      )}
      {layout === "triple" && (
        <g>
          <rect x="30" y="25" width="84" height="84" rx="22" fill={shade(color, light ? -12 : 14)} stroke={edge} strokeWidth="1" />
          {lens(54, 49, 13, "a")}
          {lens(54, 85, 13, "b")}
          {lens(88, 67, 13, "c")}
          <circle cx="92" cy="40" r="4.5" fill="#f5efe0" opacity=".85" />
          <circle cx="92" cy="94" r="3.5" fill="#0b0c10" />
        </g>
      )}
      {layout === "dual" && (
        <g>
          <rect x="30" y="25" width="68" height="68" rx="19" fill={shade(color, light ? -10 : 14)} stroke={edge} strokeWidth="1" />
          {lens(52, 47, 11.5, "a")}
          {lens(76, 71, 11.5, "b")}
          <circle cx="80" cy="42" r="3.8" fill="#f5efe0" opacity=".85" />
        </g>
      )}
    </svg>
  );
}
