# Project update log

Reverse-chronological notes on meaningful changes (deployments, data, infra, major features).

---

## 2026-06-22 — Open to Work (job seeker profiles)

- **Routes:** `/careers/open-to-work` (hub), `/careers/open-to-work/[slug]` (profile), `/submit/open-to-work` (public submit), `/admin/open-to-work/[id]` (moderation edit).
- **Data:** New table `open_to_work_profiles` — migration `drizzle/0008_open_to_work_profiles.sql`. Seed Lakshmipriya: `npm run db:seed:open-to-work:lakshmipriya:live` (after applying migration).
- **UX:** Jobs board stays employer-only; cross-links between `/jobs` and Open to Work. Profiles expire 90 days after approval. Nav + Nanganallur Connect tile added.

---

- **Directory verticals:** `/directory/{type}` is now the canonical path (matches sitemap `loc`). Old `?type=` URLs 301 to path; `/directory/business` → `/directory/industry`.
- **Canonical helper:** `src/lib/seo/canonical-url.ts`, `buildPageMetadata` for form/utility pages; area hubs + submit flows wired.
- **Sitemap:** Added `/nanganallur-connect`; removed `/search` (noindex) and `/news` (redirect). `www` → apex redirect in `next.config.ts`.
- **Docs:** [SEO_ENGINE_PLAN.md](./SEO_ENGINE_PLAN.md), [SEARCH_CONSOLE.md](./SEARCH_CONSOLE.md) updated. After deploy, re-submit sitemap in GSC.

---

- **Route:** `/nanganallur-connect` — locality hub with GEO block, action grid, live DB snapshots (news/jobs/events/properties), area map, living guide, FAQ + JSON-LD. Redirects: `/connect`, `/nanganallur`, `/about-nanganallur` → canonical.
- **Code:** `src/lib/nanganallur-connect-content.ts`, `src/app/(public)/nanganallur-connect/page.tsx`, footer + nav links, sitemap priority 0.92.

---

## 2026-06-16 — Live property: 2.5 BHK flat for resale (Madipakkam)

- **Data:** Seeded **2.5 BHK flat for resale** in **Madipakkam** (`slug` `sale-2-5bhk-east-facing-flat-madipakkam`). **989 sq ft** built-up, **545 sq ft** UDS, east-facing, 2nd floor, covered parking, 13-year building. Price on enquiry. Direct owner — contact **9840757356**.
- **Code:** `scripts/seed-property-madipakkam-2-5bhk-flat.ts` (+ npm scripts `db:seed:property:madipakkam-2-5bhk-flat` / `:live`).

---

## 2026-06-14 — Live job: Preschool teacher (Madipakkam)

- **Data:** Seeded open role **Preschool teacher — Madipakkam** (`slug` `preschool-teacher-madipakkam-branch`, employer `preschool-madipakkam-branch`). Full details on call. Contact **89391 43111** (Call / WhatsApp apply).
- **Code:** `scripts/seed-job-preschool-madipakkam.ts` (+ npm scripts `db:seed:job:preschool-madipakkam` / `:live`).

---

## 2026-06-14 — Directory: Jhoola Play Membership (Ram Nagar)

- **Data:** Seeded **Jhoola Play Membership** at Jhoola Activity Centre, Ram Nagar (`slug` `jhoola-play-membership-nanganallur`, type `industry`). Screen-free play space for children — books, board games, art, craft, and open-ended materials. Membership from **1 July 2026**; two tiers, members-only WhatsApp coordination, online balance tracking, and guest drop-in option. Early bird offers — contact **91765 83618**.
- **Code:** `scripts/seed-directory-jhoola-play-membership.ts` (+ npm scripts `db:seed:directory:jhoola-play-membership` / `:live`).

---

## 2026-06-12 — Listing pages mobile-first retrofit (properties, jobs, events, directory)

