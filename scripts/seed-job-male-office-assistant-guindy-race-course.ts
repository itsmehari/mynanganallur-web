/**
 * Male office assistant — Guindy Race Course, Chennai.
 * Same note as MyChennaiCity:
 * https://mychennaicity.in/chennai-jobs/male-office-assistant-guindy-race-course
 * Individual employer; no company name; Tamil + Hindi or Tamil + Telugu;
 * 6 hours a day; ₹15,000 per month; 76710 65348.
 *
 * Dev:  `npm run db:seed:job:male-office-assistant-guindy-race-course`
 * Live: `npm run db:seed:job:male-office-assistant-guindy-race-course:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq, ilike, or } from "drizzle-orm";
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

const EMPLOYER_SLUG = "individual-employer-guindy-race-course";
const JOB_SLUG = "male-office-assistant-guindy-race-course";
const PHONE = "7671065348";
const PHONE_DISPLAY = "76710 65348";
const SISTER =
  "https://mychennaicity.in/chennai-jobs/male-office-assistant-guindy-race-course";

const BODY = `## Role

An **individual employer** at **Guindy Race Course, Chennai** is hiring a **male office assistant**. No company name was given.

The same note is on [MyChennaiCity](${SISTER}).

## Who can apply

Male, as stated by the employer.

## Languages

**Tamil and Hindi**, or **Tamil and Telugu**.

## Hours

**6 hours a day.** The note does not give a start time or say whether the hours are morning or evening.

## Pay

**₹15,000 per month.**

## Location

**Guindy Race Course**, Chennai. No door number was given.

## How to apply

WhatsApp **${PHONE_DISPLAY}**.

[Open WhatsApp to apply](/jobs/${JOB_SLUG}/apply-whatsapp) or use the green **Apply via WhatsApp** button on this page. Say you are applying for the male office assistant role at Guindy Race Course, and that you saw it on MyNanganallur.

Listing compiled from the hiring note. Confirm the workplace, hours, and pay with the employer before you join.`;

async function main() {
  const matches = await db
    .select({
      slug: jobPostings.slug,
      title: jobPostings.title,
      status: jobPostings.status,
    })
    .from(jobPostings)
    .where(
      or(
        ilike(jobPostings.body, "%7671065348%"),
        ilike(jobPostings.body, "%76710 65348%"),
        eq(jobPostings.contactPhone, PHONE),
      ),
    );

  const other = matches.filter((row) => row.slug !== JOB_SLUG);
  if (other.length > 0) {
    console.log("Duplicate already live. Skipping.");
    for (const row of other) {
      console.log(`- ${row.status} /jobs/${row.slug} — ${row.title}`);
    }
    process.exit(0);
  }

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
        name: "Individual employer, Guindy Race Course",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Individual employer, Guindy Race Course",
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
  // 30 days from 1 Nov 2026. Last moment of 1 Dec 2026 IST.
  const expiresAt = new Date("2026-12-01T23:59:59+05:30");
  const stillOpen = expiresAt.getTime() > now.getTime();

  const values = {
    employerId,
    cityId: city.id,
    slug: JOB_SLUG,
    title: "Male office assistant — Guindy Race Course, Chennai",
    body: BODY,
    locationLabel: "Guindy Race Course, Chennai",
    salaryMin: 15_000,
    salaryMax: 15_000,
    salaryDisclosed: true,
    remotePolicy: "onsite",
    openingsCount: 1,
    status: (stillOpen ? "open" : "closed") as "open" | "closed",
    featured: stillOpen,
    featuredUntil: expiresAt,
    contactPhone: PHONE,
    expiresAt,
    applyBy: expiresAt,
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
