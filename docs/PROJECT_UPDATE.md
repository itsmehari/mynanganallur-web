# Project update log

Reverse-chronological notes on meaningful changes (deployments, data, infra, major features).

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
