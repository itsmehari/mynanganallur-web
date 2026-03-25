import { and, desc, eq, isNotNull, ne } from "drizzle-orm";
import { getDb } from "@/db/client";
import { articles, cities } from "@/db/schema/tables";

/** Primary city row for this deployment (seed + queries). */
export const SITE_CITY_SLUG = "nanganallur";

export type PublicArticleRow = typeof articles.$inferSelect;

async function getSiteCityId(): Promise<string | null> {
  const db = getDb();
  const row = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, SITE_CITY_SLUG))
    .limit(1);
  return row[0]?.id ?? null;
}

const publishedCond = and(
  eq(articles.status, "published"),
  isNotNull(articles.publishedAt),
);

export async function listPublishedArticlesForSite(limit = 50) {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  return db
    .select()
    .from(articles)
    .where(and(eq(articles.cityId, cityId), publishedCond))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<PublicArticleRow | null> {
  const cityId = await getSiteCityId();
  if (!cityId) return null;
  const db = getDb();
  const rows = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.cityId, cityId),
        eq(articles.slug, slug),
        publishedCond,
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function featuredArticlesForHome(limit = 3) {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  return db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.cityId, cityId),
        publishedCond,
        eq(articles.featured, true),
      ),
    )
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function latestArticlesForHome(limit = 8) {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  return db
    .select()
    .from(articles)
    .where(and(eq(articles.cityId, cityId), publishedCond))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getPublishedSlugsForSite(): Promise<string[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(and(eq(articles.cityId, cityId), publishedCond));
  return rows.map((r) => r.slug);
}

export async function listArticlesForSitemap(): Promise<
  { slug: string; lastModified: Date }[]
> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({
      slug: articles.slug,
      updatedAt: articles.updatedAt,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .where(and(eq(articles.cityId, cityId), publishedCond));
  return rows.map((r) => ({
    slug: r.slug,
    lastModified: r.updatedAt ?? r.publishedAt ?? new Date(),
  }));
}

export async function listArticlesByCategoryForSite(
  category: string,
  limit = 30,
) {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  return db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.cityId, cityId),
        publishedCond,
        eq(articles.category, category),
      ),
    )
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function relatedArticlesForSite(
  slug: string,
  category: string | null,
  limit = 4,
) {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const conds = [
    eq(articles.cityId, cityId),
    publishedCond,
    ne(articles.slug, slug),
  ];
  if (category) {
    conds.push(eq(articles.category, category));
  }
  return db
    .select()
    .from(articles)
    .where(and(...conds))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

/** Distinct categories that have at least one published article. */
export async function listTopicKeysForSite(): Promise<string[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .selectDistinct({ category: articles.category })
    .from(articles)
    .where(
      and(
        eq(articles.cityId, cityId),
        publishedCond,
        isNotNull(articles.category),
        ne(articles.category, ""),
      ),
    );
  return rows
    .map((r) => r.category)
    .filter((c): c is string => Boolean(c));
}
