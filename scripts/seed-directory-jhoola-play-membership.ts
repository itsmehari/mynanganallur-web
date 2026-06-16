/**
 * Jhoola Activity Centre — Play Membership (from 1 July 2026).
 *
 * Dev:  `npm run db:seed:directory:jhoola-play-membership`
 * Live: `npm run db:seed:directory:jhoola-play-membership:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { cities, directoryEntries } from "../src/db/schema/tables";

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
  console.error(
    live
      ? "Live: DATABASE_URL missing. Add to .env.production.local."
      : "DATABASE_URL missing — add to .env.local",
  );
  process.exit(1);
}

if (live) {
  const hostMatch = url.match(/@([^/?]+)/);
  console.log(
    "[seed-directory-jhoola] Live target DB host:",
    hostMatch?.[1] ?? "(unparsed)",
  );
}

const db = drizzle(neon(url), { schema });

const TYPE = "industry" as const;
const SLUG = "jhoola-play-membership-nanganallur";

const faqJson = {
  items: [
    {
      q: "What is Jhoola Play Membership?",
      a: "A screen-free space where children choose freely from books, board games, art, craft, and open-ended play materials. Membership opens from 1 July 2026 at Jhoola Activity Centre, Nanganallur.",
    },
    {
      q: "What makes it different from a regular activity class?",
      a: "No agenda, no instruction, and no fixed activity — just a bunch of children figuring things out together. A warm adult from the Jhoola team is present at all times so parents can step away without anxiety.",
    },
    {
      q: "How do members coordinate play times?",
      a: "Members get access to a members-only WhatsApp group to coordinate play times — know who else is coming before you arrive.",
    },
    {
      q: "How do I track my membership balance?",
      a: "A simple online link lets you track your balance anytime, hassle-free.",
    },
    {
      q: "Can my child's friends visit if they are not members?",
      a: "Yes — a flexible drop-in option is available for your child's friends who are not members, because play is better with the people you already know.",
    },
    {
      q: "What membership options are available?",
      a: "Two membership tiers to suit your family's schedule and budget. Early bird offers are available — contact Jhoola for current pricing and tier details.",
    },
    {
      q: "How do I enquire or sign up?",
      a: "Call or WhatsApp 91765 83618. Visit jhoola.co for more about the centre. Confirm timings, tiers, and early bird offers directly before enrolling.",
    },
  ],
};

async function main() {
  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);

  if (!city) {
    console.error("City slug 'nanganallur' not found. Seed cities first.");
    process.exit(1);
  }

  const [existing] = await db
    .select({ id: directoryEntries.id })
    .from(directoryEntries)
    .where(
      and(
        eq(directoryEntries.cityId, city.id),
        eq(directoryEntries.type, TYPE),
        eq(directoryEntries.slug, SLUG),
      ),
    )
    .limit(1);

  const row = {
    cityId: city.id,
    type: TYPE,
    name: "Jhoola Play Membership",
    slug: SLUG,
    address:
      "Plot No. 7 & 8, Flat No. S2, Second Floor, Sree Ram Nivas, Ram Nagar 7th Street, Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Ram Nagar, Nanganallur",
    phone: "9176583618",
    websiteUrl: "https://jhoola.co/",
    hoursSummary: "Membership from 1 July 2026 — contact for play times and tiers",
    faqJson,
    verified: false,
    metadata: JSON.stringify({
      sources: ["Jhoola Activity Centre — reader-submitted listing for mynanganallur.in"],
      note: "Because for children, play is serious business. Early bird offers available — confirm tiers, fees, and timings by phone before enrolling.",
    }),
    updatedAt: new Date(),
  };

  if (existing) {
    await db
      .update(directoryEntries)
      .set(row)
      .where(eq(directoryEntries.id, existing.id));
    console.log("Updated directory:", TYPE, SLUG, existing.id);
  } else {
    await db.insert(directoryEntries).values(row);
    console.log("Inserted directory:", TYPE, SLUG);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
