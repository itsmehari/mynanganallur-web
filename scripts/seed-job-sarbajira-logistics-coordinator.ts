/**
 * Sarbajira — Logistics / Vehicle Tracking Coordinator (Malur & Hosur).
 *
 * Dev:  `npm run db:seed:job:sarbajira-logistics-coordinator`
 * Live: `npm run db:seed:job:sarbajira-logistics-coordinator:live`
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

const EMPLOYER_SLUG = "sarbajira";
const JOB_SLUG = "sarbajira-logistics-vehicle-tracking-coordinator";

const BODY = `## Department

**Logistics / Vehicle Tracking**

## Open role

**Coordinator** — **3 positions**

## Qualification

- **Any degree**

## Experience

- **Freshers to 1 year**
- **1 to 3 years**

## Skills required

- **GPS vehicle tracking**
- **Coordination & follow-up**
- **Tamil** (mandatory)
- **Hindi** (basic)
- **Basic English communication**

## Salary

| Experience | Monthly pay |
| --- | --- |
| 0–1 year | **₹14,000** |
| 1–3 years | **₹20,000** |

## Work locations

- **Malur** (near Narasapura) — **2 positions**
- **Hosur** — **1 position**

## Preference

**Male candidates only** (as stated by the employer).

## How to apply

Send your resume:

- **Email:** [hr@sarbajira.com](mailto:hr@sarbajira.com)
- **Phone:** [90430 20699](tel:+919043020699)

---

*Listing sourced from a public hiring post; confirm role, location, and pay directly with Sarbajira before you join.*`;

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
        name: "Sarbajira",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Sarbajira",
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
      "Logistics / Vehicle Tracking Coordinator — Sarbajira (Malur & Hosur)",
    body: BODY,
    locationLabel: "Malur (near Narasapura) & Hosur, Karnataka",
    salaryMin: 14_000,
    salaryMax: 20_000,
    salaryDisclosed: true,
    remotePolicy: "onsite",
    openingsCount: 3,
    status: "open" as const,
    featured: true,
    contactPhone: "9043020699",
    contactEmail: "hr@sarbajira.com",
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
