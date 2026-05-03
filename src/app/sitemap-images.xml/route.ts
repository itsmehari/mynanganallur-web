import { and, desc, eq, isNotNull } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  articles,
  cities,
  directoryEntries,
  propertyListings,
} from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Image sitemap per https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps.
 *
 * Lists hero images attached to articles, properties, and verified directory
 * entries. Helps Google Image Search surface our local content.
 */
export async function GET(): Promise<Response> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mynanganallur.in";
  const items: { pageUrl: string; image: string; caption: string }[] = [];

  try {
    const db = getDb();
    const [city] = await db
      .select({ id: cities.id })
      .from(cities)
      .where(eq(cities.slug, "nanganallur"))
      .limit(1);
    if (city) {
      const arts = await db
        .select({
          slug: articles.slug,
          title: articles.title,
          heroImageUrl: articles.heroImageUrl,
        })
        .from(articles)
        .where(
          and(
            eq(articles.cityId, city.id),
            eq(articles.status, "published"),
            isNotNull(articles.heroImageUrl),
          ),
        )
        .orderBy(desc(articles.createdAt))
        .limit(2000);
      for (const a of arts) {
        if (a.heroImageUrl) {
          items.push({
            pageUrl: `${base}/local-news/${a.slug}`,
            image: a.heroImageUrl,
            caption: a.title,
          });
        }
      }

      const props = await db
        .select({
          slug: propertyListings.slug,
          title: propertyListings.title,
          heroImageUrl: propertyListings.heroImageUrl,
        })
        .from(propertyListings)
        .where(
          and(
            eq(propertyListings.cityId, city.id),
            eq(propertyListings.status, "published"),
            isNotNull(propertyListings.heroImageUrl),
          ),
        )
        .limit(1000);
      for (const p of props) {
        if (p.heroImageUrl) {
          items.push({
            pageUrl: `${base}/properties/${p.slug}`,
            image: p.heroImageUrl,
            caption: p.title,
          });
        }
      }

      const dirs = await db
        .select({
          slug: directoryEntries.slug,
          type: directoryEntries.type,
          name: directoryEntries.name,
          heroImageUrl: directoryEntries.heroImageUrl,
        })
        .from(directoryEntries)
        .where(
          and(
            eq(directoryEntries.cityId, city.id),
            eq(directoryEntries.verified, true),
            isNotNull(directoryEntries.heroImageUrl),
          ),
        )
        .limit(1000);
      for (const d of dirs) {
        if (d.heroImageUrl) {
          items.push({
            pageUrl: `${base}/directory/${d.type}/${d.slug}`,
            image: d.heroImageUrl,
            caption: d.name,
          });
        }
      }
    }
  } catch {
    /* DB unreachable */
  }

  const urls = items
    .map(
      (it) => `  <url>
    <loc>${escapeXml(it.pageUrl)}</loc>
    <image:image>
      <image:loc>${escapeXml(it.image)}</image:loc>
      <image:caption>${escapeXml(it.caption)}</image:caption>
    </image:image>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
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
