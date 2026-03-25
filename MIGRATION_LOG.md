# Migration log — mynanganallur.in

Living record of intelligence extraction and implementation. Update as the platform evolves.

## 2026-03-23 — Initial extraction and scaffold

### Discovered (reference: `E:\OneDrive\_myomr\_Root`)

- Procedural PHP + MySQL site with **Apache `.htaccess`** routing, **per-module sitemaps**, and a **master sitemap index** (`generate-sitemap-index.php`).
- **Core patterns:** `core/include-path.php`, `components/meta.php` (canonical + OG + Organization + SiteNavigationElement JSON-LD), `core/site-navigation.php` hub links, `articles` routed via `local-news/article.php`.
- **Major modules:** local news, events (`event_listings`), jobs (`job_postings`, `employers`, `job_applications`), directories (`omr-listings` + multiple MySQL tables), buy/sell, classifieds, property verticals, elections micro-sites, pentahive SEO hub.
- **Migrations in repo** define buy/sell, classifieds, rent/lease, employer pack columns, job schema upgrades, directory indexes, admin audit log.
- **Operational docs:** `LEARNINGS.md`, `AGENTS.md`, `docs/` hub (PRDs, SEO, data-backend), `docs/operations-deployment/TODO.md` (legacy debt notes).
- **Automation:** Classifieds expiry cron documented in module README; GA4 Data API for admin reporting; dev-tools insert/research scripts.

### Transformed (into this repo)

- **`MIGRATION_ANALYSIS.md`** — fourteen-section audit, classification table, Nanganallur positioning, risk register.
- **`docs/`** — 12 design documents (PRD through execution roadmap).
- **Next.js scaffold:** `src/app/(public)/` home, `src/app/admin/` placeholder, `sitemap.ts`, `robots.ts`, root metadata.
- **Neon + Drizzle:** `drizzle.config.ts`, `src/db/client.ts`, `src/db/schema/tables.ts` (cities, users, articles, events, employers, job_postings, directory_entries), `drizzle/0000_init.sql` generated.
- **Domain stubs:** `src/domains/{news,events,jobs,directory,listings}/index.ts`.
- **`.env.example`** — `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`.
- **`.gitignore`** — allow `!.env.example`.

### Dropped (not ported)

- OMR branding, corridor copy, legacy URLs, media, and locality data.
- PHP include graph, cPanel-only deployment assumptions, `.htaccess` rewrites as application structure.
- Monolithic homepage coupling pattern (direct requires of multiple marketplace modules).

### Redesigned

- **Routing:** App Router + segment layout; admin at `/admin` (not route-group collision with `/`).
- **Data:** Postgres enums + UUIDs + FKs; `city_id` on scoped entities; unified `directory_entries` with `type` enum (vs many parallel PHP templates).
- **SEO:** Next `MetadataRoute` sitemap/robots; `generateMetadata` pipeline to be added per route in Phase 1.
- **Caching:** Documented ISR/cache tags in `docs/TECH_ARCHITECTURE.md` (implementation in later phases).

### Next actions

- Apply migration to Neon: `DATABASE_URL=... npm run db:push` (or `db:migrate` after configuring migrations).
- Implement Phase 1 from `docs/EXECUTION_ROADMAP.md` (articles MVP).

## 2026 — Operations plan implementation (code + docs)

### Added

- **Auth.js:** `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/db/schema/auth.ts` (user/account/session/verificationToken), `src/middleware.ts` (cookie gate for `/admin`), `src/app/admin/actions.ts` (sign out).
- **Analytics:** `src/components/analytics-scripts.tsx` (GA4), `@vercel/analytics` + `@vercel/speed-insights` in root layout.
- **CI:** `.github/workflows/ci.yml` (lint + build with `AUTH_SECRET` / `AUTH_URL`).
- **Docs:** `docs/DEPLOY.md`, `docs/SEARCH_CONSOLE.md`.
- **Env:** `.env.example` extended (`AUTH_*`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`).

### Requires manual steps (see `docs/DEPLOY.md`)

- Create GitHub remote and push; import project on Vercel; set env vars; Neon `DATABASE_URL`; BigRock DNS; GA4 + GSC verification; OAuth client IDs in Google/GitHub.
