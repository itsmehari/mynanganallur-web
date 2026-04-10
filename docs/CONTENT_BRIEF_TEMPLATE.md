# Content brief and QC — mynanganallur.in

Use before publishing or merging any **recurring** content type. Goal: **system > output** (scalable quality, not one-off luck).

---

## Article (local news)

**Required**

- Title (clear, specific; avoid clickbait empty claims)
- Slug (stable; never change after publish without redirect plan)
- `reportBody` or `body` (facts in plain structure; ## headings where helpful)
- Category when applicable
- Status: `published` only after QC

**Strongly recommended**

- `summary` (2–4 sentences, factual — powers **In short** on the public article page)
- `dek` (optional subhead under title)
- `sourceUrl` + `sourceName` when based on external reporting
- `faq_json` (optional): `{ "items": [ { "q": "…", "a": "…" } ] }` — renders **Common questions** + **FAQPage** JSON-LD only when items are non-empty and text matches on-page content

**QC checklist**

- [ ] Names, dates, rupee amounts, and addresses verified from primary source or organiser
- [ ] No invented quotes or unnamed “sources” unless house style explicitly allows
- [ ] Legal/safety/medical claims reviewed; add disclaimer where needed
- [ ] Hero image rights cleared if not original

**Do not invent**

- Contact numbers, event times, ticket prices, or government outcomes not in source material

---

## Event

**Required**

- Title, `startsAt`, city, `slug`, `status: scheduled` (or agreed public state)
- Venue signal: `venueName` and/or `localityLabel` (use **Online** + Zoom/Meet in name for virtual)

**Recommended**

- `description` (markdown-lite: **bold**, lists, ## headings — renders on detail page)
- `endsAt`, `venueAddress` when in-person and known

**QC checklist**

- [ ] Date/time in **Asia/Kolkata** intent matches stored timestamp
- [ ] Organiser contact or link confirmed if published in description
- [ ] Cancelled events moved to `cancelled`, not left as `scheduled`

---

## Area hub (static copy in repo)

**Required**

- Unique `extendedMd`, `geoQuestion`, `geoDirectAnswer` per slug in `src/lib/nanganallur-areas.ts`
- Internal links on the hub page stay valid (news topics, events, jobs)

**QC checklist**

- [ ] No copy-paste across areas without locality-specific edits
- [ ] No fake street addresses or NAP for **LocalBusiness** (Place-level is OK)

---

## Job (when job board is live)

**Required fields for JobPosting schema** (see Google docs): title, description, date posted, hiring organization, job location (or remote policy consistent with schema)

**QC checklist**

- [ ] Role still open; close or remove when filled
- [ ] Salary claims match employer-approved text when disclosed

---

## Automation (seeds / scripts)

- `scripts/seed-articles.ts` and `db:seed:event:*` are **dev/prod data tools**, not substitutes for editorial QC
- Idempotent seeds must not overwrite human edits without explicit migration plan

---

## After publish (engineering)

- **Today:** Editors/admins signed in with role `editor` or `admin` can use **Revalidate public pages** on `/admin` after manual DB edits to bust the `/` layout cache (ISR).
- **Later:** Wire per-entity `revalidatePath` when admin CRUD ships ([SEO_ENGINE_PLAN.md](./SEO_ENGINE_PLAN.md)).
