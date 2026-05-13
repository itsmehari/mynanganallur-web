/**
 * SKB Vidhyashram Playschool — Madipakkam: Principal & Teacher (part-time).
 * Source: campus hiring post (May 2026).
 *
 * Dev:  `npm run db:seed:job:skb-vidhyashram-madipakkam`
 * Live: `npm run db:seed:job:skb-vidhyashram-madipakkam:live`
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

const EMPLOYER_SLUG = "skb-vidhyashram-madipakkam";
const JOB_SLUG = "skb-vidhyashram-principal-teacher-part-time-madipakkam";

const BODY = `## About SKB Vidhyashram Playschool (Madipakkam)

**SKB Vidhyashram** focuses on **hands-on learning**, **art-integrated education**, and **safe, nurturing spaces** for young children.

If you care about making a real difference in early education—and can bring fresh ideas and energy—consider joining the Madipakkam team.

## Open roles (two positions)

1. **Principal**
2. **Teacher (part-time)**

## Apply before

**30 May 2026**

## Requirements

- Strong **communication** and **teaching** skills  
- Experience in **activity-based** teaching  
- Confidence and ability to take **initiatives** independently  
- **Creativity** and warmth with children and families

## How to apply

- **Email your CV:** [skbmadipakkam@gmail.com](mailto:skbmadipakkam@gmail.com)  
- **WhatsApp your resume:** use **[Open WhatsApp to apply](/jobs/${JOB_SLUG}/apply-whatsapp)** or the green **Apply via WhatsApp** button on this page (no fee to intermediaries).  
- **Alternate campus line:** [+91 99621 87719](tel:+919962187719)
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
        name: "SKB Vidhyashram Playschool — Madipakkam",
        updatedAt: new Date(),
      })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "SKB Vidhyashram Playschool — Madipakkam",
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
    title: "Principal & Teacher (part-time) — SKB Vidhyashram Playschool, Madipakkam",
    body: BODY,
    locationLabel: "Madipakkam, Chennai",
    salaryMin: null as number | null,
    salaryMax: null as number | null,
    salaryDisclosed: false,
    remotePolicy: "onsite",
    openingsCount: 2,
    status: "open" as const,
    featured: true,
    contactPhone: "6380383563",
    contactEmail: "skbmadipakkam@gmail.com",
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
