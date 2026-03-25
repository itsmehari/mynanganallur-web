/**
 * Seeds `directory_entries` for Nanganallur from **public, citable web sources**
 * (Wikipedia locality article, HRCE Tamil Nadu temple registry, community guides,
 * India Post / map listings). We do **not** scrape Facebook or Google Maps —
 * phones and hours change; every row is `verified: false` until you confirm.
 *
 * Dev:  `npm run db:seed:directory`
 * Live: `npm run db:seed:directory:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { cities, directoryEntries } from "../src/db/schema/tables";

type DirectoryRowInsert = InferInsertModel<typeof directoryEntries>;

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
      ? "Live: DATABASE_URL missing (.env.production.local)."
      : "DATABASE_URL missing — add to .env.local",
  );
  process.exit(1);
}

const db = drizzle(neon(url), { schema });

const SITE_SLUG = "nanganallur";

type SeedDir = {
  type: DirectoryRowInsert["type"];
  name: string;
  slug: string;
  address?: string;
  localityLabel?: string;
  phone?: string;
  websiteUrl?: string;
  /** Short JSON string — sources + disclaimer */
  metadata: string;
};

/**
 * Sources (summarised):
 * - Wikipedia "Nanganallur" — schools, hospitals, temples list, roller rink, civic facts
 * - https://hrce.tn.gov.in — Anjaneyar temple registry (TM000019)
 * - https://www.nangainallur.com — Varasiddhi Vinayagar, A2B (community site)
 * - Public pincode / post office aggregators — Nanganallur S.O. address
 */
