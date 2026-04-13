/**
 * Beevee's Healthcare / Beevee Medical Store — staff (Nanganallur).
 *
 * Dev:  `npm run db:seed:job:beevee`
 * Live: `npm run db:seed:job:beevee:live`
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

const EMPLOYER_SLUG = "beevees-healthcare";
const JOB_SLUG = "beevees-healthcare-staff-nanganallur";

const BODY = `## About

**Beevee's Healthcare** (**Beevee Medical Store**) is a **medical supply shop** in **Nanganallur, Chennai**. They are hiring **staff** to support day-to-day operations at the store.

## Who can apply

- **Freshers** and **experienced** candidates are welcome
- Customer service mindset and willingness to learn pharmacy / retail medical supplies (confirm exact duties with the employer)

## Joining

**Immediate joining** — confirm date and shift with the contact below.

## Location

**Nanganallur, Chennai** — near local pockets such as Karthikeyapuram, Madura Kali Nagar, and Kuberan Nagar (verify the exact address when you call).

## Apply

- **Phone:** [9791093846](tel:+919791093846)

---

*Listing sourced from a public post; confirm role, pay, and timings directly with Beevee's Healthcare before you join.*`;

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
        name: "Beevee's Healthcare",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Beevee's Healthcare",
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
    title: "Staff — Beevee's Healthcare (medical supply shop)",
    body: BODY,
    locationLabel: "Nanganallur, Chennai",
    salaryMin: null as number | null,
    salaryMax: null as number | null,
    salaryDisclosed: false,
    remotePolicy: "onsite",
    status: "open" as const,
    featured: false,
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
