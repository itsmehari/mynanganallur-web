/**
 * Published property: 3 BHK flat for rent — MMTC Colony, near Lakshmi Narasimhan temple.
 * Direct owner; brokers kindly excuse.
 *
 * Set CONTACT_PHONE before live seed.
 *
 * Dev:  `npm run db:seed:property:mmtc-3bhk-rent`
 * Live: `npm run db:seed:property:mmtc-3bhk-rent:live`
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

/** Owner mobile / WhatsApp (10 digits). Override: PROPERTY_MMTC_CONTACT_PHONE env. */
const CONTACT_PHONE =
  process.env.PROPERTY_MMTC_CONTACT_PHONE?.trim() ??
  process.env.CONTACT_PHONE?.trim() ??
  "";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const db = drizzle(neon(url), { schema });

const SLUG = "rent-3bhk-mmtc-lakshmi-narasimhan-nanganallur";

const BODY = `## About this home

**3 BHK flat for rent** in **MMTC Colony, Nanganallur** — about **two houses from Lakshmi Narasimhan temple**. Steps from the temple.

**Brokers kindly excuse** — direct owner listing.

### Layout & comfort

- **Built-up area:** 1,270 sq ft
- **Floor:** 2nd floor (**no lift** — small building with only **4 flats**)
- Bright **3 BHK** with excellent ventilation and ample natural light
- **Hall** with **balcony**
- **Separate puja room** with woodwork done
- **Kitchen** with **utility area**
- Each **bedroom** has an **attached bathroom**, lofts, covered storage, and large wardrobes

### Parking & handover

- **Covered car parking** — can accommodate a **car and a two-wheeler**
- Flat will be **freshly painted and deep cleaned** before handover

## Terms

- **Rent:** ₹30,000/month
- **Household:** **Pure vegetarian family only** (as stated by the owner)
- **Brokers:** Not entertained — please contact the owner directly

## Before you pay

This listing is **owner-submitted**. **Visit in person**, confirm identity, and read the lease terms. Do not transfer advance or rent to unknown accounts. Verify that painting and deep cleaning are completed as agreed before moving in.`;

/** mynanganallur.in property enquiries (when owner number not supplied). */
const SITE_PROPERTY_ENQUIRIES_PHONE = "7200101497";

function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^91/, "").slice(-10);
}

async function main() {
  let phoneDigits = normalizePhoneDigits(CONTACT_PHONE);
  let usingSiteRelay = false;
  if (phoneDigits.length !== 10 && live) {
    phoneDigits = SITE_PROPERTY_ENQUIRIES_PHONE;
    usingSiteRelay = true;
    console.warn(
      `No owner phone — using mynanganallur enquiries ${phoneDigits}. Set PROPERTY_MMTC_CONTACT_PHONE to override.`,
    );
  }

  const contactPhone = phoneDigits.length === 10 ? phoneDigits : "9000000000";

  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);

  if (!city) {
    console.error("City nanganallur not found — run db:seed first.");
    process.exit(1);
  }

  const publishedAt = new Date("2026-06-02T10:00:00+05:30");

  const phoneSummary =
    phoneDigits.length === 10 ? ` Call ${contactPhone}.` : " Contact phone pending.";

  const body = usingSiteRelay
    ? `${BODY}

## Contact

Call or WhatsApp **mynanganallur** at **72001 01497** and mention this listing — we will connect you with the owner (original ad: DM for details).`
    : BODY;

  const values = {
    cityId: city.id,
    slug: SLUG,
    title:
      "3 BHK flat for rent in MMTC Colony — near Lakshmi Narasimhan temple, Nanganallur",
    summary: `2nd floor (no lift), 1,270 sq ft, hall balcony, puja room, covered parking. ₹30,000/mo. Vegetarian family only. Direct owner — brokers excuse.${phoneSummary}`,
    body,
    kind: "rent" as const,
    status: "published" as const,
    localityLabel: "MMTC Colony, Nanganallur, Chennai",
    landmarkNote: "Two houses from Lakshmi Narasimhan temple",
    rentPerMonth: 30_000,
    salePrice: null as number | null,
    advanceMonths: null as number | null,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1270,
    floorLabel: "2nd floor (no lift)",
    facing: null as string | null,
    furnishing: "unspecified" as const,
    parkingSummary: "Covered parking — car and two-wheeler",
    vegetarianHouseholdOnly: true,
    contactPhone,
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "owner",
    moderationNotes: "Direct owner — brokers kindly excuse; vegetarian household only",
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

  if (phoneDigits.length !== 10) {
    console.warn(
      "CONTACT_PHONE not set — dev seed used placeholder 9000000000. Update and re-run before live.",
    );
  }

  console.log(`URL slug: /properties/${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
