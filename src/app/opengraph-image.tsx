import { ImageResponse } from "next/og";
import { person } from "@/data/site";

export const alt = `${person.name} — Software QA Engineer, SEO Specialist & Operations Professional`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const pillars = [
  { label: "Quality Assurance", color: "#12b597" },
  { label: "SEO & Digital Marketing", color: "#3a6cf6" },
  { label: "Management & Operations", color: "#f05a24" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#060a1d",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(240,90,36,0.45), transparent 45%), radial-gradient(circle at 10% 95%, rgba(58,108,246,0.4), transparent 45%)",
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "white",
            color: "#0b1230",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 800,
          }}
        >
          A<span style={{ color: "#f05a24" }}>.</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, opacity: 0.85 }}>Portfolio</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>{person.name}</div>
        <div style={{ fontSize: 34, marginTop: 18, opacity: 0.8 }}>
          Building better digital experiences through quality, search &amp; strategy.
        </div>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {pillars.map((pillar) => (
          <div
            key={pillar.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 22px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.06)",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 999, background: pillar.color }} />
            {pillar.label}
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
