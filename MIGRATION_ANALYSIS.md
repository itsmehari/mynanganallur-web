# Migration analysis: legacy local portal → mynanganallur.in

**Source:** Read-only audit of reference tree `E:\OneDrive\_myomr\_Root` (MyOMR-style PHP/MySQL codebase, March 2026 snapshot).  
**Target:** Greenfield platform in `E:\OneDrive\_mynanganallur` (Next.js App Router, Neon Postgres, Vercel).  
**Rule:** Extract **intelligence and patterns only**—no copying of branding, OMR-specific content, media, slugs, or locality data.

**Assumptions:** Production MySQL may contain tables/columns not present in repo migrations; behavior inferred from code paths where possible. Items marked **(assumption)** are not fully proven by repo files alone.

---

## 1. Product intent

**What the legacy system is trying to achieve**

- **Hyperlocal community + discovery** for a defined corridor (historically OMR): combine **editorial news**, **events**, **jobs** (with employer-side tooling), **business/place directories**, **peer marketplaces** (buy/sell, classifieds), and **property-style listings** (hostels/PG, rent/lease, coworking).
- **Traffic and trust:** SEO-first public pages (canonical URLs, sitemaps, JSON-LD), analytics (GA4 + Clarity; optional GA4 Data API for admin reporting), and operational docs for Search Console / sitelinks.
- **Monetization / B2B (partial):** Employer-pack style caps and featured placement for jobs (see migrations and `AGENTS.md`).
- **Ops on shared hosting:** Procedural PHP, MySQL, Apache rewrites, cPanel deployment, remote MySQL for migrations.

**mynanganallur reframing:** Same **category** of product (city-scale local news + discovery + listings) but **Chennai-wide** first, with **multi-city** readiness in data model—not a corridor microsite.

---

## 2. Feature inventory

### Active features (evidence: routes, DB, admin)

| Area | Features |
|------|----------|
| **News** | DB-driven articles (`articles` table via `local-news/article.php`), slug URLs; some legacy static PHP article files; homepage news components; admin news CRUD. |
| **Events** | `event_listings` with statuses `scheduled`/`ongoing`; category, locality, venue routes; public submission; featured events; admin under `admin/events*` and `omr-local-events/admin`. |
| **Jobs** | `job_postings`, `employers`, `employers` plan columns (employer pack), `job_applications` with unique constraint migration; job detail slug URLs; employer registration/posting flows. |
| **Directories** | Banks, hospitals, schools, parks, industries, government offices, ATMs, restaurants, IT companies, IT parks—list + detail by slug (`omr-listings/*`, clean URLs in root `.htaccess`). |
| **Marketplaces** | Buy/sell (`omr_buy_sell_*`), classified ads (`omr_classified_ads_*`) with reports, OTP/linking migrations (2026-03-21). |
| **Property verticals** | Hostels/PGs, rent/lease (`rent_lease_*`), coworking—each with index, sitemap hooks, module admins (per folder structure). |
| **Marketing / discovery** | `discover-myomr/` informational pages; `pentahive/` SEO content area. |
| **Elections** | `elections-2026/`, `election-blo-details/` sitemap entries. |
| **Admin** | Central `admin/` (news, directories, GA4 views, migrations runner); module-scoped admins; session + `requireAdmin()`. |
| **Analytics** | Central `components/analytics.php`; GA4 Data API (`core/ga4-data-api.php`) for server-side reporting. |
| **Sitemaps** | Master index `generate-sitemap-index.php` listing child sitemaps; per-module generators. |

### Partial features

- **Unified directory template:** `docs/operations-deployment/TODO.md` still lists modularizing directory pages and CSS consolidation.
- **Laravel refactor:** Mentioned in TODO; **not** done—codebase remains procedural PHP.
- **`businesses` table:** TODO references missing/broken `businesses` table used from index/news—**possible production error** (verify in ops).
- **Rent/lease in master sitemap index:** Not listed in the excerpt of `generate-sitemap-index.php` (child may live under `sitemap-pages.xml` or omitted—**assumption**: verify).

### Abandoned / legacy / experimental

- **Static news PHP files** alongside DB router: hybrid model; many files under `local-news/` are standalone (legacy pattern).
- **Dev-tools insert scripts** (`dev-tools/insert-*.php`, job research tools): operational one-offs, not product features.
- **Commented `.htaccess` auto_prepend** for error handler: disabled due to hosting hangs.

---

## 3. Module breakdown

