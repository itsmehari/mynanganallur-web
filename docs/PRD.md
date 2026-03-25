# Product requirements document — mynanganallur.in

## Vision

A **city-scale** discovery and information platform for **Chennai**, combining editorial content, events, jobs, and structured local listings. The product is **not** a migration of any legacy site: it reuses **learned patterns** (SEO discipline, listing lifecycles, employer tooling) with a **fresh** brand, data model, and UX.

## Goals

1. **Trustworthy local information** — clear sourcing, moderation, and freshness signals.
2. **Sustainable operations** — one admin model, auditable changes, minimal duplicate surfaces.
3. **SEO sustainability** — canonical URLs, sitemaps, structured data, fast public pages (ISR/SSG where safe).
4. **Future multi-city** — `city` as a first-class dimension without rewriting core tables.

## Non-goals (v1)

- Parity with every legacy micro-site or one-off campaign page.
- Exhaustive directory coverage on day one.
- PHP/shared-hosting compatibility.

## Personas

- **Resident** — reads news, browses events, searches jobs/listings.
- **Contributor** — submits events, listings, or job posts (subject to moderation).
- **Employer / business** — manages job posts and optional paid placement (future tiers).
- **Operator** — editorial and moderation via admin UI.

## Success metrics (initial)

- Organic landing sessions and indexed URLs (Search Console).
- Publish-to-live latency for articles and moderated listings.
- Core Web Vitals on home and major listing templates.

## Constraints

- Stack: Next.js App Router, Neon Postgres, Vercel.
- No legacy branding, OMR-specific copy, or imported media without explicit editorial choice.
