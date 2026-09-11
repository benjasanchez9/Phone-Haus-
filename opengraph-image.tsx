import { ImageResponse } from "next/og";

export const alt = "Phone Haus. Tecnología con confianza.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F6F6F3", padding: 72 }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
          PHONE<span style={{ color: "#1A48FF", marginLeft: 12 }}>HAUS</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 80, height: 6, background: "#1A48FF", marginBottom: 32 }} />
          <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 0.95, letterSpacing: -3 }}>TU PRÓXIMO iPHONE</div>
          <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 0.95, letterSpacing: -3 }}>ESTÁ EN PHONE HAUS.</div>
        </div>
        <div style={{ fontSize: 28, color: "#686864" }}>Nuevos y seminuevos. Garantía, recambio y financiación.</div>
      </div>
    ),
    size,
  );
}
