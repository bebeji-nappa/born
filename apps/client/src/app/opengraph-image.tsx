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
        background: "black",
      }}
    >
      <div
        style={{
          display: "flex",
          background: "black",
          width: "90%",
          height: "90%",
          borderRadius: 30,
          padding: "50px",
          textAlign: "left",
          justifyContent: "center",
          alignItems: "center",
          color: "#262626",
          fontSize: 60,
          fontWeight: 700,
          fontFamily: '"NotoSansJP"',
        }}
      >
        <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.svg`} alt="Logo" />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
