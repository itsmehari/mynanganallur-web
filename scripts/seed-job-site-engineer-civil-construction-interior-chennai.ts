/**
 * Site Engineer — Civil (construction & interior projects, Chennai).
 * Same note as MyChennaiCity:
 * https://mychennaicity.in/chennai-jobs/site-engineer-civil-construction-interior-chennai
 *
 * Dev:  `npm run db:seed:job:site-engineer-civil-construction-interior-chennai`
 * Live: `npm run db:seed:job:site-engineer-civil-construction-interior-chennai:live`
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

const EMPLOYER_SLUG = "chennai-construction-interior-employer";
const JOB_SLUG = "site-engineer-civil-construction-interior-chennai";
const EMAIL = "harimeetme@gmail.com";
const SISTER =
  "https://mychennaicity.in/chennai-jobs/site-engineer-civil-construction-interior-chennai";

const BODY = `## Role

An employer in **Chennai** is hiring an experienced **Site Engineer — Civil** for **construction and interior projects**. The company name and site street were not given.

The same note is on [MyChennaiCity](${SISTER}).

## Experience

**4–5 years** minimum (the note also says **4–5+ years**).

## Qualification

- Diploma or **B.E.** in Civil Engineering

## Skills

- Construction and interior project experience
- Site execution, supervision, measurements, and quality control
- Coordinating contractors, workers, and project teams
- Communication and site-management skills

## Location

**Chennai** (no area printed).

## Pay

Not stated in the note.

## Preference

Immediate joiners and candidates with relevant site experience preferred.

## Apply

Email your updated CV with contact details to **[${EMAIL}](mailto:${EMAIL}?subject=${encodeURIComponent(
  "Application — Site Engineer (Civil), Chennai",
)})**.

Mention that you saw the listing on MyNanganallur.

Listing compiled from the hiring note. Confirm company, pay, and work site before you join.`;

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

  let employerId: string;
  const [existingEmployer] = await db
    .select({ id: employers.id })
    .from(employers)
    .where(eq(employers.slug, EMPLOYER_SLUG))
    .limit(1);

  if (existingEmployer) {
    employerId = existingEmployer.id;
    await db
      .update(employers)
      .set({
        name: "Construction & interior employer, Chennai",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Construction & interior employer, Chennai",
        slug: EMPLOYER_SLUG,
        websiteUrl: null,
      })
      .returning({ id: employers.id });
    employerId = ins.id;
    console.log("Inserted employer:", EMPLOYER_SLUG);
  }

  const [existingJob] = await db
    .select({ id: jobPostings.id })
    .from(jobPostings)
    .where(
      and(eq(jobPostings.cityId, city.id), eq(jobPostings.slug, JOB_SLUG)),
    )
    .limit(1);

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 90);
  const applyBy = new Date(now);
  applyBy.setDate(applyBy.getDate() + 90);

  const values = {
    employerId,
    cityId: city.id,
    slug: JOB_SLUG,
    title: "Site Engineer — Civil (construction & interior), Chennai",
    body: BODY,
    locationLabel: "Chennai",
    salaryDisclosed: false,
    remotePolicy: "onsite",
    openingsCount: 1,
    status: "open" as const,
    featured: false,
    contactEmail: EMAIL,
    expiresAt,
    applyBy,
    updatedAt: now,
  };

  if (existingJob) {
    await db
      .update(jobPostings)
      .set(values)
      .where(eq(jobPostings.id, existingJob.id));
    console.log("Updated job:", JOB_SLUG);
  } else {
    await db.insert(jobPostings).values({
      ...values,
      publishedAt: now,
    });
    console.log("Inserted job:", JOB_SLUG);
  }

  console.log("Public URL:", `https://mynanganallur.in/jobs/${JOB_SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
