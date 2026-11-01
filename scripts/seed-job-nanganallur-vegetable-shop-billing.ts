/**
 * Nanganallur vegetable shop — billing staff.
 * Source note (27 Oct 2026): male or female; full-time and part-time;
 * timings around 7:30 AM–1:30 PM and 4:30 PM–9:30 PM; salary around
 * 15k to 25k; age below 40; shop name and street unstated;
 * WhatsApp 9789943459.
 * Same note on https://mychennaicity.in/chennai-jobs/nanganallur-vegetable-shop-sales-billing
 *
 * Dev:  `npm run db:seed:job:nanganallur-vegetable-shop-billing`
 * Live: `npm run db:seed:job:nanganallur-vegetable-shop-billing:live`
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

const EMPLOYER_SLUG = "nanganallur-vegetable-shop";
const JOB_SLUG = "nanganallur-vegetable-shop-sales-billing";
const PHONE = "9789943459";
const SISTER =
  "https://mychennaicity.in/chennai-jobs/nanganallur-vegetable-shop-sales-billing";

const BODY = `## Role

A **vegetable shop in Nanganallur** is hiring **billing staff**. The note says **male or female** applicants can apply. The shop’s name and street were not given.

The same note is on [MyChennaiCity](${SISTER}).

## Employment type

**Full-time** and **part-time** are both open. The note does not say which window is full-time and which is part-time.

## Timings

Around **7:30 AM – 1:30 PM**, and around **4:30 PM – 9:30 PM**. Confirm the exact hours with the shop.

## Pay

Around **₹15,000 – ₹25,000**. The note does not print “per month”. Confirm the pay period, and whether full-time and part-time pay differ, before you join.

## Who can apply

Male or female. Age below 40, as printed in the note.

## Location

**Nanganallur**, Chennai. No door number was printed.

## How to apply

WhatsApp **97899 43459**.

[Open WhatsApp to apply](/jobs/${JOB_SLUG}/apply-whatsapp) or use the green **Apply via WhatsApp** button on this page. Say you are applying for billing at the vegetable shop.

Listing compiled from the hiring note. Confirm shop name, pay, and shift details with the employer before you join.`;

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
        name: "Vegetable shop — Nanganallur",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Vegetable shop — Nanganallur",
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

  const values = {
    employerId,
    cityId: city.id,
    slug: JOB_SLUG,
    title: "Billing staff — vegetable shop (Nanganallur)",
    body: BODY,
    locationLabel: "Nanganallur, Chennai",
    salaryMin: 15_000,
    salaryMax: 25_000,
    salaryDisclosed: true,
    remotePolicy: "onsite",
    openingsCount: 1,
    status: "open" as const,
    featured: true,
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
