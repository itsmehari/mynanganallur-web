/**
 * VV Placement Services — AC technician & helper (Madipakkam).
 * English + Tamil public pages (hreflang pair). Auto-takedown 30 days;
 * apply-by 90 days from publish.
 *
 * Dev:  `npm run db:seed:job:vv-placement-ac-helper-madipakkam`
 * Live: `npm run db:seed:job:vv-placement-ac-helper-madipakkam:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { cities, employers, jobPostings } from "../src/db/schema/tables";

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

if (live) {
  const hostMatch = url.match(/@([^/?]+)/);
  console.log(
    "[seed-job-vv-ac] Live target DB host:",
    hostMatch?.[1] ?? "(unparsed)",
  );
}

const db = drizzle(neon(url), { schema });

const EMPLOYER_SLUG = "vv-placement-services";
const EN_SLUG = "ac-technician-helper-50-vacancies-madipakkam-chennai";
/** Tamil script in the address bar; stored percent-encoded for route-param matching. */
const TA_SLUG_UNICODE =
  "ஏசி-டெக்னீஷன்-ஹெல்பர்-50-காலியிடம்-மடிப்பாக்கம்-சென்னை";
const TA_SLUG = encodeURIComponent(TA_SLUG_UNICODE);

const publishedAt = new Date();
const expiresAt = new Date(publishedAt);
expiresAt.setDate(expiresAt.getDate() + 30);
const applyBy = new Date(publishedAt);
applyBy.setDate(applyBy.getDate() + 90);

const EN_TITLE =
  "AC technician and helper — 50 vacancies in Madipakkam | ₹15,000–₹30,000 a month, room and food | VV Placement Services · 91767 97745";

const EN_BODY = `AC technician and helper jobs in Madipakkam: 50 vacancies, ₹15,000–₹30,000 a month, room and food. Hire by VV Placement Services. Call or WhatsApp 91767 97745.

VV Placement Services is filling full-time, onsite AC technician and helper openings in Madipakkam, Chennai. The combined headcount is 50. Monthly pay spans ₹15,000–₹30,000, and room and food are part of the offer. Reach them on 91767 97745.

## Open roles

- **AC technician**
- **Helper**

Street address has not been shared for this listing. Confirm the work site with VV Placement Services when you enquire.

## Pay and stay

- **Monthly pay:** ₹15,000–₹30,000
- **Stay:** room and food included

How the 50 openings are split between the two roles, and which role sits at which end of the pay band, are not stated here — ask the recruiter directly.

## Work arrangement

- **Type:** full time
- **Mode:** onsite
- **Area:** Madipakkam, Chennai

## How to apply

Call or WhatsApp **91767 97745**. Applications are accepted for **90 days** from the publish date on this page. This listing is scheduled to leave the public jobs board after **30 days**.

---

*Advertiser-submitted community listing. Confirm pay, stay, and joining terms with VV Placement Services before you travel or share documents.*`;

const EN_FAQ = {
  items: [
    {
      q: "What is the salary for these AC technician and helper roles?",
      a: "Pay is ₹15,000–₹30,000 per month. The listing does not say which role gets which end of that band — confirm with VV Placement Services on 91767 97745.",
    },
    {
      q: "Is accommodation included?",
      a: "Yes. Room and food are included.",
    },
    {
      q: "How many vacancies are open?",
      a: "There are 50 vacancies in total across AC technician and helper roles. The split between the two roles is not specified on this page.",
    },
    {
      q: "Who is hiring and where is the work?",
      a: "VV Placement Services is hiring for full-time, onsite work in Madipakkam, Chennai. A street address was not provided.",
    },
    {
      q: "How do I apply?",
      a: "Call or WhatsApp 91767 97745. You can also use the Apply via WhatsApp button on this page.",
    },
  ],
};

const TA_TITLE =
  "ஏசி டெக்னீஷன் மற்றும் ஹெல்பர் — மடிப்பாக்கத்தில் 50 காலியிடங்கள் | மாதம் ₹15,000–₹30,000, அறை மற்றும் உணவு | VV Placement Services · 91767 97745";

