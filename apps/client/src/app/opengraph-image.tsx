import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "white",
        padding: "60px",
      }}
    >
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/born_logo.svg`}
        alt="Born Logo"
      />
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
