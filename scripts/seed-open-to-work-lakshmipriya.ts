/**
 * Seed Lakshmipriya — MBA Finance, banking & IB operations (Open to Work).
 *
 * Dev:  `npm run db:seed:open-to-work:lakshmipriya`
 * Live: `npm run db:seed:open-to-work:lakshmipriya:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { cities, openToWorkProfiles } from "../src/db/schema/tables";

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

const PROFILE_SLUG = "lakshmipriya-mba-finance-banking-operations";

const FB_POST_URL =
  "https://www.facebook.com/groups/123024354374603/?multi_permalinks=27954806877436310";
const FB_PERSON_URL =
  "https://www.facebook.com/groups/123024354374603/user/100000105138489/";

const BODY = `I am an **MBA (Finance)** graduate with a **B.Com** degree and over **10 years of experience** in retail banking and investment banking operations.

I am currently looking for job opportunities in **Bangalore**, **Coimbatore**, **Chennai**, or **remote/hybrid** roles.

After a recent career transition, I am actively searching for the right opportunity. I am a single parent with a young child, and supporting my family is my top priority.

If anyone in your network knows of openings or can provide a referral, I would be truly grateful. Even a small lead can make a big difference at this stage.

Please feel free to connect if you would like to review my resume or discuss suitable opportunities in banking, finance, or financial services operations.

**Connect on Facebook:** [Message Lakshmipriya on Facebook](${FB_PERSON_URL}) · [Original community post](${FB_POST_URL})`;

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

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90);

  const values = {
    cityId: city.id,
    slug: PROFILE_SLUG,
    displayName: "Lakshmipriya",
    headline: "MBA (Finance) · 10+ yrs Banking & IB Operations",
    body: BODY,
    domainsLabel: "Banking, Finance, Investment banking operations",
    preferredLocations: "Bangalore, Coimbatore, Chennai, Remote/Hybrid",
    workModePreferences: "remote,hybrid,onsite",
    yearsExperience: 10,
    contactEmail: null as string | null,
    contactPhone: null as string | null,
    linkedInUrl: null as string | null,
    facebookUrl: FB_PERSON_URL,
    sourcePostUrl: FB_POST_URL,
    resumeUrl: null as string | null,
    status: "open" as const,
    featured: true,
    publishedAt: new Date(),
    expiresAt,
    source: "admin" as const,
  };

  const [existing] = await db
    .select({ id: openToWorkProfiles.id })
    .from(openToWorkProfiles)
    .where(
      and(
        eq(openToWorkProfiles.cityId, city.id),
        eq(openToWorkProfiles.slug, PROFILE_SLUG),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .update(openToWorkProfiles)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(openToWorkProfiles.id, existing.id));
    console.log("Updated Open to Work profile:", PROFILE_SLUG);
  } else {
    await db.insert(openToWorkProfiles).values(values);
    console.log("Inserted Open to Work profile:", PROFILE_SLUG);
  }

  console.log("Facebook person:", FB_PERSON_URL);
  console.log("Facebook post:", FB_POST_URL);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
