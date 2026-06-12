# Property Posting Architecture & Flow

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    mynanganallur.in Architecture                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐                                               │
│  │  Seeding Script  │                                               │
│  │  (TypeScript)    │                                               │
│  └────────┬─────────┘                                               │
│           │                                                          │
│           │ npm run db:seed:property:*:live                         │
│           │                                                          │
│           ▼                                                          │
│  ┌──────────────────┐                                               │
│  │ Neon Database    │                                               │
│  │ PostgreSQL       │                                               │
│  │ (Production)     │                                               │
│  └────────┬─────────┘                                               │
│           │                                                          │
│           │ propertyListings table insert/update                    │
│           │                                                          │
│           ▼                                                          │
│  ┌──────────────────┐        ┌─────────────────┐                   │
│  │  Next.js ISR     │◄──────►│  Vercel Edge    │                   │
│  │  (Build cache)   │        │  Network        │                   │
│  └────────┬─────────┘        └─────────────────┘                   │
│           │                                                          │
│           │ Cache invalidation (2-5 min)                            │
│           │                                                          │
│           ▼                                                          │
│  ┌──────────────────────────────────────────┐                      │
│  │     PUBLIC WEBSITE                       │                      │
│  │                                          │                      │
│  │  /properties        ← List page          │                      │
│  │  /properties/[slug] ← Detail page        │                      │
│  │  /sitemap.xml       ← SEO indexed        │                      │
│  └──────────────────────────────────────────┘                      │
│           │                                                          │
│           ├─► Google Search (Indexed)                               │
│           ├─► Social Media (Open Graph)                             │
│           └─► User Browsers                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Posting Workflow

```
┌─ STEP 1: PREPARE DATA ────────────────────────────────┐
│                                                        │
│  User Input:                                           │
│  • Title: 3 BHK flat for sale...                      │
│  • Price: ₹1.50 Crore                                 │
│  • Contact: 9789848127                                │
│  • Location: Ardhanareesh, Nanganallur                │
│                                                        │
└───────────────┬──────────────────────────────────────┘
                │
                ▼
┌─ STEP 2: CREATE SEEDING SCRIPT ──────────────────────┐
│                                                        │
│  scripts/seed-property-ardhanareesh-flat.ts           │
│  • Drizzle ORM setup                                  │
│  • Database connection                                │
│  • Property metadata                                  │
│  • Markdown description                               │
│  • Insert or update logic                             │
│                                                        │
└───────────────┬──────────────────────────────────────┘
                │
                ▼
┌─ STEP 3: ADD NPM SCRIPTS ─────────────────────────────┐
│                                                        │
│  package.json:                                        │
│  • db:seed:property:ardhanareesh-flat                 │
│  • db:seed:property:ardhanareesh-flat:live            │
│                                                        │
└───────────────┬──────────────────────────────────────┘
                │
                ▼
┌─ STEP 4: DOCUMENTATION ──────────────────────────────┐
│                                                        │
│  Create guides:                                       │
│  • PROPERTY_POSTING_GUIDE.md                          │
│  • PROPERTY_POSTING_WORKFLOW.md                       │
│  • PROPERTY_POSTING_SUMMARY.md                        │
│  • QUICK_REFERENCE.md                                 │
│                                                        │
└───────────────┬──────────────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ FILES READY   │
        └───────┬───────┘
                │
                │ Execute: npm run db:seed:property:ardhanareesh-flat:live
                │
                ▼
┌─ STEP 5: DATABASE INSERT/UPDATE ──────────────────────┐
│                                                        │
│  Seeding script runs:                                 │
│  1. Connect to Neon (via .env.production.local)       │
│  2. Check if property exists (by slug)                │
│  3. If new → INSERT                                   │
│     If exists → UPDATE (idempotent)                   │
│  4. Log: "Inserted/Updated property: sale-3bhk..."    │
│                                                        │
└───────────────┬──────────────────────────────────────┘
                │
                ▼
┌─ STEP 6: WEBSITE REGENERATION ────────────────────────┐
│                                                        │
│  ISR (Incremental Static Regeneration):              │
│  1. Next.js detects property list change              │
│  2. Invalidates cache for:                            │
│     • /properties (list page)                         │
│     • /properties/sale-3bhk-... (detail)              │
│     • /sitemap.xml                                    │
│  3. Rebuilds static pages                             │
│     Time: 30-60 seconds                               │
│  4. Cache updated on Vercel Edge Network              │
│     Propagation: 1-5 minutes                          │
│                                                        │
└───────────────┬──────────────────────────────────────┘
                │
                ▼
        ┌──────────────────┐
        │ LIVE ON WEBSITE! │
        │ (2-5 min total)  │
        └──────┬───────────┘
                │
                ▼
┌─ STEP 7: DISCOVERY ───────────────────────────────────┐
│                                                        │
│  Buyers can find via:                                 │
│  • Direct URL: /properties/sale-3bhk-...              │
│  • List search: /properties?q=3%20BHK                 │
│  • Locality filter: /properties?locality=Nanganallur  │
│  • Google Search (indexed in hours)                   │
│  • Social sharing (OpenGraph metadata)                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Database Schema (Relevant Fields)

```
propertyListings Table
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Core Fields:
├─ id               → UUID (auto)
├─ cityId           → References cities table
├─ slug             → sale-3bhk-ardhanareesh-flat-nanganallur
├─ title            → 3 BHK flat for sale...
├─ summary          → Brief 1-liner
└─ body             → Full markdown description

