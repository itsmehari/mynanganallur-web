/**
 * Nanganallur vegetable shop — sales / billing staff (POS billing).
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

const BODY = `## Role

A **vegetable shop in Nanganallur** is hiring **sales / billing staff** to handle **shop billing on the billing system** (POS).

## Employment type

- **Part-time** or **full-time** — both are fine

## Shift options

Choose one shift (confirm exact hours with the employer):

- **Morning:** 7:00 AM – 2:00 PM
- **Evening:** 2:00 PM – 9:00 PM

## Pay

Around **₹15,000 – ₹24,000/month** depending on role, hours, and experience (confirm when you apply).

## Location

**Nanganallur**, Chennai.

## How to apply

Interested candidates can **WhatsApp** the shop on **[97899 43459](tel:+919789943459)** with your name, preferred shift, and availability.

---

*Listing sourced from a public hiring post; confirm shop name, pay, and shift details directly with the employer before you join.*`;

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

  const values = {
    employerId,
    cityId: city.id,
    slug: JOB_SLUG,
    title: "Sales / billing staff — vegetable shop (Nanganallur)",
    body: BODY,
    locationLabel: "Nanganallur, Chennai",
    salaryMin: 15_000,
    salaryMax: 24_000,
    salaryDisclosed: true,
    remotePolicy: "onsite",
    openingsCount: 2,
    status: "open" as const,
    featured: true,
    contactPhone: "9789943459",
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
