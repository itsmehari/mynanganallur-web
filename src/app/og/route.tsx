import { ImageResponse } from "next/og";

export const runtime = "edge";

const KIND_LABEL: Record<string, string> = {
  job: "Job",
  event: "Event",
  property: "Property",
  business: "Business",
  article: "News",
  area: "Area",
  topic: "Topic",
  default: "mynanganallur.in",
};

const KIND_ACCENT: Record<string, string> = {
  job: "#0E7C66",
  event: "#9F4D2A",
  property: "#5B5BD6",
  business: "#0E7C66",
  article: "#1F2937",
  area: "#5B5BD6",
  topic: "#9F4D2A",
  default: "#1F2937",
};

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const title = (url.searchParams.get("title") ?? "mynanganallur.in").slice(0, 140);
  const kindRaw = url.searchParams.get("kind") ?? "default";
  const kind = KIND_LABEL[kindRaw] ? kindRaw : "default";
  const locality = url.searchParams.get("locality")?.slice(0, 60) ?? "Nanganallur, Chennai";
  const accent = KIND_ACCENT[kind] ?? KIND_ACCENT.default;
  const kindLabel = KIND_LABEL[kind];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg,#FFFCF7 0%,#F5F0E8 100%)",
          padding: "70px 80px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: accent,
            }}
          />
          <p
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 1.2,
              color: accent,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {kindLabel}
          </p>
        </div>

        <h1
          style={{
            marginTop: 28,
            fontSize: title.length > 80 ? 56 : 72,
            lineHeight: 1.05,
            color: "#1F2937",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            maxWidth: 1040,
          }}
        >
          {title}
        </h1>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 30,
            borderTop: "2px solid rgba(31,41,55,0.12)",
          }}
        >
          <p
            style={{
              fontSize: 28,
              color: "#1F2937",
              fontWeight: 600,
              margin: 0,
            }}
          >
            mynanganallur.in
          </p>
          <p
            style={{
              fontSize: 24,
              color: "#6B7280",
              margin: 0,
            }}
          >
            {locality}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
