# Feature map — legacy patterns → mynanganallur v1

Legend: **P0** ship first, **P1** next, **Later** backlog.

| Capability | Legacy inspiration | P0/P1 | Notes |
|------------|-------------------|-------|--------|
| Article publishing | DB `articles` + slug URLs | **P0** | Single pipeline; no static-PHP hybrid. |
| Topic / category taxonomy | `category`, tags in articles | **P0** | Indexed for SEO and filters. |
| Events listing + detail | `event_listings`, status filters | **P0** | City-scoped; locality as filter. |
| Event submission | Public post flow | **P1** | Moderation queue required. |
| Jobs browse + detail | `job_postings`, employers | **P0** | Structured salary, experience, remote. |
| Employer accounts | Employers table + plans | **P1** | Auth + plan caps in Postgres. |
| Job applications | `job_applications` uniqueness | **P1** | Dedupe by user + job. |
| Unified directory | Multiple `omr_*` tables | **P1** | One extensible model (`directory_entries` or typed tables). |
| Buy/sell | `omr_buy_sell_*` | **P1** | Images JSON → structured media table preferred. |
| Classifieds | `omr_classified_ads_*` | **Later** | Expiry + reports + optional OTP. |
| Property (hostels / rent / coworking) | Module pattern | **Later** | Same listing core with `vertical` enum. |
| GA4 in app | gtag + optional Data API | **P1** | Measurement ID in env; Data API for internal dashboards only. |
| Elections / campaign hubs | `elections-2026` | **Later** | Only if editorial priority. |

## Explicitly out of v1

- Corridor-only IA and copy.
- cPanel cron PHP scripts — use Vercel Cron or queue worker when needed.

## Implementation status (this repo)

| Area | Status |
|------|--------|
| Infra docs + CI + Auth.js + analytics instrumentation | Done — see [DEPLOY.md](DEPLOY.md), [EXECUTION_ROADMAP.md](EXECUTION_ROADMAP.md) |
| GitHub remote / Vercel project / Neon / DNS / GA property / GSC | **You** complete using DEPLOY.md (browser steps) |
| Articles MVP, events, jobs, directory UI | Not started — Phase 1+ in EXECUTION_ROADMAP |