| Module | Directory | Role |
|--------|-----------|------|
| **Core** | `core/` | `include-path.php`, `omr-connect.php`, URL helpers, `site-navigation.php` (hub links), `serve-404.php`, analytics config, GA4 API. |
| **Shell** | `components/` | `meta.php`, `nav`, `footer`, `page-bootstrap.php`, `analytics.php`. |
| **News** | `local-news/` | `article.php` router, `generate-sitemap.php`, static legacy articles, indexes. |
| **Events** | `omr-local-events/` | Public listing, filters, `includes/event-functions-omr.php`, admin. |
| **Jobs** | `omr-local-job-listings/` | Index, detail, employer flows, admin, includes. |
| **Directory** | `omr-listings/` | Multi-vertical listings + detail pages. |
| **Buy/sell** | `omr-buy-sell/` | Marketplace + admin. |
| **Classifieds** | `omr-classified-ads/` | Parallel marketplace + cron expiry docs. |
| **Property** | `omr-hostels-pgs/`, `omr-rent-lease/`, `omr-coworking-spaces/` | Each vertical + admin. |
| **Discover** | `discover-myomr/` | Static marketing/info pages. |
| **SEO hub** | `pentahive/` | Content hub. |
| **Elections** | `elections-2026/`, `election-blo-details/` | Micro-sites. |
| **Weblog** | `weblog/` | Contact/support pages. |
| **Admin** | `admin/` + `*/admin/` | CRUD, analytics, migrations. |
| **DevOps / data** | `dev-tools/` | SQL migrations, PHP runners, GA4 snapshot, MCP helpers. |
| **Docs** | `docs/` | PRDs, architecture, SEO, worklogs, `LEARNINGS.md`, `AGENTS.md`. |

---

## 4. File system intelligence

**Key folders**

- **`core/`** — Single source of truth for paths, DB, canonical helpers, 404, navigation graph for JSON-LD.
- **`components/`** — Shared head/meta, analytics, layout; **critical** for SEO consistency.
- **`dev-tools/migrations/`** — Only versioned schema evolution visible in repo; **authoritative** for new tables.
- **`.htaccess` (root)** — **Authoritative routing map** for clean URLs and sitemap routing.

**Hidden-critical files**

- `generate-sitemap-index.php` / `generate-sitemap-pages.php` — SEO entrypoints.
- `core/article-seo-meta.php` — Article SEO (referenced from `article.php`).
- `LEARNINGS.md` — Large consolidated log (engineering, SEO, DB, jobs, events).
- `AGENTS.md` — Current conventions (bootstrap, slug URLs, employer pack, classifieds).
- `docs/data-backend/` — DB and ops context (per `docs/README.md` hub).

---

## 5. Routing and URL patterns

**Mechanism:** Apache `mod_rewrite` in root `.htaccess` (+ optional module `.htaccess`).

**Patterns observed**

- **HTTPS + non-www** canonicalization.
- **Sitemap index** at `/sitemap.xml` → PHP generator; **legacy** `/info/sitemap.xml` → 301 to `/sitemap.xml`.
- **News:** `/local-news/{slug}` → `article.php?slug=` (when not a physical file).
- **Events:** `/omr-local-events/event/{slug}`, `/category/{slug}`, `/locality/{slug}`, `/venue/{slug}`, date hubs (`today`, `weekend`, `month`).
- **Jobs:** `/omr-local-job-listings/job/{id}/{optional-slug}`.
- **Buy/sell & classifieds:** `/listing/{id}/{optional-slug}`, `/category/{slug}`, `/locality/{slug}`.
- **Directories:** Short paths `/banks/`, `/schools/`, … with slug detail `/banks/{slug}`.
- **IT parks:** `/it-parks/sitemap.xml` before slug rule.

**Implication for Next.js:** Replace file-per-route PHP with **App Router dynamic segments**; **one** canonical URL policy in middleware or metadata; sitemap as `app/sitemap.ts` + route segments.

---

## 6. Database intelligence

**Inferred schema (from migrations + code; not exhaustive)**

**Jobs**

- `job_postings`: status (e.g. `approved`), `salary_min`/`salary_max`, `experience_level`, `is_remote`, `openings_count`, legacy `salary_range` retained.
- `employers`: plan columns (`plan_type`, `plan_start_date`, `plan_end_date`), `company_logo`.
- `job_applications`: unique constraint migration (prevent duplicate applications).

**Events**

- `event_listings`: `status IN ('scheduled','ongoing')` for public listings; `featured`; `category_id`, `locality`, `location`, `slug`.

**Marketplaces**

