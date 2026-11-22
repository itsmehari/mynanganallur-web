/**
 * Pulikachal.com — finance, billing, and sales roles (Nanganallur).
 * Six openings. Age below 45. Resume via the contact published on pulikachal.com.
 *
 * Dev:  `npm run db:seed:job:pulikachal`
 * Live: `npm run db:seed:job:pulikachal:live`
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

const EMPLOYER_SLUG = "pulikachal";
const EMPLOYER_NAME = "Pulikachal.com";
const JOB_SLUG = "pulikachal-finance-billing-sales-nanganallur";
const WEBSITE = "https://www.pulikachal.com";
const EMAIL = "contactus@pulikachal.com";
const PHONE = "9150152751";
const PHONE_DISPLAY = "91501 52751";

const BODY = `**Pulikachal.com** (PULIKACHAL DOTTKOM PRIVATE LIMITED) is hiring in **Nanganallur, Chennai**. The brand makes authentic South Indian traditional foods — rice pastes, thokku, pickles, podi, vadam, and sweets — and is expanding.

## Open roles (6)

**Finance & Accounts**

- **Senior Accountant** — 1
- **Junior Accountant** — 1
- **Procurement & Inventory Management** — 1

**Billing & Store Operations** — 2

**Sales & Marketing Lead** — 1

## Who can apply

Candidates **below 45 years**. Pay was not stated. Confirm the role, salary, and shift with the employer before you join.

## Location

**Nanganallur, Chennai.** The company store is **Sri Narayanan Stores**, New No. 34, 2nd Main Road, Nanganallur, Chennai 600061 (opposite Anjaneya Driving School and Sathya Sai Baba Samithi, next to the Raghavendra Arch towards the Nanganallur Anjaneyar Temple). Confirm which seat is at this store.

See other [jobs near Nanganallur](/jobs) or the [Nanganallur Connect](/nanganallur-connect) locality hub.

## How to apply

The hiring note asked candidates to **share a resume**. Send it to **[${EMAIL}](mailto:${EMAIL})**. You can also call or WhatsApp the Nanganallur store on **${PHONE_DISPLAY}**.

[Open WhatsApp to apply](/jobs/${JOB_SLUG}/apply-whatsapp) or use the green **Apply via WhatsApp** button on this page. Name the role you want, and say you saw the opening on MyNanganallur.

These contact details are the ones published on [pulikachal.com](${WEBSITE}). The hiring note itself did not print a phone number or email.`;

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
        ilike(jobPostings.title, "%pulikachal%"),
        ilike(jobPostings.body, "%pulikachal.com%"),
        eq(jobPostings.slug, JOB_SLUG),
      ),
    );

  const other = matches.filter((row) => row.slug !== JOB_SLUG);
  if (other.length > 0) {
    console.log("Another Pulikachal listing is already live. Skipping.");
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
        websiteUrl: WEBSITE,
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: EMPLOYER_NAME,
        slug: EMPLOYER_SLUG,
        websiteUrl: WEBSITE,
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
    title:
      "Finance, billing, and sales roles — Pulikachal.com, Nanganallur",
    body: BODY,
    locationLabel: "Nanganallur, Chennai",
    salaryMin: null as number | null,
    salaryMax: null as number | null,
    salaryDisclosed: false,
    remotePolicy: "onsite",
    openingsCount: 6,
    status: "open" as const,
    featured: true,
    contactPhone: PHONE,
    contactEmail: EMAIL,
    expiresAt,
    applyBy: expiresAt,
    moderationNotes:
      "Pulikachal.com hiring note Nov 2026: senior accountant 1, junior accountant 1, procurement & inventory 1, billing & store 2, sales & marketing lead 1. Age below 45. Resume channel is the public site contact, not printed on the note.",
    faqJson: {
      items: [
        {
          q: "Who is hiring?",
          a: "Pulikachal.com (PULIKACHAL DOTTKOM PRIVATE LIMITED), a South Indian traditional food brand based in Nanganallur, Chennai.",
        },
        {
          q: "Which roles are open?",
          a: "Senior Accountant (1), Junior Accountant (1), Procurement and Inventory Management (1), Billing and Store Operations (2), and Sales and Marketing Lead (1). Six seats in all.",
        },
        {
          q: "Who can apply?",
          a: "Candidates below 45 years. Experience level and salary were not stated. Confirm both with the employer.",
        },
        {
          q: "Where is the job?",
          a: "Nanganallur, Chennai. The company store is Sri Narayanan Stores, New No. 34, 2nd Main Road, Nanganallur 600061. Confirm which seat is based at the store.",
        },
        {
          q: "How do I apply?",
          a: "Email your resume to contactus@pulikachal.com, or call or WhatsApp 9150152751. Those contacts are published on pulikachal.com. The hiring note did not print a phone or email.",
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
