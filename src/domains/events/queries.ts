import { and, asc, desc, eq, gte, lte, or } from "drizzle-orm";
import { getDb } from "@/db/client";
import { cities, events } from "@/db/schema/tables";

/** Must match `SITE_CITY_SLUG` in `src/domains/news/queries.ts`. */
const SITE_CITY_SLUG = "nanganallur";

export type PublicEventRow = typeof events.$inferSelect;

async function getSiteCityId(): Promise<string | null> {
  const db = getDb();
  const row = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, SITE_CITY_SLUG))
    .limit(1);
  return row[0]?.id ?? null;
}

/** Public calendar: `scheduled` only (see seed scripts). */
const publicEventCond = eq(events.status, "scheduled");

/**
 * Upcoming + ongoing events for listings (city site).
 * Includes future starts and events that have started but not yet ended.
 */
export async function listUpcomingEventsForSite(limit = 50) {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const now = new Date();
  const visibleCond = or(
    gte(events.startsAt, now),
    and(lte(events.startsAt, now), gte(events.endsAt, now)),
  );
  return db
    .select()
    .from(events)
    .where(
      and(
        eq(events.cityId, cityId),
        publicEventCond,
        visibleCond,
      ),
    )
    .orderBy(asc(events.startsAt))
    .limit(limit);
}

/**
 * Any public event by slug (including past), for detail URLs.
 */
export async function getPublishedEventBySlug(
  slug: string,
): Promise<PublicEventRow | null> {
  const cityId = await getSiteCityId();
  if (!cityId) return null;
  const db = getDb();
  const rows = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.cityId, cityId),
        eq(events.slug, slug),
        publicEventCond,
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function getPublishedEventSlugsForSite(): Promise<string[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({ slug: events.slug })
    .from(events)
    .where(and(eq(events.cityId, cityId), publicEventCond));
  return rows.map((r) => r.slug);
}

export async function listEventsForSitemap(): Promise<
  { slug: string; lastModified: Date }[]
> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({
      slug: events.slug,
      updatedAt: events.updatedAt,
    })
    .from(events)
    .where(and(eq(events.cityId, cityId), publicEventCond))
    .orderBy(desc(events.startsAt));
  return rows.map((r) => ({
    slug: r.slug,
    lastModified: r.updatedAt,
  }));
}
