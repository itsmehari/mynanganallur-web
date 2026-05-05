/**
 * S Manoharan hiring — Accounts candidate (GST/TDS, Zoho preferred).
 *
 * Dev:  `npm run db:seed:job:manoharan-accounts`
 * Live: `npm run db:seed:job:manoharan-accounts:live`
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

const EMPLOYER_SLUG = "s-manoharan";
const JOB_SLUG = "accounts-candidate-gst-tds-zoho-nanganallur";

const BODY = `## Urgent opening

We are hiring an **accounts candidate** with **3-4 years of experience** in:

- **GST filing**
- **TDS filing**

Working experience in **Zoho** will be an added advantage.

## Compensation

- **CTC range:** ₹4.80 - ₹5.50 lakhs per annum
- **Salary and perks:** as per market standards

## Joining

Looking for **immediate joiners**.

## Contact

Please contact:

- **S Manoharan**
- **Phone / WhatsApp:** [+91 63803 51319](tel:+916380351319)
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
        name: "S Manoharan",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "S Manoharan",
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
    title: "Accounts candidate (GST/TDS filing) - Immediate joiners",
    body: BODY,
    locationLabel: "Nanganallur, Chennai",
    salaryMin: 480_000,
    salaryMax: 550_000,
    salaryDisclosed: true,
    remotePolicy: "onsite",
    status: "open" as const,
    featured: true,
    contactPhone: "6380351319",
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
