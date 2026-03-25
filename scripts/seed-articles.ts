/**
 * Seeds site city (Nanganallur) + published local-news articles.
 * Every story is anchored in Nanganallur (civic, mobility, temples, safety).
 *
 * Dev: `npm run db:seed` — uses `.env.local` then `.env` (DATABASE_URL).
 * Live: `npm run db:seed:live` — uses **only** `.env.production.local` (pull from Vercel or paste Neon URL).
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
      ? "Live seed: DATABASE_URL missing.\n" +
          "Create .env.production.local with your production Neon URL, e.g.\n" +
          "  vercel env pull .env.production.local --environment=production --yes\n" +
          "Or paste DATABASE_URL= from Neon dashboard (pooled or direct)."
      : "DATABASE_URL missing — add to .env.local or use npm run db:seed:live",
  );
  process.exit(1);
}

if (live) {
  const hostMatch = url.match(/@([^/?]+)/);
  console.log("[db:seed:live] Target DB host:", hostMatch?.[1] ?? "(unparsed)");
}

const db = drizzle(neon(url), { schema });

const SITE_CITY = { slug: "nanganallur", name: "Nanganallur", countryCode: "IN" };

type SeedArticle = {
  slug: string;
  title: string;
  summary: string;
  dek: string;
  category: string;
  featured: boolean;
  publishedAt: Date;
  sourceUrl: string;
  sourceName: string;
  reportBody: string;
  analysisBody: string;
  interactiveJson: Record<string, unknown>;
};

const seeds: SeedArticle[] = [
  {
    slug: "nanganallur-power-cuts-substation-upgrade-demand",
    title:
      "Nanganallur residents flag frequent power cuts; demand substation upgrade on 100 Feet Road",
    summary:
      "Grievance meeting coverage: voltage dips, overloaded 33 kV infra, and calls for 110 kV upgrade plus new transformers.",
    dek: "TANGEDCO faces pressure as apartment density outpaces feeder capacity.",
    category: "Local",
    featured: true,
    publishedAt: new Date("2025-07-15T08:00:00Z"),
    sourceUrl:
      "https://www.thehindu.com/todays-paper/tp-features/tp-downtown/nanganallur-residents-irked-over-power-cuts/article69778835.ece",
    sourceName: "The Hindu",
    reportBody: `## What we know

Residents told reporters that **power cuts** and **voltage fluctuations** have become common as Nanganallur’s built-up density has grown. At a grievance forum attended by **Minister T. M. Anbarasan** and officials from **TANGEDCO** and other departments, locals asked for the **33 kV substation on 100 Feet Road** to be upgraded to **110 kV**, replacement of ageing transformers, and faster completion of **underground high-tension cabling**.

The same report notes a **₹29 crore** state allocation to link **Fifth Main Road** with the **Pazhavanthangal subway**—framed as easing congestion and improving safety for motorists.`,
    analysisBody: `## What to watch on your street

Apartment clusters and AC load profiles mean **evening peak** is when dips hurt most. If your RWA documents recurring outages with **time stamps and feeder names**, that data helps zone engineers prioritise.

Pair **discom** follow-up with **corporation** street-light tickets where dark stretches appear after outages—pedestrian safety compounds the inconvenience.`,
    interactiveJson: {
      type: "checklist",
      title: "If outages are disrupting your lane",
      items: [
        { id: "1", "label": "Log date, time, and whether whole street or single phase failed" },
        { id: "2", "label": "Note transformer ID / EB complaint number from TANGEDCO" },
        { id: "3", "label": "Share consolidated RWA letter to AE office with meter numbers" },
      ],
    },
  },
  {
    slug: "nanganallur-road-surface-ugd-cmwssb-works",
    title:
      "Nanganallur motorists report uneven roads after UGD and drain works on 4th Main Road",
    summary:
      "Press: middle stretches left rough after CMWSSB underground drainage, footpath widening, and storm-water work.",
    dek: "Ward officials cited phased completion timelines for remaining drainage scope.",
    category: "Mobility",
    featured: true,
    publishedAt: new Date("2025-05-20T09:30:00Z"),
    sourceUrl:
      "https://www.thehindu.com/todays-paper/tp-national/tp-tamilnadu/roads-damaged-in-civic-works-put-motorists-to-hardship-in-nanganallur/article69523260.ece",
    sourceName: "The Hindu",
    reportBody: `## What we know

Coverage describes **uneven carriageways** on **4th Main Road** and nearby stretches after **CMWSSB** underground drainage, **footpath widening**, and **storm-water drain** construction. Residents and two-wheeler riders report **hazardous mid-lane bumps** where trenches were refilled in haste.

Ward-level officials quoted in the report indicated that a large share of drainage scope was already complete, with **remaining work** expected within a **two-month** window—readers should treat dates as press snapshots and confirm on the ground.`,
    analysisBody: `## Safer riding until resurfacing lands

Treat **night rain + fresh fill** as higher skid risk. If the **corporation** opens a **patch complaint** channel for your ward, photograph **GPS-tagged** potholes rather than forwarding anonymous forwards.

When **bus routes** deviate around works, note whether **seniors and schoolchildren** still have a safe walking line—sometimes the motorable lane heals before the footpath does.`,
    interactiveJson: {
      type: "poll",
      question: "Which commute mode is worst hit by patchy roads near your home?",
      options: [
        { id: "2w", "label": "Two-wheeler" },
        { id: "car", "label": "Car" },
        { id: "walk", "label": "Walking / bus first-mile" },
      ],
    },
  },
  {
    slug: "nanganallur-pazhavanthangal-subway-fifth-main-link",
    title:
      "₹29 crore link: Fifth Main Road and Pazhavanthangal subway — a long-pending cut-through",
    summary:
      "State allocation reported for a connector expected to cut congestion toward GST Road.",
    dek: "Palavanthangal station users watch for construction phasing and diversions.",
    category: "Mobility",
    featured: false,
    publishedAt: new Date("2025-07-16T07:00:00Z"),
    sourceUrl:
      "https://www.thehindu.com/todays-paper/tp-features/tp-downtown/nanganallur-residents-irked-over-power-cuts/article69778835.ece",
    sourceName: "The Hindu",
    reportBody: `## What we know

The same **The Hindu** downtown brief that catalogued Nanganallur power grievances notes a **₹29 crore** government allocation to connect **Fifth Main Road** with the **Pazhavanthangal subway**—described as a **long-standing demand** to reduce **vehicular congestion** and **accident risk** on approaches toward **GST Road**.

Exact **DPR milestones**, lane closures, and **night working windows** were not detailed in the short item; residents should watch **corporation / highways** notices once contractors mobilise.`,
    analysisBody: `## Why Palavanthangal commuters should care

Many residents already use **Palavanthangal suburban station**; a cleaner road geometry to the subway can shorten **last-mile** time if pedestrian crossings are designed in the same package—not only car lanes.

Heavy rain history at the **subway** means **pumping readiness** matters as much as asphalt; ask whether the project bundles **storm pumps** or **invert fixes** in the contract scope.`,
    interactiveJson: {
      type: "checklist",
      title: "Track the project responsibly",
      items: [
        { id: "1", "label": "Save corporation / CMRL diversion PDFs when posted" },
        { id: "2", "label": "Note school-zone timings before shortcutting through side streets" },
        { id: "3", "label": "Report unfinished barricade stubs after each phase" },
      ],
    },
  },
  {
    slug: "palavanthangal-subway-rain-commute-nanganallur",
    title:
      "When Palavanthangal subway floods: how Nanganallur residents reach GST Road in monsoon",
    summary:
      "Local pattern: subway and low spots pinch access to GST during intense rain; inner ring toward Velachery becomes a pressure valve.",
    dek: "Wikipedia’s locality entry and resident accounts align on the bottleneck.",
    category: "Mobility",
    featured: false,
    publishedAt: new Date("2026-03-10T10:00:00Z"),
    sourceUrl: "https://en.wikipedia.org/wiki/Nanganallur",
    sourceName: "Wikipedia — Nanganallur",
    reportBody: `## What we know

The **Nanganallur** article in Wikipedia (community-edited) states that **Palavanthangal** and **Thillai Ganga Nagar** subways connect the neighbourhood to **GST Road**, but that **heavy rain** can **flood** the Palavanthangal underpass—making the short hop to the highway unreliable during monsoon peaks.

The same entry notes an **inner ring road** from **Thillai Ganga Nagar** toward **Velachery** as an important **alternate corridor** when the subway is unusable—especially for residents who rely on suburban trains at **Palavanthangal** or **Meenambakkam**.`,
    analysisBody: `## Plan B before the sky opens

Save **two routes** in your maps app: one via **subway** when dry, one via **inner ring / Velachery** when waterlogging warnings appear. If you pick **share autos**, agree **fare bands** for detours in advance—surge behaviour spikes when everyone reroutes at once.

mynanganallur.in treats Wikipedia as a **starting map**, not gospel—verify closures with **traffic police** or the **corporation** on the day.`,
    interactiveJson: {
      type: "poll",
      question: "During heavy rain, which backup route do you use most?",
      options: [
        { id: "inner", "label": "Inner ring toward Velachery" },
        { id: "wait", "label": "Wait out + suburban/MTC when running" },
        { id: "gst", "label": "Longer GST approach from another junction" },
      ],
    },
  },
  {
    slug: "nanganallur-temple-corridor-adi-anjaneyar-hrce",
    title:
      "Nanganallur’s 32-foot Anjaneyar temple: HRCE registry, timings, and crowd etiquette",
    summary:
      "Arulmigu Adivyadhihara Bhaktha Anjaneyar is a city landmark; official HRCE page lists temple ID and access basics.",
    dek: "Ram Nagar pilgrims share space with through traffic—plan weekday visits when possible.",
    category: "Local",
    featured: true,
    publishedAt: new Date("2026-03-18T06:00:00Z"),
    sourceUrl: "https://hrce.tn.gov.in/hrcehome/index_temple.php?tid=19",
    sourceName: "Hindu Religious & Charitable Endowments Department, Tamil Nadu",
    reportBody: `## What we know

The **HRCE** portal lists **Arulmigu Adivyadhihara Bhaktha Anjaneyar Temple** in **Nanganallur** (temple reference **TM000019**) among Tamil Nadu’s controlled temples. Public guides and community sites describe the **32-foot Hanuman** icon carved from a single granite block—drawing steady **weekend** and **festival** footfall from around Nanganallur and the wider metro area.

Neighbouring **Varasiddhi Vinayagar** and **Lakshmi Hayagrivar** shrines in **Hindu Colony** form a compact **temple corridor** visitors often combine in one trip.`,
    analysisBody: `## Visiting without snarling Ram Nagar

**Street parking** competes with **resident access**. Prefer **Metro + short ride** (e.g. **Nanganallur Road** or **Meenambakkam**) on peak days. Carry **change** for shoe stands and respect **photography rules** inside sanctum zones.

For **archana** slots during **Panguni / Hanuman Jayanthi**, assume **queue discipline** will need volunteer ropes—check temple office boards rather than third-party apps.`,
    interactiveJson: {
      type: "checklist",
      title: "Before you go",
      items: [
        { id: "1", "label": "Screenshot HRCE / temple notice for that day’s schedule" },
        { id: "2", "label": "Avoid blocking 8th Street driveways when parking" },
        { id: "3", "label": "Keep hydration + umbrella in festival heat" },
      ],
    },
  },
  {
    slug: "nanganallur-metro-airport-multimodal-commute",
    title:
      "From Nanganallur Road Metro to the airport: a resident’s multimodal cheat sheet",
    summary:
      "Locality sits between airport, GST, and Metro spine — combine MTC, suburban, and CMRL depending on time of day.",
    dek: "PIN 600061; wards 166–167 in Alandur zone per Wikipedia infobox.",
    category: "Mobility",
    featured: false,
    publishedAt: new Date("2026-03-12T11:00:00Z"),
    sourceUrl: "https://en.wikipedia.org/wiki/Nanganallur",
    sourceName: "Wikipedia — Nanganallur",
    reportBody: `## What we know

Wikipedia’s **Nanganallur** infobox places the neighbourhood under the **municipal corporation** (**Alandur / Zone 12**, wards **166–167**), PIN **600061**, with **Palavanthangal** and **Meenambakkam** suburban stations nearby and **Nanganallur Road** / **Meenambakkam** on the **CMRL Metro** network.

The article also lists **MTC** routes such as **52K, 52L, 52P, M18C, M152N** that pass through or serve the area—useful when Metro ends early or airport trips need a **first-mile** bus.`,
    analysisBody: `## Pick the mode for the job

**Early international departures** often favour **ride-hail + Metro** to avoid GST surprises. **Shift workers** near **Meenambakkam** industrial pockets may prefer **suburban** frequency checks on **Southern Railway** apps.

Always verify **last train** and **last bus** the night before—**city transit** schedules shift with **curtailed services** on maintenance days.`,
    interactiveJson: {
      type: "poll",
      question: "Your most reliable airport run from Nanganallur is usually:",
      options: [
        { id: "metro", "label": "Metro + short cab" },
        { id: "cab", "label": "Direct cab / auto" },
        { id: "train", "label": "Suburban + walk" },
      ],
    },
  },
  {
    slug: "nanganallur-roller-skating-rink-100-feet-road",
    title:
      "Nanganallur’s roller-skating rink on 100 Feet Road — a neighbourhood sporting landmark",
    summary:
      "Wikipedia cites a pre-merger municipal-era rink near Civil Aviation Colony; legacy press noted TN’s longest public rink length when it opened.",
    dek: "Call the corporation recreation desk for current hours before visiting.",
    category: "Local",
    featured: false,
    publishedAt: new Date("2011-06-20T08:00:00Z"),
    sourceUrl: "https://en.wikipedia.org/wiki/Nanganallur",
    sourceName: "Wikipedia — Nanganallur",
    reportBody: `## What we know

The **Nanganallur** Wikipedia article describes a **roller-skating rink** on **100 Feet Road** near the **Civil Aviation Colony**, developed on roughly **12,000 sq ft** of open ground by the then **Alandur Municipality** and opened in **June 2011**. A **New Indian Express** piece (archived) cited dimensions of roughly **325 ft by 30 ft**, described at the time as among the **longest** such public rinks in Tamil Nadu.

**Operating hours, coaching fees, and maintenance** change with civic budgets—readers should confirm with **municipal corporation** recreation / parks channels before planning lessons.`,
    analysisBody: `## Why it still matters

For families on **100 Feet Road** and **Civil Aviation Colony**, the rink is a rare **public play asset** in a dense ward. If sessions are cancelled, ask whether **storm damage** or **power** to floodlights is the cause—those tickets land in different departments.

Coaching groups sometimes run **evening batches**; respect **noise curfew** complaints from adjacent homes.`,
    interactiveJson: {
      type: "checklist",
      title: "Before kids lace up",
      items: [
        { id: "1", "label": "WhatsApp corporation zone park helpline if listed" },
        { id: "2", "label": "Carry helmets + guards even for open sessions" },
        { id: "3", "label": "Check evening flood history on 100 Feet stretch" },
      ],
    },
  },
  {
    slug: "nanganallur-dharmalingeshwar-osr-land-dispute",
    title:
      "Open Space Reservation plot near Dharmalingeshwarar Temple: corporation reclaim still contested",
    summary:
      "Residents raised encroachment worries at the same grievance forum that discussed power and roads.",
    dek: "Legal outcomes and on-ground fencing can diverge — track corporation notices.",
    category: "Local",
    featured: false,
    publishedAt: new Date("2025-07-15T09:00:00Z"),
    sourceUrl:
      "https://www.thehindu.com/todays-paper/tp-features/tp-downtown/nanganallur-residents-irked-over-power-cuts/article69778835.ece",
    sourceName: "The Hindu",
    reportBody: `## What we know

The **July 2025** downtown brief on Nanganallur grievances notes an **Open Space Reservation (OSR)** parcel near **Dharmalingeshwarar Temple** where **encroachment** concerns lingered despite a **court direction** returning land to the **municipal corporation**. Residents asked authorities to **enforce** the verdict visibly.

We are not summarising the judgment text here—only the **public reporting** of resident demands.`,
    analysisBody: `## How neighbours can engage responsibly

**OSR** fights are slow. Document **boundary stones**, **corporation board orders**, and **councillor replies** rather than circulating unverifiable aerial images.

If **walking paths** shrink because of temp structures, route complaints through **civic helpline / ward complaint** tickets so they attach to a **ward audit trail**.`,
    interactiveJson: {
      type: "checklist",
      title: "If you want clarity on the plot",
      items: [
        { id: "1", "label": "Request copy of corporation council resolution if available" },
        { id: "2", "label": "Cross-check survey numbers with RTI if you represent an RWA" },
        { id: "3", "label": "Avoid naming private individuals without court records" },
      ],
    },
  },
  {
    slug: "pre-monsoon-nanganallur-electrical-safety",
    title:
      "Pre-monsoon electrical safety for Nanganallur lanes: tight plots, common walls, terrace inverters",
    summary:
      "TANGEDCO seasonal advice matters more where compounds share walls and street flooding touches meters.",
    dek: "Pair discom checks with corporation drain clearing tickets on your street.",
    category: "Consumer",
    featured: false,
    publishedAt: new Date("2026-03-21T12:00:00Z"),
    sourceUrl: "https://www.tangedco.gov.in/",
    sourceName: "Tamil Nadu Generation and Distribution Corporation Ltd. (TANGEDCO)",
    reportBody: `## What we know

TANGEDCO’s seasonal messaging asks households to inspect **service connections**, **meter boxes**, **earthing**, and **exposed outdoor wiring** before monsoon intensifies. In **Nanganallur**, **narrow side streets**, **shared compound walls**, and **dense AC + inverter** loads raise the stakes when water pools near **LT panels**.

Recent **The Hindu** coverage from the area also highlighted **voltage fluctuation** complaints—another reason to test **ELCB/RCCB** trips before squalls arrive.`,
    analysisBody: `## Block-level habits that help

RWAs on **4th Main**, **Ram Nagar**, and **Hindu Colony** grids can run **joint walk-throughs** with a licensed contractor pool—cheaper per home and easier for **discom** crews to schedule **pole-top** fixes in one pass.

If you see **sparking** near a **street light** junction box after rain, log it as **both** electrical risk and **pedestrian** risk—the **corporation** and TANGEDCO hand-offs are smoother when tickets cite **pole numbers**.`,
    interactiveJson: {
      type: "checklist",
      title: "10-minute pre-monsoon electrical pass",
      items: [
        { id: "1", "label": "Inspect service drop for tree contact" },
        { id: "2", "label": "Check meter box seals + water pooling" },
        { id: "3", "label": "Trip-test ELCB / RCCB" },
        { id: "4", "label": "Unplug terrace pumps during orange alerts" },
      ],
    },
  },
];

async function main() {
  let cityId: string;
  const existing = await db
    .select()
    .from(cities)
    .where(eq(cities.slug, SITE_CITY.slug))
    .limit(1);
  if (existing[0]) {
    cityId = existing[0].id;
    console.log("City nanganallur exists:", cityId);
  } else {
    const [inserted] = await db
      .insert(cities)
      .values(SITE_CITY)
      .returning({ id: cities.id });
    cityId = inserted.id;
    console.log("Inserted city nanganallur:", cityId);
  }

  for (const s of seeds) {
    const body = `${s.reportBody}\n\n---\n\n${s.analysisBody}`;
    const row = await db
      .select({ id: articles.id })
      .from(articles)
      .where(
        and(eq(articles.cityId, cityId), eq(articles.slug, s.slug)),
      )
      .limit(1);
    const values = {
      cityId,
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      body,
      reportBody: s.reportBody,
      analysisBody: s.analysisBody,
      interactiveJson: s.interactiveJson,
      sourceUrl: s.sourceUrl,
      sourceName: s.sourceName,
      category: s.category,
      dek: s.dek,
      status: "published" as const,
      publishedAt: s.publishedAt,
      featured: s.featured,
    };
    if (row[0]) {
      await db
        .update(articles)
        .set({
          title: s.title,
          summary: s.summary,
          body,
          reportBody: s.reportBody,
          analysisBody: s.analysisBody,
          interactiveJson: s.interactiveJson,
          sourceUrl: s.sourceUrl,
          sourceName: s.sourceName,
          category: s.category,
          dek: s.dek,
          status: "published",
          publishedAt: s.publishedAt,
          featured: s.featured,
          updatedAt: new Date(),
        })
        .where(eq(articles.id, row[0].id));
    } else {
      await db.insert(articles).values(values);
    }
    console.log("Upserted article:", s.slug);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
