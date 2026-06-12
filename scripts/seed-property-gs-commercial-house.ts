/**
 * Published property: commercial rent — independent house (GS Properties).
 *
 * Dev:  `npm run db:seed:property:gs-commercial-house`
 * Live: `npm run db:seed:property:gs-commercial-house:live`
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

const SLUG = "rent-commercial-independent-house-meenambakkam-nanganallur";

const BODY = `## About this property

**Independent house for commercial rent** — large floor plate suitable for offices, institution, hostel, or similar commercial use (confirm permitted use with the advertiser and local authorities).

## Location highlights

- Nearer to **Meenambakkam Metro** station
- Close to **suburban railway** station
- **Nearby Chennai airport**
- Adjacent to **A M Jain College**
- **Opposite Defence Quarters**

## Property details

- **22 rooms** including kitchens
- **11 toilets and bathrooms**
- **Spacious parking**
- **24/7 water supply**

## Agent

**GS Properties** — call **73388 86919**.

**Service charge applicable** (as stated by the advertiser).

## Source

Advertiser reference: [Facebook profile](https://www.facebook.com/groups/123024354374603/user/100052050883472/).

## Before you pay

This listing is **advertiser-submitted**. **Visit in person**, confirm identity, permitted use, and lease terms. Do not transfer money to unknown accounts.`;

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

  const publishedAt = new Date("2026-05-23T12:00:00+05:30");

  const values = {
    cityId: city.id,
    slug: SLUG,
    title:
      "Commercial rent — independent house near Meenambakkam metro & airport, Nanganallur",
    summary:
      "22 rooms, 11 baths, spacious parking, 24/7 water. Near metro, suburban rail, airport; opp. Defence Quarters, adj. AM Jain College. GS Properties 7338886919. Service charge applicable.",
    body: BODY,
    kind: "rent" as const,
    status: "published" as const,
    localityLabel: "Near Meenambakkam, Nanganallur, Chennai",
    landmarkNote:
      "Opposite Defence Quarters; adjacent A M Jain College; near Meenambakkam metro & airport",
    rentPerMonth: null as number | null,
    salePrice: null as number | null,
    advanceMonths: null as number | null,
    bedrooms: null as number | null,
    bathrooms: 11,
    areaSqft: null as number | null,
    floorLabel: null as string | null,
    facing: null as string | null,
    furnishing: "unspecified" as const,
    parkingSummary: "Spacious parking",
    vegetarianHouseholdOnly: false,
    contactPhone: "7338886919",
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "reader_submitted",
    moderationNotes: "GS Properties — commercial independent house; service charge applicable",
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
