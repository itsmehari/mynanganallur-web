/**
 * Idempotent sample employers + open job postings for Nanganallur (dev / live).
 *
 * Dev:  `npm run db:seed:jobs`
 * Live: `npm run db:seed:jobs:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { cities, employers, jobPostings } from "../src/db/schema/tables";

const live =
  process.env.SEED_LIVE === "1" || process.argv.includes("--live");

if (live) {
  loadEnv({ path: ".env.production.local" });
} else {
  loadEnv({ path: ".env.local" });
  loadEnv({ path: ".env" });
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const db = drizzle(neon(url), { schema });

async function main() {
  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);

  if (!city) {
    console.error("City nanganallur not found — run db:seed first.");
    process.exit(1);
  }

  const employerSeeds = [
    {
      slug: "chennai-tech-collective",
      name: "Chennai Tech Collective (sample)",
      websiteUrl: "https://example.com/careers-sample",
    },
    {
      slug: "nanganallur-local-services-sample",
      name: "Nanganallur Local Services (sample)",
      websiteUrl: null as string | null,
    },
  ] as const;

  const employerIds: Record<string, string> = {};

  for (const e of employerSeeds) {
    const [existing] = await db
      .select({ id: employers.id })
      .from(employers)
      .where(eq(employers.slug, e.slug))
      .limit(1);
    if (existing) {
      employerIds[e.slug] = existing.id;
      continue;
    }
    const [ins] = await db
      .insert(employers)
      .values({
        name: e.name,
        slug: e.slug,
        websiteUrl: e.websiteUrl,
      })
      .returning({ id: employers.id });
    employerIds[e.slug] = ins.id;
    console.log("Inserted employer:", e.slug);
  }

  const jobSeeds = [
    {
      slug: "frontend-engineer-omr-sample",
      employerSlug: "chennai-tech-collective",
      title: "Senior frontend engineer (sample listing)",
      body: `## About the role

Sample **open role** for UI work on a product team; many Nanganallur residents commute toward OMR.

## What you will do

- Ship accessible React interfaces
- Work with design and API teams

## Apply

This is a **placeholder** row for mynanganallur.in job board plumbing. Replace with real JDs via admin or seed scripts. Confirm compensation on the employer careers page.`,
      locationLabel: "Chennai / OMR (hybrid)",
      salaryMin: 18_00_000,
      salaryMax: 28_00_000,
      salaryDisclosed: true,
      remotePolicy: "hybrid",
    },
    {
      slug: "field-operations-associate-sample",
      employerSlug: "nanganallur-local-services-sample",
      title: "Field operations associate (sample listing)",
      body: `## Summary

Sample onsite role referencing **Nanganallur** locality for directory and SEO tests.

## Notes

Replace with a verified opening before promoting. Contact details belong in the real employer record.`,
      locationLabel: "Nanganallur, Chennai",
      salaryMin: null as number | null,
      salaryMax: null as number | null,
      salaryDisclosed: false,
      remotePolicy: "onsite",
    },
  ] as const;

  for (const j of jobSeeds) {
    const employerId = employerIds[j.employerSlug];
    const [exists] = await db
      .select({ id: jobPostings.id })
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.cityId, city.id),
          eq(jobPostings.slug, j.slug),
        ),
      )
      .limit(1);
    if (exists) {
      console.log("Job exists:", j.slug);
      continue;
    }
    await db.insert(jobPostings).values({
      employerId,
      cityId: city.id,
      slug: j.slug,
      title: j.title,
      body: j.body,
      locationLabel: j.locationLabel,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      salaryDisclosed: j.salaryDisclosed,
      remotePolicy: j.remotePolicy,
      status: "open",
    });
    console.log("Inserted job:", j.slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
