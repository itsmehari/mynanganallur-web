/**
 * Madipakkam Cafe — part-time café team member (Madipakkam, Chennai).
 *
 * Dev:  `npm run db:seed:job:madipakkam-cafe`
 * Live: `npm run db:seed:job:madipakkam-cafe:live`
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

const EMPLOYER_SLUG = "madipakkam-cafe";
const JOB_SLUG = "madipakkam-cafe-part-time-team-member";

const BODY = `## Role

Join **Madipakkam Cafe** as a **part-time team member** on the café floor.

## Timings

**5:00 PM – 10:00 PM**

## Pay

Up to **₹10,000/month** (confirm with the employer).

## Who can apply

- **Full training provided**
- **Freshers welcome**

## Location

**Madipakkam**, Chennai.

## Apply

Call or send your CV:

- [+91 81226 64116](tel:+918122664116)
- [+91 94453 23791](tel:+919445323791)

---

*Listing sourced from a public post; confirm role, pay, and shift details directly with Madipakkam Cafe before you join.*`;

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
        name: "Madipakkam Cafe",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Madipakkam Cafe",
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
    title: "Part-time team member — Madipakkam Cafe",
    body: BODY,
    locationLabel: "Madipakkam, Chennai",
    salaryMin: null as number | null,
    salaryMax: 10_000,
    salaryDisclosed: true,
    remotePolicy: "onsite",
    status: "open" as const,
    featured: true,
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
