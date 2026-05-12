/**
 * Published property: shop space for rent in Thillai Ganga Nagar, Nanganallur.
 *
 * Dev:  `npm run db:seed:property:thillai-ganga-shop`
 * Live: `npm run db:seed:property:thillai-ganga-shop:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { cities, propertyListings } from "../src/db/schema/tables";

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

const SLUG = "rent-shop-thillai-ganga-nagar-nanganallur";

const BODY = `## About this space

**Shop space for rent** in **Thillai Ganga Nagar**, Nanganallur — about **90 sq. ft.**

## Terms

- **Rent:** Rs. 9,000/month
- **Deposit:** Rs. 1,00,000 (confirm with the advertiser)

## Before you pay

This listing is **advertiser-submitted**. **Visit in person**, confirm identity, and read the lease terms. Do not transfer money to unknown accounts.`;

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

  const publishedAt = new Date("2026-05-12T12:00:00+05:30");

  const values = {
    cityId: city.id,
    slug: SLUG,
    title: "Shop space for rent in Thillai Ganga Nagar, Nanganallur",
    summary:
      "90 sq ft shop space in Thillai Ganga Nagar. Rs. 9,000/mo, Rs. 1,00,000 deposit. Call 8072254998.",
    body: BODY,
    kind: "rent" as const,
    status: "published" as const,
    localityLabel: "Thillai Ganga Nagar, Nanganallur, Chennai",
    landmarkNote: null as string | null,
    rentPerMonth: 9_000,
    salePrice: null as number | null,
    advanceMonths: null as number | null,
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    areaSqft: 90,
    floorLabel: null as string | null,
    facing: null as string | null,
    furnishing: "unspecified" as const,
    parkingSummary: null as string | null,
    vegetarianHouseholdOnly: false,
    contactPhone: "8072254998",
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "reader_submitted",
  };

  const [existing] = await db
    .select({ id: propertyListings.id })
    .from(propertyListings)
    .where(
      and(eq(propertyListings.cityId, city.id), eq(propertyListings.slug, SLUG)),
    )
    .limit(1);

  if (existing) {
    await db
      .update(propertyListings)
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(eq(propertyListings.id, existing.id));
    console.log("Updated property:", SLUG);
  } else {
    await db.insert(propertyListings).values(values);
    console.log("Inserted property:", SLUG);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
