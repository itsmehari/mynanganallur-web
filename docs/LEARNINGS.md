# Learnings — mynanganallur-web

Operational and engineering notes for this repo (Next.js app + Postgres/Neon + Drizzle). Append dated or topical sections as you go.

---

## Database and production (Neon + Vercel)

- **Connection:** Runtime and migrations use `DATABASE_URL` (Postgres). Production is **Neon**; use the **pooled** URL on serverless (Vercel). Details: `docs/DEPLOY.md`, `docs/DATA_STRATEGY.md`.
- **Local live targeting:** Scripts that accept `--live` load `.env.production.local` (e.g. from `vercel env pull`). Never commit secrets; `.env*` is gitignored except `.env.example`.
- **Schema tool:** `npm run db:push` (dev) / `npm run db:push:live` (uses `.env.production.local`).

## Seeding content

- **City:** Site city slug is `nanganallur`. If inserts fail with “city not found”, run `npm run db:seed:live` (articles seed also ensures the city).
- **Events:** Pattern is idempotent **per (city_id, slug)** — see `scripts/seed-event-panguni.ts`. Copy that file for new one-off events: Drizzle + `@neondatabase/serverless`, `--live` vs `.env.local`.
- **Thirumurai event:** `scripts/seed-event-thirumurai-music.ts` — `npm run db:seed:event:thirumurai:live`. Re-runs are safe (existing slug skipped).
- **Other seeds:** `db:seed:live`, `db:seed:directory:live`, `db:seed:event:panguni:live` in `package.json`.
- **2026-11-01:** Male office assistant, Guindy Race Course (individual employer, no company name) — `db:seed:job:male-office-assistant-guindy-race-course(:live)` → `/jobs/male-office-assistant-guindy-race-course`. Twin: https://mychennaicity.in/chennai-jobs/male-office-assistant-guindy-race-course.
- **2026-11-04:** Daytime co-working / desk space for rent goes through **property listings** (`kind: rent`), not directory — no branded venue name, weekly/monthly tenure. Example: `db:seed:property:coworking-hindu-colony(:live)` → `/properties/rent-coworking-hindu-colony-nanganallur`. Leave `rentPerMonth` null when the advertiser did not quote a figure; put hours and amenities in `body` + `faqJson`.
- **2026-11-04:** Admin executive, Vaulta Renewables Pvt Ltd — `db:seed:job:vaulta-renewables-admin-executive(:live)` → `/jobs/admin-executive-vaulta-renewables-puzhuthivakkam`. Hiring note spelled the area **Puzhivatham**; store locality as **Puzhuthivakkam** and keep the printed spelling in the body. “Salary as per market standards” → `salaryDisclosed: false`.
- **2026-11-19:** Pulikachal.com multi-role note (no phone or email on the poster) — one listing, `openingsCount: 6`, `db:seed:job:pulikachal(:live)` → `/jobs/pulikachal-finance-billing-sales-nanganallur`. Apply path uses the public site contact (`contactus@pulikachal.com`) and the Nanganallur store line from pulikachal.com (`9150152751`). Say in the body that those contacts were not printed on the note.
- **2026-11-22:** A hall or caterer outside Nanganallur still goes in the **business directory** (`type: industry`, public alias `/directory/business/…`) when the user asks for a business listing. Keep `localityLabel` as the real area (example: West Mambalam) and say in the body that the venue is not in Nanganallur. Street address missing from a flyer can be taken from the site the flyer itself links, and called out as such. If the flyer phone and the site phone differ by a digit, publish the number that appears on both, and note the mismatch. Example: `db:seed:directory:sri-srinivasa-jayendhira(:live)` → `/directory/industry/sri-srinivasa-hall-jayendhira-catering`.
- **2026-11-22:** News + event can share one slug across tables. `categoryToTopicSlug` strips non-ASCII, so a Tamil `articles.category` links to an empty topic and 404s — store a mapped English desk (`Local`) and keep Tamil in title, dek, and body. Eye camp: `db:seed:eye-camp-t-nagar(:live)`.
- **2026-11-22:** Post-event sports coverage is an **article** (not a scheduled event). Put photos in `public/news/`, set `heroImageUrl`, and embed extras as `![caption](/news/…)` — `ArticleProse` renders those figures. Attribute winners to the tip source when the official results sheet is not attached. Example: `db:seed:article:srison-yogasana-2026(:live)`.

## Events model (Drizzle)

- Table `events`: `city_id`, `slug` (unique per city), `title`, `description`, `starts_at` (required), optional `ends_at`, `venue_*`, `locality_label`, `status` (`draft` | `scheduled` | `cancelled` | `completed`), `featured`, `all_day`.
- Ongoing or open-ended programs: pick a clear **starts_at** (e.g. enrollment window or cohort start); `ends_at` may be `null`. Adjust in seed or DB if marketing needs a specific date.

## Shell / Windows

- **PowerShell:** Older versions do not treat `&&` as a command separator; use `Set-Location …; npm run …` or separate lines.

## Next.js Image remote patterns

- When using `next/image` with remote URLs, ensure `next.config.ts` sets `images.remotePatterns` for the image host/path.
- For “hero background” textures behind other UI, use `fill` + `object-cover` with an opacity layer so gradients/overlays remain readable.

---

*(Append below or add new `##` sections.)*
