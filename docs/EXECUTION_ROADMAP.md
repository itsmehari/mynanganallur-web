# Execution roadmap

## Phase 0 — Foundation (complete with scaffold)

- Repo layout: `src/app/(public)`, `src/app/admin`, `src/db`, `src/domains`
- Drizzle schema + `drizzle.config.ts`; `.env.example`
- `sitemap.ts`, `robots.ts`; minimal layouts
- Auth.js (NextAuth v5) + Drizzle adapter; cookie-based middleware for `/admin`
- GA4 script (env), Vercel Analytics + Speed Insights; CI workflow (`.github/workflows/ci.yml`)
- Operations: [docs/DEPLOY.md](DEPLOY.md) (GitHub, Vercel, Neon, BigRock DNS, GA, OAuth), [docs/SEARCH_CONSOLE.md](SEARCH_CONSOLE.md)
- Documentation: `MIGRATION_ANALYSIS.md`, `docs/*`, `MIGRATION_LOG.md`

## Phase 1 — Content MVP

- Articles: schema, admin CRUD, public index + detail, `generateMetadata`, JSON-LD
- Home: cached article list

## Phase 2 — Engagement

- Events: schema, listing, detail, submission + moderation
- Jobs: schema, listing, detail; employer auth **or** manual entry first

## Phase 3 — Listings

- Directory vertical (unified or typed tables)
- Buy/sell or classifieds (pick one vertical to reduce scope)

## Phase 4 — Hardening

- Rate limits on public forms, spam controls
- Search (Postgres full-text or external provider — TBD)
- Performance audit and cache tuning

## Dependencies

- Neon project + `DATABASE_URL` on Vercel
- Domain DNS for mynanganallur.in
- Search Console / GA4 properties for new brand

## Exit criteria per phase

- Phase 1: LCP acceptable on news detail; sitemap lists article URLs
- Phase 2: Event publish flow audited; no orphan drafts in index
- Phase 3: Listing expiry job documented and running
