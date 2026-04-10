/**
 * Sample published property: 2 BHK rent near Guruvayoorappan temple, Nanganallur.
 *
 * Dev:  `npm run db:seed:property:guruvayoorappan`
 * Live: `npm run db:seed:property:guruvayoorappan:live`
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

const SLUG = "rent-independent-house-guruvayoorappan-nanganallur";

const BODY = `## About this home

**Independent house**, **first floor**, **east facing**, about **1,200 sq. ft.**, **2 BHK**, **fully furnished**.

**Landmark:** Near **Guruvayoorappan temple**, Nanganallur.

**Parking:** Covered car park.

## Terms

- **Rent:** Rs. 32,000/month
- **Advance:** Four months (Rs. 1,28,000 at the stated rent — confirm with the owner)
- **Household:** **Pure vegetarian** tenants only (as stated by the advertiser)

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

  const publishedAt = new Date("2026-04-10T12:00:00+05:30");

  const values = {
    cityId: city.id,
    slug: SLUG,
    title:
      "2 BHK independent house for rent near Guruvayoorappan temple, Nanganallur",
    summary:
      "First floor, east facing, ~1,200 sq ft, fully furnished, covered parking. Rs. 32,000/mo, 4 months advance. Vegetarian household. Call 9789848127.",
    body: BODY,
    kind: "rent" as const,
    status: "published" as const,
    localityLabel: "Nanganallur, Chennai",
    landmarkNote: "Near Guruvayoorappan temple",
    rentPerMonth: 32_000,
    salePrice: null as number | null,
    advanceMonths: 4,
    bedrooms: 2,
    bathrooms: null as number | null,
    areaSqft: 1200,
    floorLabel: "First floor",
    facing: "East",
    furnishing: "fully_furnished" as const,
    parkingSummary: "Covered car park",
    vegetarianHouseholdOnly: true,
    contactPhone: "9789848127",
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
