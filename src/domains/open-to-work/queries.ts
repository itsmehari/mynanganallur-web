import { unstable_noStore as noStore } from "next/cache";
import { and, desc, eq, gt, isNull, or } from "drizzle-orm";
import { getDb } from "@/db/client";
import { cities, openToWorkProfiles } from "@/db/schema/tables";

const SITE_CITY_SLUG = "nanganallur";

export type OpenToWorkProfile = typeof openToWorkProfiles.$inferSelect;

async function getSiteCityId(): Promise<string | null> {
  const db = getDb();
  const row = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, SITE_CITY_SLUG))
    .limit(1);
  return row[0]?.id ?? null;
}

const openCond = and(
  eq(openToWorkProfiles.status, "open"),
  or(
    isNull(openToWorkProfiles.expiresAt),
    gt(openToWorkProfiles.expiresAt, new Date()),
  ),
);

export async function listOpenProfilesForSite(
  limit = 50,
): Promise<OpenToWorkProfile[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  return db
    .select()
    .from(openToWorkProfiles)
    .where(and(eq(openToWorkProfiles.cityId, cityId), openCond))
    .orderBy(desc(openToWorkProfiles.featured), desc(openToWorkProfiles.publishedAt))
    .limit(limit);
}

export async function getOpenProfileBySlug(
  slug: string,
): Promise<OpenToWorkProfile | null> {
  noStore();
  const cityId = await getSiteCityId();
  if (!cityId) return null;
  const db = getDb();
  const rows = await db
    .select()
    .from(openToWorkProfiles)
    .where(
      and(
        eq(openToWorkProfiles.cityId, cityId),
        eq(openToWorkProfiles.slug, slug),
        openCond,
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function getOpenProfileSlugsForSite(): Promise<string[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({ slug: openToWorkProfiles.slug })
    .from(openToWorkProfiles)
    .where(and(eq(openToWorkProfiles.cityId, cityId), openCond));
  return rows.map((r) => r.slug);
}

export async function listOpenToWorkForSitemap(): Promise<
  { slug: string; lastModified: Date }[]
> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({
      slug: openToWorkProfiles.slug,
      updatedAt: openToWorkProfiles.updatedAt,
    })
    .from(openToWorkProfiles)
    .where(and(eq(openToWorkProfiles.cityId, cityId), openCond))
    .orderBy(desc(openToWorkProfiles.featured), desc(openToWorkProfiles.publishedAt));
  return rows.map((r) => ({
    slug: r.slug,
    lastModified: r.updatedAt,
  }));
}