- **UI:** Shared `src/components/listings/*` — hub shell, GEO blocks, filter chips, mobile listing cards, sticky Call/WhatsApp/Apply bars, responsive ad slots (`320×50` mobile / `728×90` desktop).
- **Hubs:** `/properties` (rent/sale tabs), `/jobs` (work-mode chips), `/local-events` (when chips), `/directory` (type tabs + search). Hub FAQ + `CollectionPage` + breadcrumb JSON-LD.
- **Details:** Property/job/event/directory detail pages — breadcrumbs, GEO direct answers, auto-FAQ when `faqJson` empty, mobile sticky actions. Jobs keep desktop sidebar; mobile gets “At a glance” + bottom Apply bar.
- **SEO:** `buildHubMetadata` canonical/OG on all four hubs; `speakable` on property/job JSON-LD.

---

## 2026-06-12 — Live property: independent house, Ullagaram (Muruga temple)

- **Data:** Seeded **independent house with land for sale** near **Muruga temple, Ullagaram** (`slug` `sale-independent-house-ullagaram-muruga-temple-nanganallur`). **1,500 sq ft** plot, **900 sq ft** built-up; price on enquiry. Contact **9840577956**.
- **Code:** `scripts/seed-property-ullagaram-muruga-temple-house.ts` (+ npm scripts `db:seed:property:ullagaram-muruga-temple-house` / `:live`).

---

## 2026-05-10 — Live job: SKB Vidhyashram Playschool (Madipakkam)

- **Data:** Seeded open roles **Principal** and **Teacher (part-time)** at **SKB Vidhyashram Playschool, Madipakkam** (`slug` `skb-vidhyashram-principal-teacher-part-time-madipakkam`, employer `skb-vidhyashram-madipakkam`). Apply before **30 May 2026**; **openings_count** 2. Contact: **skbmadipakkam@gmail.com**, WhatsApp primary **6380383563**, campus line **9962187719** in listing body as `tel:` link.
- **Code:** `scripts/seed-job-skb-vidhyashram-madipakkam.ts` (+ npm scripts `db:seed:job:skb-vidhyashram-madipakkam` / `:live`).

---

## 2026-05-06 — Partner ads refresh, job WhatsApp privacy, build health

- **Display ads (Tier 1 + 2):** Partner cards use a tinted **icon rail** (or top “roof” on rectangles), **pill CTAs**, and stronger type scale. Creatives may set optional **`heroImageUrl` / `heroImageAlt`** for `728×90`, `336×280`, `300×250` (rendered with `next/image`). **`mynanganallur-1`** uses `/home-hero-scene.png` as a sample. **`next.config.ts`:** `images.remotePatterns` extended for partner hosts (ResumeDoctor, BSERI, Colourchemist, mynanganallur).
- **Jobs / privacy:** Sidebar and in-copy apply use **`/jobs/[slug]/apply-whatsapp`** (server `302` to WhatsApp, `X-Robots-Tag: noindex, nofollow`). Personal assistant seeds: body without visible phone digits; **`remotePolicy`** `online, weekly meet`; JobPosting JSON-LD treats **`online`** like remote for schema.
- **Build:** **`npm run build`** failed TypeScript on a **corrupted** `node_modules/googleapis/.../androidpublisher/v3.d.ts` (file contained junk, not declarations). **Fix:** remove `node_modules/googleapis` and **`npm install googleapis@169.0.0`** (or a clean **`npm ci`**). Verified **`npm run build`** completes after reinstall.

---

## 2026-05-05 — Live job: Accounts candidate (GST/TDS, Zoho preferred)

- **Data:** Seeded open job **Accounts candidate (GST/TDS filing) - Immediate joiners** (`slug` `accounts-candidate-gst-tds-zoho-nanganallur`, employer `s-manoharan`) via `npm run db:seed:job:manoharan-accounts:live`.
- **Compensation:** Published CTC range **₹4.80-₹5.50 lakhs per annum** with immediate joining note and contact **+91 63803 51319**.
- **Code:** `scripts/seed-job-manoharan-accounts.ts` (+ npm scripts `db:seed:job:manoharan-accounts` / `:live`).

---

## 2026-05-06 — Live job: Personal Assistant (Part-Time / Flexible) — Nanganallur copy

