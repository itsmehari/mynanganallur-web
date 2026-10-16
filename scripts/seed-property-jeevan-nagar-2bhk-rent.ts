/**
 * Published property: 2 BHK flat for rent — Jeevan Nagar Main Road, Adambakkam.
 * Close to Thillai Ganga Nagar; corner flat, semi-furnished.
 *
 * Dev:  `npm run db:seed:property:jeevan-nagar-2bhk-rent`
 * Live: `npm run db:seed:property:jeevan-nagar-2bhk-rent:live`
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

const SLUG = "rent-2bhk-jeevan-nagar-adambakkam";

const BODY = `## About this home

**2 BHK flat for rent** on **Jeevan Nagar Main Road, Adambakkam** — close to **Thillai Ganga Nagar**. A well-maintained, spacious hall in a **corner flat** with ample natural light and breeze. **Semi-furnished.**

### Layout & comfort

- **Built-up area:** 1,000 sq ft
- **Floor:** 1st floor
- **Configuration:** 2 BHK with spacious hall
- **Balcony:** 1
- **Toilets:** 2
- **Corner flat** — good ventilation and daylight

### Parking & building

- **1 covered car parking**
- **Lift facility**
- **CCTV security**
- **Generator backup**
- All lights, fans and fixtures included
- **2 water heaters**

### Location highlights

- Very close to the **100 Feet Road (Alandur to Velachery)** corridor
- Prime **Jeevan Nagar, Adambakkam** address with easy access to schools, shops, and daily essentials
- Near **Thillai Ganga Nagar**

## Terms

- **Rent:** ₹28,000/month

## Enquire

- **Contact:** Maha VS — [99448 96693](https://wa.me/919944896693)

## Before you pay

This listing is **advertiser-submitted**. **Visit in person**, confirm identity, and read the lease terms. Do not transfer advance or rent to unknown accounts. Verify fixtures, parking, and building amenities before moving in.`;

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

  const publishedAt = new Date("2026-06-22T12:00:00+05:30");

  const values = {
    cityId: city.id,
    slug: SLUG,
    title:
      "2 BHK flat for rent in Jeevan Nagar Main Road, Adambakkam — near Thillai Ganga Nagar",
    summary:
      "1st floor corner flat, 1,000 sq ft, semi-furnished, 1 balcony, 2 toilets, covered car parking, lift & generator. ₹28,000/mo. Call Maha VS 9944896693.",
    body: BODY,
    kind: "rent" as const,
    status: "published" as const,
    localityLabel: "Jeevan Nagar Main Road, Adambakkam, Chennai",
    landmarkNote: "Close to Thillai Ganga Nagar; near 100 Feet Road (Alandur–Velachery)",
    rentPerMonth: 28_000,
    salePrice: null as number | null,
    advanceMonths: null as number | null,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1000,
    floorLabel: "1st Floor",
    facing: null as string | null,
    furnishing: "semi_furnished" as const,
    parkingSummary: "1 covered car parking",
    vegetarianHouseholdOnly: false,
    contactPhone: "9944896693",
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "reader_submitted",
    submittedByName: "Maha VS",
    submittedByPhone: "9944896693",
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

  console.log(`URL slug: /properties/${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
