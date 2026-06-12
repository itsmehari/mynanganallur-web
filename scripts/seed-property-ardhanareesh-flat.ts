/**
 * Published property: 3 BHK flat for sale near Ardhanareesh Varar Kovil, Nanganallur.
 * Direct owner listing.
 *
 * Dev:  `npm run db:seed:property:ardhanareesh-flat`
 * Live: `npm run db:seed:property:ardhanareesh-flat:live`
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

const SLUG = "sale-3bhk-ardhanareesh-flat-nanganallur";

const BODY = `## About this property

**3 BHK flat** for sale in **Nanganallur**, near **Ardhanareesh Varar Kovil**.

### Details

- **Construction:** Newly built, 1 year old
- **Floor:** 2nd floor with lift access
- **Built-up area:** 1,305 sq ft
- **UDS (Undivided land share):** 500 sq ft
- **Bedrooms:** 3
- **Parking:** Covered carparking with lift access
- **Facing:** Open

### Amenities

- Lift facility
- Full power backup
- Secure compound
- Covered carparking

## Terms

- **Price:** ₹1.50 Crore (final)
- **Direct seller:** Owner-promoted listing — no broker commission
- **Type of sale:** Ready possession, 1 year old

## Before you proceed

This listing is advertiser-submitted (direct owner). **Visit in person**, verify property documents (title deed, khata, tax receipts), and confirm all details before committing. Do not transfer money to unknown accounts or via informal channels. Always execute property transactions through proper legal channels with registered documents.`;

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

  const publishedAt = new Date("2026-06-01T10:00:00+05:30");

  const values = {
    cityId: city.id,
    slug: SLUG,
    title: "3 BHK flat for sale near Ardhanareesh Varar Kovil, Nanganallur",
    summary:
      "2nd floor, 1,305 sq ft + 500 sq ft UDS, lift, covered parking, power backup. ₹1.50 Cr. Direct owner. Call 9789848127.",
    body: BODY,
    kind: "sale" as const,
    status: "published" as const,
    localityLabel: "Nanganallur, Chennai",
    landmarkNote: "Near Ardhanareesh Varar Kovil",
    rentPerMonth: null as number | null,
    salePrice: 150_000_000,
    advanceMonths: null as number | null,
    bedrooms: 3,
    bathrooms: null as number | null,
    areaSqft: 1305,
    floorLabel: "2nd Floor",
    facing: null as string | null,
    furnishing: "unspecified" as const,
    parkingSummary: "Covered carparking with lift access",
    vegetarianHouseholdOnly: false,
    contactPhone: "9789848127",
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "owner",
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
