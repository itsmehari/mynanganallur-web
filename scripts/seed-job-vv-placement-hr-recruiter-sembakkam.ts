/**
 * VV Placement Services — HR recruiter (Sembakkam).
 * English + Tamil public pages (hreflang pair). Auto-takedown 50 days;
 * apply-by 90 days from publish. Pay is a ceiling only (no salary min).
 *
 * Dev:  `npm run db:seed:job:vv-placement-hr-recruiter-sembakkam`
 * Live: `npm run db:seed:job:vv-placement-hr-recruiter-sembakkam:live`
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
    "[seed-job-vv-hr] Live target DB host:",
    hostMatch?.[1] ?? "(unparsed)",
  );
}

const db = drizzle(neon(url), { schema });

const EMPLOYER_SLUG = "vv-placement-services";
const EN_SLUG = "hr-recruiter-10-vacancies-sembakkam-chennai";
/** Tamil script in the address bar; stored percent-encoded for route-param matching. */
const TA_SLUG_UNICODE =
  "எச்ஆர்-ரெக்ரூட்டர்-10-காலியிடம்-செம்பாக்கம்-சென்னை";
const TA_SLUG = encodeURIComponent(TA_SLUG_UNICODE);

const publishedAt = new Date();
const expiresAt = new Date(publishedAt);
expiresAt.setDate(expiresAt.getDate() + 50);
const applyBy = new Date(publishedAt);
applyBy.setDate(applyBy.getDate() + 90);

const EN_TITLE =
  "HR recruiter — 10 vacancies in Sembakkam | up to ₹15,000 a month | female candidates & freshers welcome, immediate joining | VV Placement Services · 91767 97745";

const EN_BODY = `HR recruiter role in Sembakkam: 10 vacancies, up to ₹15,000 a month. VV Placement Services. Female candidates and freshers can apply; immediate joining needed. Call or WhatsApp 91767 97745.

VV Placement Services is filling an HR recruiter opening in Sembakkam, Chennai. Ten seats are available. Pay is capped at ₹15,000 a month (a ceiling only — no minimum figure was shared). Female candidates can apply, and freshers can apply too. Immediate joiners are needed. Full street address was not provided for this listing.

## Role

- **HR recruiter**

## Who can apply

- Female candidates can apply (this is not a women-only role, and the employer has not said men are barred)
- Freshers can apply
- Immediate joiners needed

## Pay

- **Up to ₹15,000 a month** (ceiling only; no salary floor was stated)

## Location and arrangement

- **Area:** Sembakkam, Chennai
- Street address: not given — confirm the work site when you call

## How to apply

Call or WhatsApp **91767 97745**. Applications stay open for **90 days** from the publish date on this page. This listing is set to leave the public jobs board after **50 days**.

---

*Advertiser-submitted community listing. Confirm pay, joining date, and work site with VV Placement Services before you travel or share documents.*`;

const EN_FAQ = {
  items: [
    {
      q: "Who can apply for this HR recruiter role?",
      a: "Female candidates can apply, and freshers can apply. Immediate joiners are needed. The notice does not say the role is women-only, and it does not say men are barred.",
    },
    {
      q: "How many vacancies are open?",
      a: "There are 10 vacancies for the HR recruiter role in Sembakkam.",
    },
    {
      q: "What does “up to ₹15,000” mean?",
      a: "Pay is capped at ₹15,000 a month. That is a ceiling only — no minimum salary was stated on this listing. Confirm the offered amount with VV Placement Services.",
    },
    {
      q: "Who is hiring and where is the work?",
      a: "VV Placement Services is hiring for work in Sembakkam, Chennai. A street address was not provided.",
    },
    {
      q: "How do I apply?",
      a: "Call or WhatsApp 91767 97745. You can also use the Apply via WhatsApp button on this page.",
    },
  ],
};

const TA_TITLE =
  "எச்ஆர் ரெக்ரூட்டர் — செம்பாக்கத்தில் 10 காலியிடங்கள் | மாதம் அதிகபட்சம் ₹15,000 | பெண் விண்ணப்பதாரர்கள் மற்றும் புதியவர்களும் விண்ணப்பிக்கலாம், உடனடியாகப் பணியில் சேரக்கூடியவர்கள் தேவை | VV Placement Services · 91767 97745";

