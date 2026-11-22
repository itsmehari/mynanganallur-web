/**
 * Post-event coverage: SriSon Naturopathy and Yoga Centre at the
 * 2nd National Yogasana Championship (SRM Agricultural College, Acharapakkam).
 *
 * Dev:  `npm run db:seed:article:srison-yogasana-2026`
 * Live: `npm run db:seed:article:srison-yogasana-2026:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { articles, cities } from "../src/db/schema/tables";

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
      ? "Live: DATABASE_URL missing. Add to .env.production.local (e.g. vercel env pull)."
      : "DATABASE_URL missing — add to .env.local",
  );
  process.exit(1);
}

if (live) {
  const hostMatch = url.match(/@([^/?]+)/);
  console.log(
    "[seed-article-srison-yogasana-2026] Live target DB host:",
    hostMatch?.[1] ?? "(unparsed)",
  );
}

const db = drizzle(neon(url), { schema });

const SLUG = "srison-yogasana-championship-srm-acharapakkam-november-2026";

const HERO =
  "/news/srison-yogasana-2026-prize-distribution.jpg";
const IMG_MERIT = "/news/srison-yogasana-2026-merit-certificates.jpg";
const IMG_HONOUR = "/news/srison-yogasana-2026-institution-honour.jpg";
const IMG_GROUP = "/news/srison-yogasana-2026-students-medals.jpg";

const TITLE =
  "Nanganallur SriSon students place at 2nd National Yogasana Championship";

const SUMMARY =
  "Students from SriSon Naturopathy and Yoga Centre, Nanganallur, took part in the 2nd National Yogasana Championship at SRM Agricultural College, Acharapakkam. Adarsh, Elandeeran and Sri Raman won championship titles; the centre received an Institution Honour citation.";

const DEK =
  "Event held on 22 November 2026 at SRM’s Acharapakkam campus. Coverage based on details shared by the centre after the championship.";

const FAQ = {
  items: [
    {
      q: "Which championship was this?",
      a: "The 2nd National Yogasana Championship, held at SRM Agricultural College, Acharapakkam (SRM Institute of Science & Technology, Acharapakkam campus), on 22 November 2026.",
    },
    {
      q: "Which Nanganallur centre took part?",
      a: "SriSon Naturopathy and Yoga Centre, Nanganallur, Chennai 600061. Students from the centre competed; the centre also received an Institution Honour citation at the event.",
    },
    {
      q: "Which students were named as winners?",
      a: "According to the centre, Adarsh, Elandeeran and Sri Raman won championship titles. Full category-wise result sheets from the organisers were not published with this tip.",
    },
    {
      q: "What honour did the centre receive?",
      a: "An Institution Honour memento for SriSon Naturopathy and Yoga Center, Nanganallur. The plaque names the Directorate of Sports, SRM Institute of Science & Technology, and Easy Yoga Studioz – Padmam Yoga among the organisers.",
    },
  ],
};

const REPORT = `## What we know

Students from **SriSon Naturopathy and Yoga Centre**, Nanganallur, took part in the **2nd National Yogasana Championship** organised at **SRM Agricultural College, Acharapakkam**.

The centre shared results after the event on **22 November 2026**. According to that update, students **Adarsh**, **Elandeeran** and **Sri Raman** won championship titles. Other SriSon students also competed and received certificates and medals.

The centre itself was recognised with an **Institution Honour** citation at the championship. The memento names **SriSon Naturopathy and Yoga Center, Nanganallur, Chennai – 600061**, and lists the venue as **SRM Institute of Science & Technology, Acharapakkam Campus**. Organiser lines on the plaque include the **Directorate of Sports, SRM IST**, and **Easy Yoga Studioz – Padmam Yoga**.

My Nanganallur has not independently verified the full category-wise results sheet. This report sticks to what the centre stated and what appears on the honour memento and prize photographs shared with us.

![Prize distribution at the 2nd National Yogasana Championship, Acharapakkam](${IMG_MERIT})

## At a glance

- **Event:** 2nd National Yogasana Championship
- **Date:** 22 November 2026
- **Venue:** SRM Agricultural College / SRM IST, Acharapakkam campus
- **Local centre:** SriSon Naturopathy and Yoga Centre, Nanganallur
- **Named championship winners (per centre):** Adarsh, Elandeeran, Sri Raman
- **Centre recognition:** Institution Honour

![Institution Honour memento presented to SriSon Naturopathy and Yoga Center, Nanganallur](${IMG_HONOUR})

## Photographs from the day

![SriSon students with certificates and medals after the championship](${IMG_GROUP})

Photographs supplied by the centre show students with certificates and medals, and a prize-distribution group at the Acharapakkam campus auditorium.`;

const ANALYSIS = `## Why this matters locally

Nanganallur has several yoga and naturopathy centres that train children and adults year-round. A national-level meet at a nearby SRM campus is a practical stage for those students—close enough for families to travel, and formal enough to test competition routines.

Readers should treat named winners as reported by the centre. If you need official category ranks, ask the organisers or the centre for the published results. For neighbours looking for local yogasana coaching, SriSon’s Nanganallur contact shared with this update is [8148888604](tel:+918148888604).`;

const INTERACTIVE = {
  type: "poll",
  question: "Would you like more coverage of local kids’ sports and yoga meets?",
  options: [
    { id: "yes", label: "Yes — more local sports coverage" },
    { id: "sometimes", label: "Only major wins / championships" },
    { id: "no", label: "Prefer civic / temple / market news" },
  ],
};

async function main() {
  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);

  if (!city) {
    console.error(
      "City slug 'nanganallur' not found. Seed cities first (npm run db:seed:live).",
    );
    process.exit(1);
  }

  const body = `${REPORT}\n\n---\n\n${ANALYSIS}`;
  const articleValues = {
    cityId: city.id,
    slug: SLUG,
    title: TITLE,
    summary: SUMMARY,
    dek: DEK,
    body,
    reportBody: REPORT,
    analysisBody: ANALYSIS,
    interactiveJson: INTERACTIVE,
    category: "Local",
    status: "published" as const,
    publishedAt: new Date("2026-11-22T12:45:00.000Z"),
    featured: true,
    heroImageUrl: HERO,
    faqJson: FAQ,
    source: "admin" as const,
    sourceName: "SriSon Naturopathy and Yoga Centre",
    submittedByPhone: "8148888604",
    moderationNotes:
      "Community tip via WhatsApp (+91 81488 88604), 22 Nov 2026. Photos from centre. Careful wording: winners named by centre; Institution Honour from memento text; full results sheet not attached.",
  };

  const [existing] = await db
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.cityId, city.id), eq(articles.slug, SLUG)))
    .limit(1);

  if (existing) {
    await db
      .update(articles)
      .set({ ...articleValues, updatedAt: new Date() })
      .where(eq(articles.id, existing.id));
    console.log("Updated article:", SLUG, existing.id);
  } else {
    const [inserted] = await db
      .insert(articles)
      .values(articleValues)
      .returning({ id: articles.id });
    console.log("Inserted article:", SLUG, inserted.id);
  }

  console.log("News:  /local-news/" + SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
