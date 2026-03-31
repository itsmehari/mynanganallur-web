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