const seeds: SeedDir[] = [
  {
    type: "temple",
    name: "Arulmigu Adivyadhihara Bhaktha Anjaneyar Temple (32-ft Hanuman)",
    slug: "adi-anjaneyar-temple-32ft",
    address: "1, Ram Nagar, 8th Street, Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Ram Nagar",
    phone: "044-22670132",
    websiteUrl: "https://hrce.tn.gov.in/hrcehome/index_temple.php?tid=19",
    metadata: JSON.stringify({
      sources: [
        "https://hrce.tn.gov.in/hrcehome/index_temple.php?tid=19",
        "https://en.wikipedia.org/wiki/Nanganallur",
      ],
      note: "HRCE registry + Wikipedia; verify timings before visiting.",
    }),
  },
  {
    type: "temple",
    name: "Sri Varasiddhi Vinayagar Temple",
    slug: "sri-varasiddhi-vinayagar-temple",
    address: "Hindu Colony, Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Hindu Colony",
    phone: "044-22242854",
    websiteUrl: "https://www.nangainallur.com/hindu/temples/sri-varasiddhi-vinayagar-temple-nanganallur/",
    metadata: JSON.stringify({
      sources: [
        "https://www.nangainallur.com/hindu/temples/sri-varasiddhi-vinayagar-temple-nanganallur/",
        "https://en.wikipedia.org/wiki/Nanganallur",
      ],
      note: "Community guide; phone may change — call ahead.",
    }),
  },
  {
    type: "temple",
    name: "Sri Rajarajeshwari Temple",
    slug: "sri-rajarajeshwari-temple-nanganallur",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: ["https://en.wikipedia.org/wiki/Nanganallur"],
      note: "Named in Wikipedia temple list; confirm exact street with locals.",
    }),
  },
  {
    type: "temple",
    name: "Sri Lakshmi Hayagrivar Temple",
    slug: "sri-lakshmi-hayagrivar-temple-nanganallur",
    address: "Adjacent to Varasiddhi Vinayagar complex, Hindu Colony, Nanganallur, Chennai 600061",
    localityLabel: "Hindu Colony",
    metadata: JSON.stringify({
      sources: [
        "https://www.nangainallur.com/hindu/temples/sri-varasiddhi-vinayagar-temple-nanganallur/",
        "https://en.wikipedia.org/wiki/Nanganallur",
      ],
      note: "Often visited together with Varasiddhi Vinayagar; verify access.",
    }),
  },
  {
    type: "school",
    name: "The Hindu Colony Chellammal Vidyalaya Senior Secondary School",
    slug: "chellammal-vidyalaya-senior-secondary",
    address: "Hindu Colony, Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Hindu Colony",
    metadata: JSON.stringify({
      sources: ["https://en.wikipedia.org/wiki/Nanganallur"],
      note: "Wikipedia school list; check school site for admissions phone.",
    }),
  },
  {
    type: "school",
    name: "P.M.S. Matriculation Higher Secondary School",
    slug: "pms-matriculation-higher-secondary",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: ["https://en.wikipedia.org/wiki/Nanganallur"],
    }),
  },
  {
    type: "school",
    name: "St. Peter's Matriculation Higher Secondary School",
    slug: "st-peters-matriculation-higher-secondary",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: ["https://en.wikipedia.org/wiki/Nanganallur"],
      note: "Described on Wikipedia as one of the oldest schools in the area.",
    }),
  },
  {
    type: "school",
    name: "Jaigopal Garodia Girls' Higher Secondary School",
    slug: "jaigopal-garodia-girls-higher-secondary",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: ["https://en.wikipedia.org/wiki/Nanganallur"],
    }),
  },
  {
    type: "school",
    name: "Rajkumar Sulochana Matriculation Higher Secondary School",
    slug: "radhika-rajkumar-sulochana-matric-hss",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: [
        "https://en.wikipedia.org/wiki/Nanganallur",
        "https://www.livechennai.com/nanganallur/index_nanganallur.asp",
      ],
      note: "Also listed on LiveChennai Nanganallur index.",
    }),
  },
  {
    type: "hospital",
    name: "Sri Chakra Multi Speciality Hospital",
    slug: "sri-chakra-multi-speciality-hospital",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: ["https://en.wikipedia.org/wiki/Nanganallur"],
    }),
  },
  {
    type: "hospital",
    name: "Pankajam Memorial Hospital",
    slug: "pankajam-memorial-hospital",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: ["https://en.wikipedia.org/wiki/Nanganallur"],
    }),
  },
  {
    type: "hospital",
    name: "Dr Agarwal's Eye Hospital (Nanganallur)",
    slug: "dr-agarwals-eye-hospital-nanganallur",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: [
        "https://en.wikipedia.org/wiki/Nanganallur",
        "https://www.proptiger.com/chennai/nanganallur-51155/hospitals",
      ],
      note: "Branch presence cited in locality overviews; confirm unit address on dragarwal.com.",
    }),
  },
  {
    type: "hospital",
    name: "Hindu Mission Hospital",
    slug: "hindu-mission-hospital-nanganallur-area",
    address: "Nanganallur / nearby belt — verify branch",
    localityLabel: "Nanganallur area",
    metadata: JSON.stringify({
      sources: ["https://en.wikipedia.org/wiki/Nanganallur"],
      note: "Listed under Nanganallur hospitals on Wikipedia; confirm which campus serves this pincode.",
    }),
  },
  {
    type: "hospital",
    name: "Dr Hariharan Diabetes & Heart Care Institute",
    slug: "hariharan-diabetes-heart-care",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: ["https://en.wikipedia.org/wiki/Nanganallur"],
      note: "Listed on Wikipedia Nanganallur hospitals section; confirm address/phone locally.",
    }),
  },
  {
    type: "hospital",
    name: "Apollo Multispeciality Clinic",
    slug: "apollo-multispeciality-clinic-nanganallur",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    phone: "044-45605000",
    metadata: JSON.stringify({
      sources: ["https://en.wikipedia.org/wiki/Nanganallur"],
      note: "Phone copied from Wikipedia infobox-style list — verify on Apollo official channels.",
    }),
  },
  {
    type: "bank",
    name: "State Bank of India",
    slug: "sbi-nanganallur",
    address: "Nanganallur main commercial area, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: [
        "https://www.proptiger.com/chennai/nanganallur-51155/banks",
        "https://www.livechennai.com/nanganallur/index_nanganallur.asp",
      ],
      note: "Several banks serve the locality — replace with exact IFSC branch after you survey.",
    }),
  },
  {
    type: "bank",
    name: "ICICI Bank",
    slug: "icici-bank-nanganallur",
    address: "Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: ["https://www.proptiger.com/chennai/nanganallur-51155/banks"],
    }),
  },
  {
    type: "atm",
    name: "ATM cluster — Nanganallur high street",
    slug: "atm-high-street-nanganallur",
    address: "100 Feet Road / bazaar lanes, Nanganallur, Chennai 600061",
    localityLabel: "Nanganallur",
    metadata: JSON.stringify({
      sources: ["https://www.livechennai.com/nanganallur/index_nanganallur.asp"],
      note: "Placeholder row — map real ATM IDs to bank branches when you verify on the ground.",
    }),
  },
  {
    type: "restaurant",
    name: "Adyar Ananda Bhavan (A2B) — Ram Nagar",
    slug: "a2b-adyar-ananda-bhavan-ram-nagar",
    address: "6, 6th Main Road, Ram Nagar, Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Ram Nagar",
    phone: "044-42657094",
    websiteUrl: "https://www.nangainallur.com/food/veg-restaurant/adyar-ananda-bhavan/",
    metadata: JSON.stringify({
      sources: [
        "https://www.nangainallur.com/food/veg-restaurant/adyar-ananda-bhavan/",
        "https://www.zomato.com/chennai/a2b-adyar-ananda-bhavan-nanganallur",
      ],
    }),
  },
  {
    type: "government_office",
    name: "India Post — Nanganallur Sub Post Office (600061)",
    slug: "india-post-nanganallur-so",
    address: "6th Main Road, Macmillan Colony, Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "Macmillan Colony",
    phone: "044-22241425",
    websiteUrl: "https://www.indiapost.gov.in",
    metadata: JSON.stringify({
      sources: [
        "https://www.mappls.com/place-nanganallur+post+office-6th+main+road-macmillan-colony-nanganallur-chennai-tamil+nadu-600061-11A685@zdata=MTIuOTgwNTYxKzgwLjE5MDMxMSsxNysxMUE2ODUrK25yed",
        "https://en.wikipedia.org/wiki/Nanganallur",
      ],
      note: "PIN 600061 per Wikipedia; phone from third-party directory — confirm on India Post site.",
    }),
  },
  {
    type: "park",
    name: "Nanganallur roller skating rink (GCC / erstwhile Alandur Municipality)",
    slug: "nanganallur-roller-skating-rink",
    address: "100 Feet Road, near Civil Aviation Colony, Nanganallur, Chennai, Tamil Nadu 600061",
    localityLabel: "100 Feet Road",
    metadata: JSON.stringify({
      sources: [
        "https://en.wikipedia.org/wiki/Nanganallur",
        "https://web.archive.org/web/20141228181249/http://www.newindianexpress.com/cities/chennai/article468327.ece",
      ],
      note: "Opened 2011 per Wikipedia; verify current hours with GCC recreation desk.",
    }),
  },
];