- Buy/sell: `omr_buy_sell_categories`, `omr_buy_sell_sellers`, `omr_buy_sell_listings` (JSON `images`), `omr_buy_sell_reports`.
- Classifieds: `omr_classified_ads_users`, categories, listings (expiry, status enum), reports, phone reveal log; later auth linking + OTP tables.

**Property**

- `rent_lease_owners`, `rent_lease_properties` (listing_type, rent, JSON images).

**Directories**

- Legacy table names: `omrbankslist`, `omrhospitalslist`, `omrschoolslist`, `omrparkslist`, `omr_industries`, `omr_gov_offices`, `omr_atms`, `omr_restaurants`; `omr_it_companies` (`slug`, `locality`, `verified`); featured/submissions tables for IT companies.

**Content**

- `articles`: `slug`, `status = published`, `published_date`, `is_featured`, Tamil exclusion via `slug NOT LIKE '%-tamil'` on homepage (per `LEARNINGS.md`).

**Ops**

- `admin_audit_log`.

**Entity relationships (high level)**

- Employers → job postings; categories → listings (events, buy/sell, classifieds); sellers/users → listings; owners → rent/lease properties.

**Indexing patterns**

- Frequent filters: `status`, `created_at`, `slug`, `locality`, composite `(status, created_at)`.

**Inefficiencies / debt**

- Mixed legacy table naming (`omrbankslist` vs `omr_it_companies`).
- **Hybrid news:** static PHP vs DB—duplicate content risk if not managed.
- **Visibility rules** for articles spread across multiple fields (status, date, featured, slug rules)—easy to misconfigure.

---

## 7. Admin system analysis

**Capabilities**

- Central admin: news, articles subsystem, directory entities, GA4 overview, events, migrations runner, password change.
- **Module admins** for jobs, events, hostels, coworking, buy/sell, rent-lease, classifieds—**distributed** surface area.

**Gaps**

- No single unified RBAC model visible in one file—**pattern** is `requireAdmin()` + per-module checks.
- **Multiple admin UX** patterns increase maintenance cost.

**Scalability issues**

- Session-based PHP admin does not scale horizontally without sticky sessions; shared hosting limits.
- **Audit log** table exists but coverage depends on consistent use (not fully audited per file).

---

## 8. SEO system analysis

**Page generation strategy**

- **Dynamic:** DB queries per request for most hubs (news, jobs, events, directories).
- **Static-ish:** marketing pages as PHP files; sitemaps generated by PHP scripts.

**Strengths**

- Central `meta.php`: canonical, OG/Twitter, default keywords; `meta.php` contract enforced in `LEARNINGS.md`.
- **Organization + SiteNavigationElement** JSON-LD from `site-navigation.php` hub list.
- **Sitemap index** decomposes into module sitemaps (manageable scale).
- **Breadcrumb** JSON-LD when `$breadcrumbs` set.

**Weaknesses**

- **Keyword meta defaults** are OMR-heavy (legacy).
- Heavy **conditional schema** for sports (see `LEARNINGS.md`)—powerful but fragile if not tested.
- **Cache headers** for PHP/HTML set to short TTL in `.htaccess` (5 min default)—good for freshness, limits CDN efficiency for anonymous reads.

---

## 9. Performance observations

- **Homepage:** Multiple queries (jobs, events, buy/sell counts, classifieds if table exists, employer/job counts)—**read amplification**.
- **No unified query layer**—each page includes its own SQL.
- **N+1 patterns** possible in listing pages (not profiled here).
- **Tight coupling:** `index.php` directly requires multiple module `listing-functions.php` files.
- **DB on every request** for dynamic pages—no app-level cache layer in PHP.

---

## 10. Learning extraction (critical)

**What the developer learned (from `LEARNINGS.md`, `AGENTS.md`, `docs/`, migrations)**

- **Canonical + sitemap alignment** is non-negotiable; drift hurts SEO.
- **GA4 measurement ID vs property ID** confusion is a recurring operational trap for Data API.
- **Article visibility** requires explicit status + date + featured + exclusion rules—operational checklist needed.
- **Slug uniqueness** and collision handling (`base-2`) must be systematic.
- **Prepared statements** and `bind_param` discipline—documented pitfalls.
- **Shared hosting constraints** (disabled `auto_prepend`, Apache quirks) drove workarounds.
- **Security:** CSRF, honeypot, rate limits, upload validation—documented as standard.
- **Sitelink strategy:** centralized hub links and footer alignment to reduce nav drift.

**Mistakes / shortcuts**