const TA_BODY = `மடிப்பாக்கத்தில் ஏசி டெக்னீஷன் மற்றும் ஹெல்பர் வேலை: 50 காலியிடங்கள், மாதம் ₹15,000–₹30,000, அறை மற்றும் உணவு. VV Placement Services நியமிக்கிறது. அழைக்க / WhatsApp: 91767 97745.

VV Placement Services, மடிப்பாக்கம், சென்னையில் முழுநேர நேரில் பணிக்கு ஏசி டெக்னீஷன் மற்றும் ஹெல்பர் ஆட்களைத் தேடுகிறது. மொத்தம் 50 காலியிடங்கள். மாத ஊதியம் ₹15,000–₹30,000; அறை மற்றும் உணவு உண்டு. தொடர்பு எண் 91767 97745.

## திறந்த பதவிகள்

- **ஏசி டெக்னீஷன்**
- **ஹெல்பர்**

இந்த அறிவிப்பில் தெரு முகவரி கொடுக்கப்படவில்லை. விசாரிக்கும்போது VV Placement Services-இடம் பணியிடத்தை உறுதிப்படுத்திக் கொள்ளுங்கள்.

## ஊதியம் மற்றும் தங்கல்

- **மாத ஊதியம்:** ₹15,000–₹30,000
- **தங்கல்:** அறை மற்றும் உணவு உட்பட

50 காலியிடங்கள் இரு பதவிகளுக்கும் எவ்வாறு பிரிக்கப்பட்டுள்ளன, ஊதிய வரம்பின் எந்த முனையில் எந்தப் பதவி உள்ளது என்பது இங்கே குறிப்பிடப்படவில்லை — நேரடியாக ஆட்சேர்ப்பு அதிகாரியிடம் கேளுங்கள்.

## பணி அமைப்பு

- **வகை:** முழுநேரம்
- **முறை:** நேரில் (onsite)
- **பகுதி:** மடிப்பாக்கம், சென்னை

## விண்ணப்பிக்கும் முறை

**91767 97745** என்ற எண்ணில் அழைக்கவும் அல்லது WhatsApp அனுப்பவும். இந்தப் பக்கம் வெளியிடப்பட்ட நாளிலிருந்து **90 நாட்கள்** வரை விண்ணப்பங்கள் ஏற்கப்படும். பொது வேலைப் பட்டியலில் இருந்து இந்த அறிவிப்பு **30 நாட்களுக்குப்** பிறகு நீக்கப்படும்.

---

*சமூகப் பக்கத்தில் விளம்பரதாரர் சமர்ப்பித்த அறிவிப்பு. பயணம் செய்வதற்கு முன் அல்லது ஆவணங்களைப் பகிர்வதற்கு முன் ஊதியம், தங்கல், சேரும் நிபந்தனைகளை VV Placement Services-இடம் உறுதிப்படுத்துங்கள்.*`;

const TA_FAQ = {
  items: [
    {
      q: "ஏசி டெக்னீஷன் மற்றும் ஹெல்பர் பதவிகளின் சம்பளம் என்ன?",
      a: "மாத ஊதியம் ₹15,000–₹30,000. எந்தப் பதவிக்கு எந்த அளவு என்பது இங்கே சொல்லப்படவில்லை — 91767 97745-ல் VV Placement Services-இடம் உறுதிப்படுத்துங்கள்.",
    },
    {
      q: "தங்கல் வசதி உண்டா?",
      a: "ஆம். அறை மற்றும் உணவு வழங்கப்படுகிறது.",
    },
    {
      q: "எத்தனை காலியிடங்கள் உள்ளன?",
      a: "ஏசி டெக்னீஷன் மற்றும் ஹெல்பர் பதவிகளுக்காக மொத்தம் 50 காலியிடங்கள் உள்ளன. இரு பதவிகளுக்கும் எப்படிப் பிரிக்கப்பட்டுள்ளது என்பது இப்பக்கத்தில் குறிப்பிடப்படவில்லை.",
    },
    {
      q: "யார் நியமிக்கிறார்கள்? பணியிடம் எங்கே?",
      a: "VV Placement Services, மடிப்பாக்கம், சென்னையில் முழுநேர நேரில் பணிக்கு ஆட்களைத் தேடுகிறது. தெரு முகவரி கொடுக்கப்படவில்லை.",
    },
    {
      q: "எப்படி விண்ணப்பிப்பது?",
      a: "91767 97745 என்ற எண்ணில் அழைக்கவும் அல்லது WhatsApp செய்யவும். இந்தப் பக்கத்தில் உள்ள WhatsApp பொத்தானையும் பயன்படுத்தலாம்.",
    },
  ],
};