const TA_BODY = `செம்பாக்கத்தில் எச்ஆர் ரெக்ரூட்டர் பதவி: 10 காலியிடங்கள், மாதம் அதிகபட்சம் ₹15,000. VV Placement Services. பெண் விண்ணப்பதாரர்கள் விண்ணப்பிக்கலாம்; புதியவர்களும் விண்ணப்பிக்கலாம்; உடனடியாகப் பணியில் சேரக்கூடியவர்கள் தேவை. அழைக்க / WhatsApp: 91767 97745.

VV Placement Services, செம்பாக்கம், சென்னையில் எச்ஆர் ரெக்ரூட்டர் பதவிக்கு ஆட்களைத் தேடுகிறது. 10 காலியிடங்கள் உள்ளன. ஊதியம் மாதம் அதிகபட்சம் ₹15,000 — இது உச்ச வரம்பு மட்டுமே; குறைந்தபட்சத் தொகை இங்கே சொல்லப்படவில்லை. பெண் விண்ணப்பதாரர்கள் விண்ணப்பிக்கலாம். புதியவர்களும் விண்ணப்பிக்கலாம். உடனடியாகப் பணியில் சேரக்கூடியவர்கள் தேவை. தெரு முகவரி கொடுக்கப்படவில்லை.

## பதவி

- **எச்ஆர் ரெக்ரூட்டர்**

## யார் விண்ணப்பிக்கலாம்

- பெண் விண்ணப்பதாரர்கள் விண்ணப்பிக்கலாம் (இது பெண்களுக்கு மட்டும் என்று சொல்லப்படவில்லை; ஆண்கள் தடை என்றும் சொல்லப்படவில்லை)
- புதியவர்களும் விண்ணப்பிக்கலாம்
- உடனடியாகப் பணியில் சேரக்கூடியவர்கள் தேவை

## ஊதியம்

- **மாதம் அதிகபட்சம் ₹15,000** (உச்ச வரம்பு மட்டும்; குறைந்தபட்சம் குறிப்பிடப்படவில்லை)

## இடம்

- **பகுதி:** செம்பாக்கம், சென்னை
- தெரு முகவரி இல்லை — அழைக்கும்போது பணியிடத்தை உறுதிப்படுத்துங்கள்

## விண்ணப்பிக்கும் முறை

**91767 97745** என்ற எண்ணில் அழைக்கவும் அல்லது WhatsApp அனுப்பவும். இந்தப் பக்கம் வெளியிடப்பட்ட நாளிலிருந்து **90 நாட்கள்** வரை விண்ணப்பங்கள் ஏற்கப்படும். பொது வேலைப் பட்டியலில் இருந்து இந்த அறிவிப்பு **50 நாட்களுக்குப்** பிறகு நீக்கப்படும்.

---

*சமூகப் பக்கத்தில் விளம்பரதாரர் சமர்ப்பித்த அறிவிப்பு. பயணம் செய்வதற்கு முன் அல்லது ஆவணங்களைப் பகிர்வதற்கு முன் ஊதியம், சேரும் தேதி, பணியிடத்தை VV Placement Services-இடம் உறுதிப்படுத்துங்கள்.*`;

const TA_FAQ = {
  items: [
    {
      q: "இந்த எச்ஆர் ரெக்ரூட்டர் பதவிக்கு யார் விண்ணப்பிக்கலாம்?",
      a: "பெண் விண்ணப்பதாரர்கள் விண்ணப்பிக்கலாம். புதியவர்களும் விண்ணப்பிக்கலாம். உடனடியாகப் பணியில் சேரக்கூடியவர்கள் தேவை. இது பெண்களுக்கு மட்டும் என்று சொல்லப்படவில்லை; ஆண்கள் தடை என்றும் சொல்லப்படவில்லை.",
    },
    {
      q: "எத்தனை காலியிடங்கள் உள்ளன?",
      a: "செம்பாக்கத்தில் எச்ஆர் ரெக்ரூட்டர் பதவிக்கு 10 காலியிடங்கள் உள்ளன.",
    },
    {
      q: "“மாதம் அதிகபட்சம் ₹15,000” என்றால் என்ன?",
      a: "ஊதியம் மாதம் ₹15,000-க்கு மேல் இல்லை என்பதே உச்ச வரம்பு. குறைந்தபட்சத் தொகை இங்கே குறிப்பிடப்படவில்லை. உண்மையான சலுகையை VV Placement Services-இடம் உறுதிப்படுத்துங்கள்.",
    },
    {
      q: "யார் நியமிக்கிறார்கள்? பணியிடம் எங்கே?",
      a: "VV Placement Services, செம்பாக்கம், சென்னையில் பணிக்கு ஆட்களைத் தேடுகிறது. தெரு முகவரி கொடுக்கப்படவில்லை.",
    },
    {
      q: "எப்படி விண்ணப்பிப்பது?",
      a: "91767 97745 என்ற எண்ணில் அழைக்கவும் அல்லது WhatsApp செய்யவும். இந்தப் பக்கத்தில் உள்ள WhatsApp பொத்தானையும் பயன்படுத்தலாம்.",
    },
  ],
};

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
    locationLabel: "Sembakkam, Chennai",
    salaryMin: null as number | null,
    salaryMax: 15_000,
    salaryDisclosed: true,
    remotePolicy: "onsite",
    openingsCount: 10,
    status: "open" as const,
    featured: false,
    contactPhone: "9176797745",
    contactEmail: null as string | null,
    locale: opts.locale,
    alternateSlug: opts.alternateSlug,
    jobBenefits: null as string | null,
    publishedAt,
    expiresAt,
    applyBy,
    faqJson: opts.faqJson,
    moderationNotes:
      opts.locale === "en-IN"
        ? "hr-recruiter sembakkam; ceiling-only pay; auto-takedown 50d; apply-by 90d"
        : "ta twin of hr-recruiter-10-vacancies-sembakkam-chennai; auto-takedown 50d; apply-by 90d",
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
  console.log("expiresAt (50d):", expiresAt.toISOString());
  console.log("applyBy (90d):", applyBy.toISOString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