Property Details:
├─ kind             → "sale" or "rent"
├─ status           → "published", "draft", "archived"
├─ bedrooms         → 3
├─ bathrooms        → (null if not specified)
├─ areaSqft         → 1305
├─ floorLabel       → "2nd Floor"
├─ facing           → (null)
├─ furnishing       → "unspecified"
├─ parkingSummary   → "Covered carparking with lift"
└─ vegetarianOnly   → false

Pricing:
├─ salePrice        → 150000000 (₹1.50 Cr in whole INR)
└─ rentPerMonth     → null (not applicable for sale)

Location:
├─ localityLabel    → "Nanganallur, Chennai"
└─ landmarkNote     → "Near Ardhanareesh Varar Kovil"

Contact:
├─ contactPhone     → "9789848127"
└─ contactEmail     → (null if not provided)

Publishing:
├─ featured         → false
├─ publishedAt      → 2026-06-01 10:00:00+05:30
└─ heroImageUrl     → (null unless provided)

Source Tracking:
├─ listingSource    → "owner" (direct seller)
├─ source           → "admin" (created by admin/script)
├─ submittedByName  → (null)
├─ submittedByPhone → (null)
└─ submittedAt      → (null)

Timestamps:
├─ createdAt        → (auto)
└─ updatedAt        → (auto)
```

---

## Frontend Component Flow

```
Page Request: /properties
        │
        ├─► Next.js Router
        │
        ▼
src/app/(public)/properties/page.tsx
        │
        ├─► Query: listPublishedPropertiesForSite()
        │   └─► Database: SELECT * FROM propertyListings 
        │       WHERE status = 'published'
        │
        ├─► Build JSON-LD (SEO schema)
        │
        ├─► Render list:
        │   └─► For each property:
        │       ├─ Title
        │       ├─ Summary
        │       ├─ Locality + BHK + Area
        │       ├─ Price
        │       └─ Link to detail page
        │
        └─► Response (HTML + metadata)

Click on property: /properties/sale-3bhk-ardhanareesh-flat-nanganallur
        │
        ├─► Next.js Router
        │
        ▼
src/app/(public)/properties/[slug]/page.tsx
        │
        ├─► Query: getPublishedPropertyBySlug(slug)
        │   └─► Database: SELECT * FROM propertyListings
        │       WHERE slug = ? AND status = 'published'
        │
        ├─► Generate metadata (Open Graph, Twitter)
        │
        ├─► Render full page:
        │   ├─ Breadcrumbs
        │   ├─ Title & summary
        │   ├─ Markdown body (rendered as prose)
        │   ├─ Property specs (bedrooms, area, floor, etc.)
        │   ├─ Contact button (tel: link)
        │   ├─ WhatsApp CTA
        │   ├─ Share buttons
        │   ├─ FAQ section (if provided)
        │   ├─ Related properties
        │   └─ Helpful/reaction buttons
        │
        ├─ Inject JSON-LD schema
        │
        └─► Response (HTML + metadata + structured data)