const EN_META_HINT =
  "AC technician & helper in Madipakkam: 50 vacancies, ₹15k–₹30k/month, room and food. VV Placement Services. Call/WhatsApp 91767 97745.";

async function upsertJob(opts: {
  cityId: string;
  employerId: string;
  slug: string;
  alternateSlug: string;
  locale: "en-IN" | "ta-IN";
  title: string;
  body: string;
  faqJson: typeof EN_FAQ;
}) {
  const [existing] = await db
    .select({ id: jobPostings.id })
    .from(jobPostings)
    .where(
      and(eq(jobPostings.cityId, opts.cityId), eq(jobPostings.slug, opts.slug)),
    )
    .limit(1);

  const values = {
    employerId: opts.employerId,
    cityId: opts.cityId,
    slug: opts.slug,
    title: opts.title,
    body: opts.body,
    locationLabel: "Madipakkam, Chennai",
    salaryMin: 15_000,
    salaryMax: 30_000,
    salaryDisclosed: true,
    remotePolicy: "onsite",
    openingsCount: 50,
    status: "open" as const,
    featured: false,
    contactPhone: "9176797745",
    contactEmail: null as string | null,
    locale: opts.locale,
    alternateSlug: opts.alternateSlug,
    jobBenefits: opts.locale === "ta-IN" ? "அறை மற்றும் உணவு" : "room and food",
    publishedAt,
    expiresAt,
    applyBy,
    faqJson: opts.faqJson,
    moderationNotes:
      opts.locale === "en-IN"
        ? `meta_hint:${EN_META_HINT}`
        : "ta twin of ac-technician-helper-50-vacancies-madipakkam-chennai; auto-takedown 30d; apply-by 90d",
  };

  if (existing) {
    await db
      .update(jobPostings)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(jobPostings.id, existing.id));
    console.log("Updated job:", opts.locale, opts.slug);
  } else {
    await db.insert(jobPostings).values(values);
    console.log("Inserted job:", opts.locale, opts.slug);
  }
}

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

  let employerId: string;
  const [existingEmployer] = await db
    .select({ id: employers.id })
    .from(employers)
    .where(eq(employers.slug, EMPLOYER_SLUG))
    .limit(1);

  if (existingEmployer) {
    employerId = existingEmployer.id;
    await db
      .update(employers)
      .set({ name: "VV Placement Services", updatedAt: new Date() })
      .where(eq(employers.id, employerId));
  } else {
    const [ins] = await db
      .insert(employers)
      .values({
        name: "VV Placement Services",
        slug: EMPLOYER_SLUG,
        websiteUrl: null,
      })
      .returning({ id: employers.id });
    employerId = ins.id;
    console.log("Inserted employer:", EMPLOYER_SLUG);
  }

  await upsertJob({
    cityId: city.id,
    employerId,
    slug: EN_SLUG,
    alternateSlug: TA_SLUG,
    locale: "en-IN",
    title: EN_TITLE,
    body: EN_BODY,
    faqJson: EN_FAQ,
  });

  await upsertJob({
    cityId: city.id,
    employerId,
    slug: TA_SLUG,
    alternateSlug: EN_SLUG,
    locale: "ta-IN",
    title: TA_TITLE,
    body: TA_BODY,
    faqJson: TA_FAQ,
  });

  console.log("EN URL path: /jobs/" + EN_SLUG);
  console.log("TA URL path: /jobs/" + TA_SLUG);
  console.log("expiresAt (30d):", expiresAt.toISOString());
  console.log("applyBy (90d):", applyBy.toISOString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
