import { unstable_noStore as noStore } from "next/cache";
import { and, desc, eq, gt, inArray, isNull, or, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { cities, employers, jobPostings } from "@/db/schema/tables";
import { jobSlugLookupCandidates } from "@/lib/jobs/slug-normalize";

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

/** Still publicly listable: open and not past expires_at. */
function publiclyVisibleCond() {
  return and(
    openCond,
    or(isNull(jobPostings.expiresAt), gt(jobPostings.expiresAt, sql`now()`)),
  );
}

async function closeIfExpired(
  row: JobWithEmployer | null,
): Promise<JobWithEmployer | null> {
  if (!row) return null;
  const { job } = row;
  if (job.expiresAt && job.expiresAt.getTime() <= Date.now()) {
    if (job.status === "open") {
      const db = getDb();
      await db
        .update(jobPostings)
        .set({ status: "closed", updatedAt: new Date() })
        .where(eq(jobPostings.id, job.id));
    }
    return null;
  }
  return row;
}

export async function listOpenJobsForSite(limit = 50): Promise<JobWithEmployer[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  return db
    .select({ job: jobPostings, employer: employers })
    .from(jobPostings)
    .innerJoin(employers, eq(jobPostings.employerId, employers.id))
    .where(and(eq(jobPostings.cityId, cityId), publiclyVisibleCond()))
    .orderBy(desc(jobPostings.featured), desc(jobPostings.createdAt))
    .limit(limit);
}

export async function getOpenJobBySlug(
  slug: string,
): Promise<JobWithEmployer | null> {
  noStore();
  const cityId = await getSiteCityId();
  if (!cityId) return null;
  const candidates = jobSlugLookupCandidates(slug);
  if (candidates.length === 0) return null;

  const db = getDb();
  const rows = await db
    .select({ job: jobPostings, employer: employers })
    .from(jobPostings)
    .innerJoin(employers, eq(jobPostings.employerId, employers.id))
    .where(
      and(
        eq(jobPostings.cityId, cityId),
        inArray(jobPostings.slug, candidates),
        openCond,
      ),
    )
    .limit(1);
  return closeIfExpired(rows[0] ?? null);
}

export async function getOpenJobSlugsForSite(): Promise<string[]> {
  const cityId = await getSiteCityId();
  if (!cityId) return [];
  const db = getDb();
  const rows = await db
    .select({ slug: jobPostings.slug })
    .from(jobPostings)
    .where(and(eq(jobPostings.cityId, cityId), publiclyVisibleCond()));
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
    .where(and(eq(jobPostings.cityId, cityId), publiclyVisibleCond()))
    .orderBy(desc(jobPostings.featured), desc(jobPostings.createdAt));
  return rows.map((r) => ({
    slug: r.slug,
    lastModified: r.updatedAt,
  }));
}