- TODO lists **Laravel refactor** without delivery—permanent procedural PHP.
- **Mixed news model** (static files + DB) without full deprecation path.
- **businesses** table references in error logs—schema drift.
- **CSS consolidation** incomplete across many files.

**Scalability blockers in legacy stack**

- Monolithic PHP includes, shared hosting, no horizontal scale story for app tier; DB is single MySQL.

---

## 11. Migration classification table

| Feature / module | Classification | Notes |
|-------------------|----------------|-------|
| Editorial news (DB articles) | **REBUILD** | CMS patterns + Chennai-first; no content copy. |
| Static legacy news files | **DROP** (as pattern) | Prefer single content pipeline; migrate selected content manually if ever needed. |
| Events hub | **REBUILD** | City-wide localities; same UX patterns. |
| Jobs + employers | **REBUILD** | Employer packs → **reinterpret** as subscription tiers in Postgres. |
| Job applications | **REBUILD** | Same-flow; unique application per user/job. |
| Directories (multi-vertical) | **REINTERPRET** | Unified `directory` + `type` or separate tables; avoid 8+ parallel PHP templates. |
| Buy/sell | **REBUILD** | Same semantics; fresh schema. |
| Classifieds | **REBUILD** | Expiry + reports + optional auth—reimplement cleanly. |
| Hostels / PG | **REBUILD** | Chennai-wide filters. |
| Rent/lease | **REBUILD** | Same listing types concept. |
| Coworking | **REBUILD** | |
| Discover / marketing pages | **REINTERPRET** | Fewer static pages; editorial + program pages as needed. |
| Pentahive SEO hub | **DEFER** | Evaluate need for separate hub vs topic tags. |
| Elections micro-sites | **DEFER** | Rebuild only when campaign requirements exist. |
| GA4 Data API admin | **REBUILD** | Server-side reporting route; keep env separation for keys. |
| WhatsApp / social CTAs | **REINTERPRET** | City community links (new URLs). |
| **cPanel / .htaccess routing** | **DROP** | Vercel + Next middleware + `next.config` rewrites. |
| **Procedural PHP includes** | **DROP** | App Router + modules. |

---

## 12. What MUST NOT be carried forward

- **OMR-specific** naming, keywords, nav labels, hub paths, and corridor assumptions.
- **Monolithic include graph** and per-page copy-paste SEO.
- **Shared-hosting-only** security (e.g. `php_value` reliance); use platform secrets and env.
- **Fragile salary** parsing as source of truth—structured fields only in new system.
- **Dual news pipelines** (static + DB) without governance.
- **Distributed admin** without RBAC—replace with **one** admin surface + roles.
- **Tight coupling** from homepage to many modules (`require` chains).

---

## 13. Chennai reframing strategy

| Legacy scope | Chennai expansion |
|--------------|-------------------|
| Corridor copy | **City-level** positioning; optional **zones** (e.g. North Chennai, OMR) as **filters**, not brand. |
| Single `locality` string | **Normalized** localities or zones + `city_id` FK; avoid free-text-only for scale. |
| Events/jobs “OMR” | **Metro-wide** taxonomy; employer location as structured data. |
| Directory density | Start with **categories** that scale; moderate seed; avoid implying exhaustive coverage day one. |
| Marketing hubs | **Topic** and **neighborhood** landing pages generated from DB + editorial, not hardcoded PHP forests. |

**Multi-city future:** `cities` table; `city_id` on articles, events, jobs, listings; URL prefix `/chennai/...` or subdomain strategy—**decide in design docs** (see `ROUTING_PLAN.md`).

---

## 14. Risk register

| Risk | Area | Mitigation |
|------|------|------------|
| Undocumented production schema | Data | Treat migrations + code as partial; discovery phase on any import. |
| Over-building v1 | Product | `FEATURE_MAP` + phased roadmap; ship news + one vertical first. |
| SEO regression | SEO | Redirects plan for old URLs **only if** same domain; new domain = fresh start with content strategy. |
| Admin security | Platform | Use established auth (e.g. NextAuth + role claims) or Vercel-protected routes. |
| PII in listings | Legal | Phone reveal logs pattern—GDPR/DPDP-aware retention in new design. |
| Cache staleness | Performance | ISR windows + on-demand revalidation for publishes. |
| Multi-city premature complexity | Architecture | Start with `city_id` nullable or single row; avoid premature sharding. |

---

## Document control

- **Next steps:** See `docs/EXECUTION_ROADMAP.md`, `MIGRATION_LOG.md`.
- **Related:** `docs/PRD.md`, `docs/FEATURE_MAP.md`, `docs/MIGRATION_GUARDRAILS.md`.
