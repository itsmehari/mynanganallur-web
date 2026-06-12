/**
 * Admin & Accounts / Media Coordinator / Digital Marketing Executive —
 * Madipakkam & Chromepet (work from office).
 *
 * Dev:  `npm run db:seed:job:madipakkam-chromepet-admin-media-marketing`
 * Live: `npm run db:seed:job:madipakkam-chromepet-admin-media-marketing:live`
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

const EMPLOYER_SLUG = "madipakkam-chromepet-employer";
const JOB_SLUG = "admin-media-digital-marketing-madipakkam-chromepet";

const BODY = `## Open roles (three positions)

1. **Admin & Accounts**
   - **Qualification:** Any degree

2. **Media Coordinator**
   - **Qualification:** 10th / +2 / any degree

3. **Digital Marketing Executive**
   - **Qualification:** Any degree with **social media campaign** knowledge

## Work mode

**Work from office** — not remote.

## Locations

- **Madipakkam**, Chennai
- **Chromepet**, Chennai

Confirm which office and reporting address when you call.

## How to apply

Call **[81480 25550](tel:+918148025550)** with your name, the role you want, and your qualification.

---

*Listing sourced from a public hiring post; confirm employer name, pay, and office location directly before you join.*`;

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
        name: "Employer — Madipakkam & Chromepet",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Employer — Madipakkam & Chromepet",
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

  const values = {
    employerId,
    cityId: city.id,
    slug: JOB_SLUG,
    title:
      "Admin & Accounts / Media Coordinator / Digital Marketing Executive — Madipakkam & Chromepet",
    body: BODY,
    locationLabel: "Madipakkam & Chromepet, Chennai",
    salaryMin: null as number | null,
    salaryMax: null as number | null,
    salaryDisclosed: false,
    remotePolicy: "onsite",
    openingsCount: 3,
    status: "open" as const,
    featured: true,
    contactPhone: "8148025550",
  };

  if (existingJob) {
    await db
      .update(jobPostings)
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(eq(jobPostings.id, existingJob.id));
    console.log("Updated job:", JOB_SLUG);
  } else {
    await db.insert(jobPostings).values(values);
    console.log("Inserted job:", JOB_SLUG);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
