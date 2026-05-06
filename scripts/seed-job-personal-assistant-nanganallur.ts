/**
 * Direct hire — Nanganallur focus: Personal Assistant (Part-Time / Flexible).
 *
 * Dev:  `npm run db:seed:job:personal-assistant-nanganallur`
 * Live: `npm run db:seed:job:personal-assistant-nanganallur:live`
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

const EMPLOYER_SLUG = "direct-hire-nanganallur";
const JOB_SLUG = "personal-assistant-part-time-flexible-nanganallur";

const BODY = `## Role overview

We are hiring a **Personal Assistant (Part-Time / Flexible)** for a direct employer with work access from **Nanganallur and nearby Chennai areas**.

The role requires an open-minded and adaptable person who can manage a mix of personal and administrative tasks.

## Key details

- **Role type:** Part-time (about 4 hours/day)
- **Schedule:** Flexible/adjustable timing (to be finalized with employer)
- **Location:** Nanganallur / Chennai (OMR-connected)
- **Salary:** ₹4,000 per month
- **Apply before:** 02 June 2026

## Requirements

- Open-minded, flexible attitude and practical approach
- Good communication in **Tamil and English**
- Basic computer knowledge
- Self-managed and responsible

## Important

- Apply only via **WhatsApp**
- No intermediary or application fee should be paid

## Apply via WhatsApp

Use **[Open WhatsApp to apply](/jobs/personal-assistant-part-time-flexible-nanganallur/apply-whatsapp)** or the green **Apply via WhatsApp** button on this page. Please do not pay any fee to intermediaries.
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
        name: "Direct hire — Nanganallur",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Direct hire — Nanganallur",
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
    title: "Personal Assistant (Part-Time / Flexible) — Nanganallur",
    body: BODY,
    locationLabel: "Nanganallur / Chennai (OMR-connected)",
    salaryMin: 4_000,
    salaryMax: 4_000,
    salaryDisclosed: true,
    remotePolicy: "online, weekly meet",
    status: "open" as const,
    featured: true,
    contactPhone: "7200101497",
    contactEmail: null as string | null,
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
