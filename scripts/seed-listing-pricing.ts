/**
 * Idempotently seed default listing_pricing tiers.
 *
 *   npx tsx scripts/seed-listing-pricing.ts            # local
 *   node --env-file=.env.production.local --import tsx scripts/seed-listing-pricing.ts --live
 */
import { config as loadEnv } from "dotenv";
import { and, eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { listingPricing } from "../src/db/schema";
import * as schema from "../src/db/schema";

loadEnv({ path: ".env.production.local" });
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}
const db = drizzle(neon(url), { schema });

const TIERS: Array<{
  entityType: "job" | "event" | "directory" | "property";
  tier: "basic" | "featured30" | "featured90";
  priceInr: number;
  durationDays: number;
  features: string;
}> = [
  { entityType: "job", tier: "basic", priceInr: 0, durationDays: 30, features: "Standard listing" },
  { entityType: "job", tier: "featured30", priceInr: 199, durationDays: 30, features: "Top of /jobs, social share, email blast" },
  { entityType: "event", tier: "basic", priceInr: 0, durationDays: 30, features: "Standard listing" },
  { entityType: "event", tier: "featured30", priceInr: 299, durationDays: 30, features: "Featured on /local-events + home" },
  { entityType: "directory", tier: "basic", priceInr: 0, durationDays: 365, features: "Standard listing" },
  { entityType: "directory", tier: "featured30", priceInr: 499, durationDays: 30, features: "Featured directory placement" },
  { entityType: "directory", tier: "featured90", priceInr: 1199, durationDays: 90, features: "90-day featured directory placement" },
  { entityType: "property", tier: "basic", priceInr: 0, durationDays: 30, features: "Standard listing" },
  { entityType: "property", tier: "featured30", priceInr: 399, durationDays: 30, features: "Featured + WhatsApp share" },
];

async function main() {
  for (const t of TIERS) {
    const [existing] = await db
      .select()
      .from(listingPricing)
      .where(
        and(
          eq(listingPricing.entityType, t.entityType),
          eq(listingPricing.tier, t.tier),
        ),
      )
      .limit(1);
    if (existing) {
      await db
        .update(listingPricing)
        .set({
          priceInr: t.priceInr,
          durationDays: t.durationDays,
          features: t.features,
          active: true,
        })
        .where(eq(listingPricing.id, existing.id));
      console.log(`updated ${t.entityType}/${t.tier}`);
    } else {
      await db.insert(listingPricing).values(t);
      console.log(`inserted ${t.entityType}/${t.tier}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
