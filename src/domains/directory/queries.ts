import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { cities, directoryEntries } from "@/db/schema/tables";

const SITE_CITY_SLUG = "nanganallur";

export type PublicDirectoryRow = typeof directoryEntries.$inferSelect;

export const DIRECTORY_TYPE_SLUGS = [
  "bank",
  "school",
  "hospital",
  "park",
  "restaurant",
  "atm",
  "it_company",
  "it_park",
  "government_office",
  "industry",
  "temple",
] as const;

export type DirectoryTypeSlug = (typeof DIRECTORY_TYPE_SLUGS)[number];

export function isDirectoryTypeSlug(s: string): s is DirectoryTypeSlug {
  return (DIRECTORY_TYPE_SLUGS as readonly string[]).includes(s);
}

async function getSiteCityId(): Promise<string | null> {
  const db = getDb();
  const row = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, SITE_CITY_SLUG))
    .limit(1);
  return row[0]?.id ?? null;
}

export async function listDirectoryEntriesForSite(): Promise<PublicDirectoryRow[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  return db
    .select()
    .from(directoryEntries)
    .where(eq(directoryEntries.cityId, cityId))
    .orderBy(asc(directoryEntries.type), asc(directoryEntries.name));
}

export async function getDirectoryEntryByTypeSlug(
  type: DirectoryTypeSlug,
  slug: string,
): Promise<PublicDirectoryRow | null> {
  const cityId = await getSiteCityId();
  if (!cityId) return null;
  const db = getDb();
  const rows = await db
    .select()
    .from(directoryEntries)
    .where(
      and(
        eq(directoryEntries.cityId, cityId),
        eq(directoryEntries.type, type),
        eq(directoryEntries.slug, slug),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function listDirectoryParamsForStatic(): Promise<
  { type: string; slug: string }[]
> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({
      type: directoryEntries.type,
      slug: directoryEntries.slug,
    })
    .from(directoryEntries)
    .where(eq(directoryEntries.cityId, cityId));
  return rows.map((r) => ({ type: r.type, slug: r.slug }));
}

export async function listDirectoryForSitemap(): Promise<
  { type: string; slug: string; lastModified: Date }[]
> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({
      type: directoryEntries.type,
      slug: directoryEntries.slug,
      updatedAt: directoryEntries.updatedAt,
    })
    .from(directoryEntries)
    .where(eq(directoryEntries.cityId, cityId));
  return rows.map((r) => ({
    type: r.type,
    slug: r.slug,
    lastModified: r.updatedAt,
  }));
}
