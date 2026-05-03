import { listArticlesForSitemap } from "@/domains/news";
import { getDb } from "@/db/client";
import { articles, cities } from "@/db/schema";
import { and, desc, eq, gte } from "drizzle-orm";

export const dynamic = "force-dynamic";

const SITE_NAME = "mynanganallur.in";
const PUBLICATION_LANG = "en";

/**
 * Google News sitemap — only the last 48h of published articles, namespaced
 * with `news:news` per https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap.
 */
export async function GET(): Promise<Response> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mynanganallur.in";

  let recent: { slug: string; title: string; publishedAt: Date }[] = [];
  try {
    const db = getDb();
    const [city] = await db
      .select({ id: cities.id })
      .from(cities)
      .where(eq(cities.slug, "nanganallur"))
      .limit(1);
    if (city) {
      const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const rows = await db
        .select({
          slug: articles.slug,
          title: articles.title,
          publishedAt: articles.publishedAt,
        })
        .from(articles)
        .where(
          and(
            eq(articles.cityId, city.id),
            eq(articles.status, "published"),
            gte(articles.publishedAt, since),
          ),
        )
        .orderBy(desc(articles.publishedAt))
        .limit(1000);
      recent = rows
        .filter((r): r is typeof r & { publishedAt: Date } =>
          Boolean(r.publishedAt),
        )
        .map((r) => ({
          slug: r.slug,
          title: r.title,
          publishedAt: r.publishedAt,
        }));
    }
    if (recent.length === 0) {
      // Fallback to full sitemap rows (still keeps page valid).
      const all = await listArticlesForSitemap();
      recent = all.slice(0, 100).map((a) => ({
        slug: a.slug,
        title: a.slug,
        publishedAt: a.lastModified,
      }));
    }
  } catch {
    /* empty body if DB unreachable at build */
  }

  const urls = recent
    .map(
      (r) => `  <url>
    <loc>${escapeXml(`${base}/local-news/${r.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>${PUBLICATION_LANG}</news:language>
      </news:publication>
      <news:publication_date>${r.publishedAt.toISOString()}</news:publication_date>
      <news:title>${escapeXml(r.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