async function main() {
  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, SITE_SLUG))
    .limit(1);

  if (!city) {
    console.error(
      `City '${SITE_SLUG}' not found. Run npm run db:seed (articles seed) first.`,
    );
    process.exit(1);
  }

  const cityId = city.id;

  for (const s of seeds) {
    const existing = await db
      .select({ id: directoryEntries.id })
      .from(directoryEntries)
      .where(
        and(
          eq(directoryEntries.cityId, cityId),
          eq(directoryEntries.type, s.type),
          eq(directoryEntries.slug, s.slug),
        ),
      )
      .limit(1);

    const row = {
      cityId,
      type: s.type,
      name: s.name,
      slug: s.slug,
      address: s.address ?? null,
      localityLabel: s.localityLabel ?? null,
      phone: s.phone ?? null,
      websiteUrl: s.websiteUrl ?? null,
      verified: false,
      metadata: s.metadata,
      updatedAt: new Date(),
    };

    if (existing[0]) {
      await db
        .update(directoryEntries)
        .set(row)
        .where(eq(directoryEntries.id, existing[0].id));
    } else {
      await db.insert(directoryEntries).values(row);
    }
    console.log("Upserted directory:", s.type, s.slug);
  }

  console.log("Directory seed done:", seeds.length, "entries");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