- **Data:** Seeded localized open job **Personal Assistant (Part-Time / Flexible) — Nanganallur** (`slug` `personal-assistant-part-time-flexible-nanganallur`, employer `direct-hire-nanganallur`) via `npm run db:seed:job:personal-assistant-nanganallur:live`.
- **Localization:** Updated title/body/location wording for Nanganallur audience while retaining original role details.
- **Application path:** Kept **WhatsApp-only** apply flow with **+91 72001 01497**.
- **Code:** `scripts/seed-job-personal-assistant-nanganallur.ts` (+ npm scripts `db:seed:job:personal-assistant-nanganallur` / `:live`).

---

## 2026-05-06 — Live job: Personal Assistant (Part-Time / Flexible)

- **Data:** Seeded open job **Personal Assistant (Part-Time / Flexible) — Chennai OMR** (`slug` `personal-assistant-part-time-flexible-omr`, employer `direct-hire-chennai-omr`) via `npm run db:seed:job:personal-assistant-omr:live`.
- **Application path:** Set to **WhatsApp-only** in listing content and contact details using **+91 72001 01497**.
- **Code:** `scripts/seed-job-personal-assistant-omr.ts` (+ npm scripts `db:seed:job:personal-assistant-omr` / `:live`).

---

## 2026-05-03 — Live job: MyFirstStep (Puzhuthivakkam / Sholinganallur)

- **Data:** Seeded open job **Kindergarten teacher & support staff — MyFirstStep** (`slug` `myfirststep-kindergarten-teacher-support-staff`, employer `myfirststep`) via `npm run db:seed:job:myfirststep:live`.
- **Code:** `scripts/seed-job-myfirststep.ts` (+ npm scripts `db:seed:job:myfirststep` / `:live`).
- **Jobs UI:** ResumeDoctor **468×60** horizontal strip on `/jobs` and `/jobs/[slug]` (`jobs-posting-468` ad slot, `src/ads/`).

---

## 2026-03-31 — Jobs, directory public pages, article FAQ JSON-LD, admin revalidate

- **Jobs:** `src/domains/jobs/`, `/jobs` + `/jobs/[slug]` with **JobPosting** JSON-LD; home spotlight from DB; `npm run db:seed:jobs` (+ `:live`).
- **Directory:** `/directory` lists seeded `directory_entries` by type; `/directory/[type]/[slug]` with LocalBusiness-style JSON-LD; sitemap entries.
- **News AEO:** `articles.faq_json` column (see `drizzle/0002_article_faq_json.sql` or `db:ensure:faq-column`); visible FAQ + FAQPage when set; sample Q&A on power-cuts article via `db:seed` upsert.
- **Admin:** `revalidatePublicContentAction` + button for editor/admin after DB changes.

---

## 2026-03-31 — Home hero updated with provided images

- **UI:** Updated `HomeHero` to use your provided images:
  - `c9admin.cottage9.com/uploads/5581/nanganallur-anjaneya.jpg` as the oval portrait
  - `upload.wikimedia.org/.../Streets_in_Nanganallur%2CChennai.jpg` as the right-panel background texture
- **Config:** Updated `next.config.ts` `images.remotePatterns` to allow those remote images for `next/image`.
- **Verification:** `npm run build` succeeded after the changes.

---

## 2026-03-31 — Live events DB: Thirumurai Music Journey seed

- **Data:** Inserted production event **திருமுறை இசைப் பயணம் (Thirumurai Music Journey)** for city `nanganallur`, slug `thirumurai-music-journey-sb-padmanathan` (online Zoom/Google Meet; contact +91 93613 85463).
- **Code:** Added `scripts/seed-event-thirumurai-music.ts` and npm script `db:seed:event:thirumurai:live` (idempotent: skips if slug already exists for the city).
- **Infra:** Confirmed production DB is **Neon** (`DATABASE_URL`); no new DB provisioning this session. Vercel should continue to expose the same pooled `DATABASE_URL` (see `docs/DEPLOY.md`).

---

*(Add new entries above this line.)*
