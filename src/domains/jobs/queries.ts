import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { cities, employers, jobPostings } from "@/db/schema/tables";

const SITE_CITY_SLUG = "nanganallur";

export type JobWithEmployer = {
  job: typeof jobPostings.$inferSelect;
  employer: typeof employers.$inferSelect;
};

async function getSiteCityId(): Promise<string | null> {
  const db = getDb();
  const row = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, SITE_CITY_SLUG))
    .limit(1);
  return row[0]?.id ?? null;
}

const openCond = eq(jobPostings.status, "open");

export async function listOpenJobsForSite(limit = 50): Promise<JobWithEmployer[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  return db
    .select({ job: jobPostings, employer: employers })
    .from(jobPostings)
    .innerJoin(employers, eq(jobPostings.employerId, employers.id))
    .where(and(eq(jobPostings.cityId, cityId), openCond))
    .orderBy(desc(jobPostings.featured), desc(jobPostings.createdAt))
    .limit(limit);
}

export async function getOpenJobBySlug(
  slug: string,
): Promise<JobWithEmployer | null> {
  const cityId = await getSiteCityId();
  if (!cityId) return null;
  const db = getDb();
  const rows = await db
    .select({ job: jobPostings, employer: employers })
    .from(jobPostings)
    .innerJoin(employers, eq(jobPostings.employerId, employers.id))
    .where(
      and(
        eq(jobPostings.cityId, cityId),
        eq(jobPostings.slug, slug),
        openCond,
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function getOpenJobSlugsForSite(): Promise<string[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({ slug: jobPostings.slug })
    .from(jobPostings)
    .where(and(eq(jobPostings.cityId, cityId), openCond));
  return rows.map((r) => r.slug);
}

export async function listJobsForSitemap(): Promise<
  { slug: string; lastModified: Date }[]
> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({
      slug: jobPostings.slug,
      updatedAt: jobPostings.updatedAt,
    })
    .from(jobPostings)
    .where(and(eq(jobPostings.cityId, cityId), openCond))
    .orderBy(desc(jobPostings.featured), desc(jobPostings.createdAt));
  return rows.map((r) => ({
    slug: r.slug,
    lastModified: r.updatedAt,
  }));
}
