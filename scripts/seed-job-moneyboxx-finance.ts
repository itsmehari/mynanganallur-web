/**
 * Money Boxx Finance Ltd — Branch Manager / RM roles (HL & LAP), Tamil Nadu branches.
 *
 * Dev:  `npm run db:seed:job:moneyboxx-finance`
 * Live: `npm run db:seed:job:moneyboxx-finance:live`
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

const EMPLOYER_SLUG = "moneyboxx-finance-ltd";
const JOB_SLUG = "moneyboxx-finance-hl-lap-branch-rm-tn";

const BODY = `## About Money Boxx Finance Ltd

**Money Boxx Finance Ltd** is hiring for **Home Loan (HL)** and **Loan Against Property (LAP)** sales across multiple branches in **Tamil Nadu**.

## Open roles

1. **Branch Manager**
2. **Senior Relationship Manager**
3. **Relationship Manager**

## Branch locations

- Chennai — **Poonamallee**
- **Kanchipuram**
- **Vellore**
- **Ambur**
- **Coimbatore**
- **Salem**
- **Hosur**
- **Kumbakonam**
- **Trichy**
- **Madurai**
- **Theni**

## Qualification

- **12th** and **degree**

## Who can apply

- **Male candidates only** (as stated by the employer)

## Experience

- **Minimum 6 months** in the same field (HL & LAP / retail lending)

## Joining

**Immediate joiners** are preferable — confirm start date with HR when you apply.

## How to apply

Send your resume:

- **Phone:** [95142 82152](tel:+919514282152)
- **Email:** [Kamalakannang@moneyboxxfinance.com](mailto:Kamalakannang@moneyboxxfinance.com)

---

*Listing sourced from a public hiring post; confirm role, branch, and pay directly with Money Boxx Finance Ltd before you join.*`;

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
        name: "Money Boxx Finance Ltd",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Money Boxx Finance Ltd",
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
      "Branch Manager / Senior Relationship Manager / Relationship Manager (HL & LAP) — Money Boxx Finance Ltd",
    body: BODY,
    locationLabel:
      "Tamil Nadu — Chennai (Poonamallee), Kanchipuram, Vellore, Ambur, Coimbatore, Salem, Hosur, Kumbakonam, Trichy, Madurai, Theni",
    salaryMin: null as number | null,
    salaryMax: null as number | null,
    salaryDisclosed: false,
    remotePolicy: "onsite",
    openingsCount: 3,
    status: "open" as const,
    featured: true,
    contactPhone: "9514282152",
    contactEmail: "Kamalakannang@moneyboxxfinance.com",
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
