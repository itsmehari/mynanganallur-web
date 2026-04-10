import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { cities, propertyListings } from "@/db/schema/tables";

const SITE_CITY_SLUG = "nanganallur";

const publishedCond = eq(propertyListings.status, "published");

async function getSiteCityId(): Promise<string | null> {
  const db = getDb();
  const row = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, SITE_CITY_SLUG))
    .limit(1);
  return row[0]?.id ?? null;
}

export async function listPublishedPropertiesForSite(
  limit = 50,
): Promise<(typeof propertyListings.$inferSelect)[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  return db
    .select()
    .from(propertyListings)
    .where(and(eq(propertyListings.cityId, cityId), publishedCond))
    .orderBy(
      desc(propertyListings.featured),
      desc(propertyListings.publishedAt),
      desc(propertyListings.createdAt),
    )
    .limit(limit);
}

export async function getPublishedPropertyBySlug(
  slug: string,
): Promise<typeof propertyListings.$inferSelect | null> {
  const cityId = await getSiteCityId();
  if (!cityId) return null;
  const db = getDb();
  const rows = await db
    .select()
    .from(propertyListings)
    .where(
      and(
        eq(propertyListings.cityId, cityId),
        eq(propertyListings.slug, slug),
        publishedCond,
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function getPublishedPropertySlugsForSite(): Promise<string[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({ slug: propertyListings.slug })
    .from(propertyListings)
    .where(and(eq(propertyListings.cityId, cityId), publishedCond));
  return rows.map((r) => r.slug);
}

export async function listPropertiesForSitemap(): Promise<
  { slug: string; lastModified: Date }[]
> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({
      slug: propertyListings.slug,
      updatedAt: propertyListings.updatedAt,
    })
    .from(propertyListings)
    .where(and(eq(propertyListings.cityId, cityId), publishedCond))
    .orderBy(
      desc(propertyListings.featured),
      desc(propertyListings.publishedAt),
      desc(propertyListings.createdAt),
    );
  return rows.map((r) => ({
    slug: r.slug,
    lastModified: r.updatedAt,
  }));
}
