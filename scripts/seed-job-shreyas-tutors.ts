/**
 * Shreyas School of Education — CBSE Math & Science tutors (Nanganallur).
 *
 * Dev:  `npm run db:seed:job:shreyas`
 * Live: `npm run db:seed:job:shreyas:live`
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

const EMPLOYER_SLUG = "shreyas-school-of-education";
const JOB_SLUG = "shreyas-tutors-math-science-nanganallur";

const BODY = `## About

**Shreyas School of Education** — premium **CBSE** coaching (**Grades 6–12**) in **Nanganallur, Chennai**. We are hiring passionate teachers for **Mathematics** and **Science** (Physics, Chemistry, Biology).

## Subjects

- **Mathematics** — Classes 6–12
- **Science** — Physics, Chemistry, Biology — Classes 6–12

## Work schedule

**Monday–Saturday**, evening batch: **5:00 PM – 8:00 PM** (may extend to **8:30 PM**). Teachers should be available for the **full** time slot and handle **multiple grades**.

### Class timings

- **Classes 6–8:** 5:00 – 6:00 PM
- **Class 9:** 6:00 – 7:00 PM
- **Class 10:** 7:00 – 8:00 PM
- **Classes 11 & 12:**
  - Physics / Chemistry: 6:00 – 7:00 PM
  - Maths / Biology: 7:00 – 8:00 PM

## Eligibility

- Graduate or postgraduate in **Science**, **Engineering**, or **Mathematics**
- Strong subject knowledge and communication skills
- Passion for teaching and mentoring students

## Compensation

- **Starting (startup phase):** ₹8,000 – ₹15,000/month
- **Growth:** ₹20,000 – ₹40,000+ based on student strength and performance
- Flexible structure (e.g. fixed + per-student incentive) can be discussed

## Why join us

- Growing institute with expanding admissions
- Opportunity to grow with the organization
- Friendly, supportive work environment
- Long-term career potential

## Apply

- **Phone / WhatsApp:** 9176073434 / 9176093434
- **Email:** [shreyasschoolofeducation@gmail.com](mailto:shreyasschoolofeducation@gmail.com)
- **WhatsApp community:** [Join the group](https://chat.whatsapp.com/GIL8LIqKTLxJ0SBLbqX6NE)
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
        name: "Shreyas School of Education",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "Shreyas School of Education",
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
    title: "Tutors — Mathematics & Science (CBSE, Grades 6–12)",
    body: BODY,
    locationLabel: "Nanganallur, Chennai",
    salaryMin: 8_000,
    salaryMax: 15_000,
    salaryDisclosed: true,
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
