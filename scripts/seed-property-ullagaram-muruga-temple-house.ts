/**
 * Published property: independent house with land for sale — Ullagaram, near Muruga temple.
 *
 * Dev:  `npm run db:seed:property:ullagaram-muruga-temple-house`
 * Live: `npm run db:seed:property:ullagaram-muruga-temple-house:live`
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

const SLUG = "sale-independent-house-ullagaram-muruga-temple-nanganallur";

const BODY = `## About this property

**Independent house with land** for sale in **Ullagaram**, near **Muruga temple** (Nanganallur belt).

### Property details

- **Land / plot area:** 1,500 sq ft
- **Built-up area:** 900 sq ft
- **Type:** Independent house with land

## Enquire

- **Call / WhatsApp:** [98405 77956](https://wa.me/919840577956)

## Before you proceed

This listing is **advertiser-submitted**. **Visit in person**, verify title documents (patta, EC, tax receipts), survey boundaries, and building approvals before paying any advance. Do not transfer money to unknown accounts. Execute the sale through proper registered documentation and legal counsel.`;

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

  const publishedAt = new Date("2026-06-12T12:00:00+05:30");

  const values = {
    cityId: city.id,
    slug: SLUG,
    title:
      "Independent house with land for sale — Ullagaram near Muruga temple, Nanganallur",
    summary:
      "1,500 sq ft plot with 900 sq ft built-up independent house near Muruga temple, Ullagaram. Price on enquiry. Call 9840577956.",
    body: BODY,
    kind: "sale" as const,
    status: "published" as const,
    localityLabel: "Ullagaram, Nanganallur, Chennai",
    landmarkNote: "Near Muruga temple",
    rentPerMonth: null as number | null,
    salePrice: null as number | null,
    advanceMonths: null as number | null,
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    areaSqft: 1500,
    floorLabel: null as string | null,
    facing: null as string | null,
    furnishing: "unspecified" as const,
    parkingSummary: null as string | null,
    vegetarianHouseholdOnly: false,
    contactPhone: "9840577956",
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "reader_submitted",
    moderationNotes:
      "Independent house + land — Ullagaram near Muruga temple; 1500 sq ft plot, 900 sq ft built-up",
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