```

---

## File Structure

```
mynanganallur-web/
├── scripts/
│   ├── seed-property-guruvayoorappan.ts          (example: 2 BHK rent)
│   ├── seed-property-thillai-ganga-shop.ts       (example: shop rent)
│   ├── seed-property-gs-commercial-house.ts      (example: commercial)
│   └── seed-property-ardhanareesh-flat.ts        ✨ YOUR SCRIPT (NEW)
│
├── src/
│   ├── app/(public)/
│   │   ├── properties/
│   │   │   ├── page.tsx                 (list page)
│   │   │   └── [slug]/
│   │   │       └── page.tsx             (detail page)
│   │   │
│   │   └── directory/
│   │       └── (not for properties)
│   │
│   └── db/
│       └── schema/
│           └── tables.ts                (propertyListings table)
│
├── package.json                          ✨ UPDATED (scripts added)
│
├── PROPERTY_POSTING_GUIDE.md             ✨ CREATED (reference)
├── PROPERTY_POSTING_WORKFLOW.md          ✨ CREATED (detailed flow)
├── PROPERTY_POSTING_SUMMARY.md           ✨ CREATED (overview)
└── QUICK_REFERENCE.md                    ✨ CREATED (cheat sheet)
```

---

## Timing Diagram

```
Timeline for Property Publishing
═════════════════════════════════════════════════

T+0:00   npm run db:seed:property:ardhanareesh-flat:live
            │
            ├─► Script starts
            ├─► Connects to Neon DB
            ├─► Inserts/Updates property row
            └─► Completes (1-3 seconds)
            │
T+0:05   Next.js ISR detects change
            │
            ├─► Cache invalidation triggered
            ├─► Pages queued for rebuild:
            │   ├─ /properties
            │   ├─ /properties/sale-3bhk-...
            │   └─ /sitemap.xml
            │
T+0:30   Rebuild completes
            │
            ├─► Static pages generated
            ├─► Artifacts pushed to CDN
            │
T+1:00   CDN cache propagated
            │
            ├─► Edge servers updated
            ├─► Ready for visitors
            │
T+2-5    ✓ LIVE (visible to users)
            │
            ├─► Visitors see property
            ├─► Google bot crawls
            ├─► Social media preview ready
            │
T+24hrs  Indexed in Google Search
            │
            └─► Shows in search results

Note: Actual timing varies based on:
- Database latency
- Build system load
- ISR configuration
- CDN propagation
- Visitor timezone
```

---

## Success Criteria

✅ Property appears on `/properties` list
✅ Direct link works: `/properties/sale-3bhk-ardhanareesh-flat-nanganallur`
✅ All details display correctly
✅ Contact phone number is accurate
✅ Search finds the property
✅ Social sharing shows correct preview
✅ Google bot can crawl the page

---

## Troubleshooting

```
Issue: Property not appearing after 10 minutes
Fix:   • Check DATABASE_URL in .env.production.local
       • Verify Neon database credentials
       • Re-run: npm run db:seed:property:ardhanareesh-flat:live

Issue: Wrong information on the page
Fix:   • Edit: scripts/seed-property-ardhanareesh-flat.ts
       • Update the field
       • Re-run the seeding script

Issue: Can't run the script
Fix:   • Ensure Node.js installed: node -v
       • Install deps: npm install
       • Check .env.production.local exists
       • Check DATABASE_URL format

Issue: Image not showing
Fix:   • Add heroImageUrl to script
       • URL must be publicly accessible
       • Add domain to next.config.ts remotePatterns
```

---

## Related Documentation

- **Guide:** `PROPERTY_POSTING_GUIDE.md` — Complete reference
- **Workflow:** `PROPERTY_POSTING_WORKFLOW.md` — Step-by-step details
- **Summary:** `PROPERTY_POSTING_SUMMARY.md` — Quick overview
- **Quick Ref:** `QUICK_REFERENCE.md` — Cheat sheet
- **This Doc:** Architecture & flow diagrams

