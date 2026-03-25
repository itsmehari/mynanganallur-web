import { listPublishedArticlesForSite } from "@/domains/news";
import { getSiteUrl } from "@/lib/env";

export const revalidate = 300;

export async function GET() {
  const base = getSiteUrl();
  let items: Awaited<ReturnType<typeof listPublishedArticlesForSite>> = [];
  try {
    items = await listPublishedArticlesForSite(30);
  } catch {
    items = [];
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>mynanganallur.in — Local news</title>
    <link>${base}/local-news</link>
    <description>Nanganallur local news with editorial analysis from mynanganallur.in.</description>
    <language>en-in</language>
    ${items
      .map((a) => {
        const link = `${base}/local-news/${a.slug}`;
        const pub = a.publishedAt
          ? new Date(a.publishedAt).toUTCString()
          : new Date(a.createdAt).toUTCString();
        const desc = escapeXml(a.summary ?? a.dek ?? a.title);
        return `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pub}</pubDate>
      <description>${desc}</description>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
  });
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
