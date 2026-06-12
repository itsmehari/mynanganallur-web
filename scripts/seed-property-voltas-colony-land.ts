/**
 * Published property: vacant land for sale — Voltas Colony / Balaji Nagar, Nanganallur.
 *
 * Dev:  `npm run db:seed:property:voltas-colony-land`
 * Live: `npm run db:seed:property:voltas-colony-land:live`
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

const SLUG = "sale-vacant-land-voltas-colony-balaji-nagar-nanganallur";

const BODY = `## About this plot

**Vacant land** for sale in **Nanganallur**, near **Voltas Colony**, **Balaji Nagar**.

Suitable for **individual buyers** and **independent house construction**.

### Plot details

- **Land area:** 2,400 sq ft (1 ground)
- **Use:** Residential — independent house construction

## Enquire

- **Call / WhatsApp:** [90424 14777](https://wa.me/919042414777)

## Source

Advertiser reference: [Facebook group post](https://www.facebook.com/groups/123024354374603/?multi_permalinks=27747237224859944).

## Before you proceed

This listing is **advertiser-submitted**. **Visit in person**, verify title documents (patta, EC, tax receipts), survey boundaries, and approvals before paying any advance. Do not transfer money to unknown accounts. Execute the sale through proper registered documentation and legal counsel.`;

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

  const publishedAt = new Date("2026-06-06T12:00:00+05:30");

  const values = {
    cityId: city.id,
    slug: SLUG,
    title:
      "Vacant land for sale — 1 ground near Voltas Colony, Balaji Nagar, Nanganallur",
    summary:
      "2,400 sq ft (1 ground) vacant plot near Voltas Colony, Balaji Nagar. Suitable for independent house construction. Call 9042414777.",
    body: BODY,
    kind: "sale" as const,
    status: "published" as const,
    localityLabel: "Balaji Nagar, Nanganallur, Chennai",
    landmarkNote: "Near Voltas Colony",
    rentPerMonth: null as number | null,
    salePrice: null as number | null,
    advanceMonths: null as number | null,
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    areaSqft: 2400,
    floorLabel: null as string | null,
    facing: null as string | null,
    furnishing: "unspecified" as const,
    parkingSummary: null as string | null,
    vegetarianHouseholdOnly: false,
    contactPhone: "9042414777",
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "reader_submitted",
    moderationNotes:
      "Vacant land — 1 ground near Voltas Colony, Balaji Nagar; Facebook group post",
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
