/**
 * Published property: 2.5 BHK flat for resale — Madipakkam, Chennai.
 * Direct owner listing.
 *
 * Dev:  `npm run db:seed:property:madipakkam-2-5bhk-flat`
 * Live: `npm run db:seed:property:madipakkam-2-5bhk-flat:live`
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

const SLUG = "sale-2-5bhk-east-facing-flat-madipakkam";

const BODY = `## About this property

**2.5 BHK flat** for resale in **Madipakkam**, Chennai — prime residential location. **Direct owner sale** (no brokers).

### Property details

- **Built-up area:** 989 sq ft
- **UDS (Undivided land share):** 545 sq ft — more than 50% UDS
- **Configuration:** 2 bedrooms + dining hall
- **Facing:** East
- **Floor:** 2nd floor
- **Parking:** Covered car parking
- **Building age:** 13 years

### Location highlights

- **400 m** to upcoming metro station
- **3 km** to Chennai One IT Park
- **3 km** to Kauvery Hospital
- **6 km** to OMR
- **2 km** to Velachery Railway Station
- Schools, shops and markets nearby

### Why consider this property

- More than 50% UDS — high land value
- Excellent connectivity to OMR and IT corridors
- Ideal for families and investment
- Spacious layout with good ventilation

## Enquire

- **Call / WhatsApp:** [98407 57356](https://wa.me/919840757356)

*Direct owner — brokers please do not contact.*

## Before you proceed

This listing is **advertiser-submitted** (direct owner). **Visit in person**, verify property documents (title deed, khata, tax receipts), and confirm all details before committing. Do not transfer money to unknown accounts or via informal channels. Always execute property transactions through proper legal channels with registered documents.`;

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

  const publishedAt = new Date("2026-06-16T12:00:00+05:30");

  const values = {
    cityId: city.id,
    slug: SLUG,
    title: "2.5 BHK flat for resale — Madipakkam, Chennai (direct owner)",
    summary:
      "989 sq ft + 545 sq ft UDS, east-facing, 2nd floor, covered parking. Prime Madipakkam location near upcoming metro. Price on enquiry. Call 9840757356.",
    body: BODY,
    kind: "sale" as const,
    status: "published" as const,
    localityLabel: "Madipakkam, Chennai",
    landmarkNote: "400 m to upcoming metro station",
    rentPerMonth: null as number | null,
    salePrice: null as number | null,
    advanceMonths: null as number | null,
    bedrooms: 2,
    bathrooms: null as number | null,
    areaSqft: 989,
    floorLabel: "2nd Floor",
    facing: "East",
    furnishing: "unspecified" as const,
    parkingSummary: "Covered car parking",
    vegetarianHouseholdOnly: false,
    contactPhone: "9840757356",
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
