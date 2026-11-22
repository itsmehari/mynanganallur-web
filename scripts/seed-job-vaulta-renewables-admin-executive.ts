/**
 * Admin executive — Vaulta Renewables Private Limited, Puzhuthivakkam.
 * Behind Sunshine School. Any industry experience; 2 years preferred.
 * Salary as per market standards. Immediate joining. Call/WhatsApp 9790645829.
 *
 * Dev:  `npm run db:seed:job:vaulta-renewables-admin-executive`
 * Live: `npm run db:seed:job:vaulta-renewables-admin-executive:live`
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

const EMPLOYER_SLUG = "vaulta-renewables";
const EMPLOYER_NAME = "Vaulta Renewables Private Limited";
const JOB_SLUG = "admin-executive-vaulta-renewables-puzhuthivakkam";
const PHONE = "9790645829";
const PHONE_DISPLAY = "97906 45829";

const BODY = `Admin executive wanted at **Vaulta Renewables**, Puzhuthivakkam (behind Sunshine School). Immediate joining. 2 years preferred. Call ${PHONE_DISPLAY}.

**Vaulta Renewables Private Limited** is hiring an **admin executive**. Candidates with experience in **any industry** can apply. At least **2 years** of experience is preferred. Immediate joining.

## Pay

**As per market standards.** No rupee figure was printed in the note. Confirm the offer when you call.

## Location

**Puzhuthivakkam** (printed as **Puzhivatham** in the note), **behind Sunshine School**, Chennai. Confirm the office address when you enquire.

See other [jobs near Nanganallur](/jobs) or the [Nanganallur Connect](/nanganallur-connect) locality hub.

## How to apply

Call or WhatsApp **${PHONE_DISPLAY}**.

[Open WhatsApp to apply](/jobs/${JOB_SLUG}/apply-whatsapp) or use the green **Apply via WhatsApp** button on this page. Say you are applying for the admin executive role at Vaulta Renewables, and that you saw it on MyNanganallur.

Listing compiled from the hiring note. Confirm pay, joining date, and the office location before you join.`;

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
        ilike(jobPostings.body, `%${PHONE}%`),
        ilike(jobPostings.body, `%${PHONE_DISPLAY}%`),
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
        name: EMPLOYER_NAME,
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: EMPLOYER_NAME,
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
    title: "Admin executive — Vaulta Renewables, Puzhuthivakkam",
    body: BODY,
    locationLabel: "Puzhuthivakkam (behind Sunshine School), Chennai",
    salaryMin: null as number | null,
    salaryMax: null as number | null,
    salaryDisclosed: false,
    remotePolicy: "onsite",
    openingsCount: 1,
    status: "open" as const,
    featured: true,
    contactPhone: PHONE,
    expiresAt,
    applyBy: expiresAt,
    submittedByPhone: PHONE,
    moderationNotes:
      "Admin executive; any industry; 2 years preferred; salary as per market standards; immediate joining; Puzhivatham behind Sunshine School",
    faqJson: {
      items: [
        {
          q: "Who is hiring for this admin executive role?",
          a: "Vaulta Renewables Private Limited. Call or WhatsApp 9790645829 to apply.",
        },
        {
          q: "Where is the job located?",
          a: "Puzhuthivakkam, Chennai, behind Sunshine School. The hiring note printed the area as Puzhivatham. Confirm the office address when you enquire.",
        },
        {
          q: "How much experience is required?",
          a: "Candidates with experience in any industry can apply. At least 2 years of experience is preferred, not stated as a hard cutoff.",
        },
        {
          q: "What is the salary?",
          a: "The note says salary will be paid as per market standards. No rupee figure was printed. Confirm the offer with the employer.",
        },
        {
          q: "When can I join?",
          a: "The employer asked for immediate joining.",
        },
        {
          q: "How do I apply?",
          a: "Call or WhatsApp 9790645829 using the buttons on this page.",
        },
      ],
    },
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
