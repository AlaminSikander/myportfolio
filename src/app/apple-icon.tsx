import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #151d42, #0b1230)",
        color: "white",
        fontSize: 104,
        fontWeight: 800,
        letterSpacing: -4,
      }}
    >
      A<span style={{ color: "#f05a24" }}>.</span>
    </div>,
    size,
  );
}
