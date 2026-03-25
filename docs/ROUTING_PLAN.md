# Routing plan — Next.js App Router

## Principles

- **v1 locality:** Nanganallur — public news at `/local-news`, events at `/local-events`; optional multi-city prefix later.
- **Legacy redirects** — old public paths → `/local-news` and `/local-events` (see `next.config.ts`; kept for inbound links).
- **Stable slugs** — unique within scope (city + type).

## Suggested public routes

| Route | Purpose |
|-------|---------|
| `/` | Home — city switcher later |
| `/news` | Article index |
| `/news/[slug]` | Article detail |
| `/events` | Events index |
| `/events/[slug]` | Event detail |
| `/jobs` | Job list |
| `/jobs/[slug]` | Job detail (slug-only URLs preferred over numeric) |
| `/directory` or `/places` | Directory hub |
| `/directory/[type]` | Vertical hub |
| `/directory/[type]/[slug]` | Detail |

## Admin

- `/admin` — dashboard (auth-gated layout); implemented as `src/app/admin/` (not a route group, to avoid colliding with `/`).
- Nested resources under `/admin/...` for CRUD (exact structure when implementing)

## Technical

- **`sitemap.ts`** at `src/app/sitemap.ts` — composes URLs from DB or static config.
- **`robots.ts`** — allow crawl; point to sitemap index.
- **Middleware** — optional locale or city segment normalization; auth for `/admin`.

## Multi-city (future)

- Option A: `/{citySlug}/news/...`
- Option B: subdomain e.g. `city.mynanganallur.in`
- Persist `city_id` on all scoped entities regardless of URL choice.
