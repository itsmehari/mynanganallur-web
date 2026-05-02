/**
 * Preschool teacher — Ganesh Nagar, Puzhuthivakkam.
 *
 * Dev:  `npm run db:seed:job:preschool-puzhuthivakkam`
 * Live: `npm run db:seed:job:preschool-puzhuthivakkam:live`
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

const EMPLOYER_SLUG = "preschool-ganesh-nagar-puzhuthivakkam";
const JOB_SLUG = "preschool-teacher-ganesh-nagar-puzhuthivakkam";

const BODY = `## Role

**Preschool teacher** wanted.

## Timings

**9:00 AM – 3:00 PM**

## Location

**#50 Ganesh Nagar Main Road**, **Puzhuthivakkam**, Chennai.

## Apply

- **Phone:** [9940149561](tel:+919940149561) / [9789162480](tel:+919789162480)
`;

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
        name: "Preschool — Ganesh Nagar, Puzhuthivakkam",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Preschool — Ganesh Nagar, Puzhuthivakkam",
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
    title: "Preschool teacher — Puzhuthivakkam",
    body: BODY,
    locationLabel: "Ganesh Nagar, Puzhuthivakkam, Chennai",
    salaryMin: null as number | null,
    salaryMax: null as number | null,
    salaryDisclosed: false,
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
