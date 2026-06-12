# Property Posting Workflow for Manikandan's 3 BHK Flat

## Quick Start Checklist

- [x] **Property Details Captured**
  - Title: "3 BHK flat for sale near Ardhanareesh Varar Kovil, Nanganallur"
  - Price: ₹1.50 Crore
  - Contact: 9789848127 (Manikandan)

- [x] **Seeding Script Created**
  - File: `scripts/seed-property-ardhanareesh-flat.ts`
  - Scripts added to `package.json`

- [ ] **Ready to Publish**
  - Run: `npm run db:seed:property:ardhanareesh-flat:live`

---

## What Happens at Each Stage

### 1. **Seeding Script Execution**

```bash
npm run db:seed:property:ardhanareesh-flat:live
```

**What it does:**
- Connects to production database on Neon (via `.env.production.local`)
- Checks if property with slug `sale-3bhk-ardhanareesh-flat-nanganallur` exists
- If new: **Inserts** the property record
- If exists: **Updates** the property record (idempotent)
- Logs: `"Inserted property: sale-3bhk-ardhanareesh-flat-nanganallur"`

**Database record created:**
```
propertyListings table
├── id: uuid (auto-generated)
├── cityId: nanganallur city ID
├── slug: sale-3bhk-ardhanareesh-flat-nanganallur
├── title: "3 BHK flat for sale near Ardhanareesh Varar Kovil, Nanganallur"
├── status: "published"
├── kind: "sale"
├── salePrice: 150000000 (in whole INR)
├── bedrooms: 3
├── areaSqft: 1305
├── contactPhone: 9789848127
└── publishedAt: 2026-06-01 10:00:00+05:30
```

### 2. **Public Website Updates (2-5 min delay)**

After seeding, the site uses **Incremental Static Regeneration (ISR)**:

1. **Next.js rebuilds** static pages containing properties
2. **Cache invalidates** for:
   - `/properties` (list page)
   - `/properties/sale-3bhk-ardhanareesh-flat-nanganallur` (detail page)
   - `/sitemap.xml` (SEO)

3. **Visibility:**
   - Immediately appears in list: `https://mynanganallur.in/properties`
   - Direct link works: `https://mynanganallur.in/properties/sale-3bhk-ardhanareesh-flat-nanganallur`

### 3. **Public Sees**

#### On `/properties` List Page
```
┌─────────────────────────────────────────────────────┐
│ 3 BHK flat for sale near Ardhanareesh Varar Kovil, │
│ Nanganallur                                          │
│                                                      │
│ Sale · Nanganallur, Chennai · 3 BHK · ~1305 sq ft  │
│ ₹1,50,00,00,000                                     │
└─────────────────────────────────────────────────────┘
```

#### On Detail Page: `/properties/[slug]`
```
┌──────────────────────────────────────────────────────┐
│                                                       │
│ Properties > Sale                                    │
│                                                       │
│ 3 BHK flat for sale near Ardhanareesh Varar Kovil,  │
│ Nanganallur                                          │
│                                                       │
│ 2nd floor, 1,305 sq ft + 500 sq ft UDS, lift,       │
│ covered parking, power backup. ₹1.50 Cr. Direct     │
│ owner. Call 9789848127.                             │
│                                                       │
│ ────────────────────────────────────────────────────│
│                                                       │
│ About this property                                  │
│ 3 BHK flat for sale in Nanganallur, near            │
│ Ardhanareesh Varar Kovil.                           │
│                                                       │
│ Details:                                             │
│ • Construction: Newly built, 1 year old             │
│ • Floor: 2nd floor with lift access                 │
│ • Built-up area: 1,305 sq ft                        │
│ • UDS: 500 sq ft                                    │
│ • Bedrooms: 3                                        │
│ • Parking: Covered carparking with lift access      │
│                                                       │
│ Amenities:                                           │
│ • Lift facility                                      │
│ • Full power backup                                 │
│ • Secure compound                                   │
│ • Covered carparking                                │
│                                                       │
│ Terms:                                               │
│ • Price: ₹1.50 Crore (final)                        │
│ • Direct seller — no broker commission              │
│ • Ready possession, 1 year old                      │
│                                                       │
│ Before you proceed:                                 │
│ This listing is advertiser-submitted (direct        │
│ owner). Visit in person, verify property            │
│ documents, confirm all details.                     │
│                                                       │
│ ────────────────────────────────────────────────────│
│                                                       │
│ Contact: Manikandan                                  │
│ 📞 9789848127                                        │
│                                                       │
│ [WhatsApp] [Share] [Helpful?]                       │
│                                                       │
│ ────────────────────────────────────────────────────│
│ Related Properties                                   │
│ [Other recent properties...]                        │
└──────────────────────────────────────────────────────┘
```

### 4. **Search & Discovery**

The listing becomes discoverable via:

✅ **Direct link:** `/properties/sale-3bhk-ardhanareesh-flat-nanganallur`

✅ **Site search:** Search for "3 BHK", "Ardhanareesh", "sale" on `/properties?q=3%20BHK`

✅ **Locality filter:** `/properties?locality=Nanganallur`

✅ **SEO / Google Search:** Property details indexed in Google Search with:
- Breadcrumb navigation
- Structured data (Schema.org JSON-LD)
- Open Graph for social sharing

✅ **Social sharing:** When shared:
```
📱 "3 BHK flat for sale near Ardhanareesh Varar Kovil, Nanganallur"
   Nanganallur, Chennai · 1,305 sq ft
   ₹1,50,00,00,000
   mynanganallur.in/properties/sale-3bhk-ardhanareesh-flat-nanganallur
```

---

## Testing Checklist

### Before Going Live

1. **Verify seeding script syntax:**
   ```bash
   npm run db:seed:property:ardhanareesh-flat
   # (Dev environment first to test)
   ```

2. **Check database connection:**
   - `.env.production.local` has valid `DATABASE_URL`
   - Database on Neon is accessible

3. **Confirm data quality:**
   - Phone number correctly formatted (10 digits)
   - Price in whole INR (no decimals)
   - Area in square feet
   - All required fields filled

### After Publishing

1. **Visit list page:**
   - `https://mynanganallur.in/properties`
   - Property appears in list (within 2-5 min)

2. **Check detail page:**
   - `https://mynanganallur.in/properties/sale-3bhk-ardhanareesh-flat-nanganallur`
   - All details display correctly
   - Contact info shows phone number
   - Markdown formatting renders properly

3. **Test search:**
   - Search for "3 BHK" → should appear
   - Search for "Ardhanareesh" → should appear
   - Filter by "Nanganallur" → should appear

4. **Verify contact:**
   - WhatsApp button works
   - Phone link generates `tel:+919789848127`
   - Contact info is accurate

---

## Content Breakdown

### Title Line (Public-facing)
```
3 BHK flat for sale near Ardhanareesh Varar Kovil, Nanganallur
```
- Length: 67 characters (good for SEO, fits in search results)
- Includes: Type (3 BHK) + Action (for sale) + Location (specificity)
- Purpose: Clear, searchable title on `/properties` list

### Summary (100-120 chars)
```
2nd floor, 1,305 sq ft + 500 sq ft UDS, lift, covered parking, power backup. ₹1.50 Cr. Direct owner. Call 9789848127.
```
- Appears on list page cards
- Covers key amenities & price at a glance
- Includes call-to-action (phone number)

### Locality Label
```
Nanganallur, Chennai
```
- Used for filtering & SEO
- Broad enough for discovery

### Landmark
```
Near Ardhanareesh Varar Kovil
```
- Helps locals identify exact location
- Reduces "where is this?" questions
- Searchable keyword

### Body (Markdown)
- **Sections:** About, Details, Amenities, Terms, Contact, Disclaimer
- **Formatting:** Headers (`##`), bullet lists, bold highlights
- **Tone:** Professional, factual, cautious (legal protection)
- **Length:** ~350 words (good balance of detail vs. readability)

### Key Data Points
| Field | Value | Why |
|-------|-------|-----|
| **Kind** | `sale` | Property type (vs. `rent`) |
| **Status** | `published` | Visible to public |
| **Bedrooms** | `3` | Searchable, filterable |
| **Area** | `1305` | In sq ft, enables comparisons |
| **Sale Price** | `150000000` | Whole INR (no decimals) |
| **Contact Phone** | `9789848127` | Formatted without +91 prefix |
| **Listing Source** | `owner` | Indicates direct seller (trust signal) |

---

## Updates & Corrections

If you need to update the listing later (price, details, etc.):

### To Fix

1. Edit the seeding script: `scripts/seed-property-ardhanareesh-flat.ts`
2. Change the relevant field (e.g., `salePrice: 140_000_000`)
3. Re-run: `npm run db:seed:property:ardhanareesh-flat:live`
4. The script detects the existing property by slug and **updates** (no duplicate)

### Example Update
```typescript
// Before
salePrice: 150_000_000,

// After (new price)
salePrice: 145_000_000,

// Then run
npm run db:seed:property:ardhanareesh-flat:live
```

---

## File Locations

### Created Files

1. **Seeding Script**
   - Path: `scripts/seed-property-ardhanareesh-flat.ts`
   - Purpose: Insert/update property in database
   - Editable: Yes, anytime

2. **Posting Guide**
   - Path: `PROPERTY_POSTING_GUIDE.md`
   - Purpose: Reference for future listings
   - Editable: Yes, as needed

### Modified Files

1. **package.json**
   - Added: `db:seed:property:ardhanareesh-flat` script
   - Added: `db:seed:property:ardhanareesh-flat:live` script

---

## Next Steps

### To Post Immediately

```bash
# Test in dev first
npm run db:seed:property:ardhanareesh-flat

# Then go live
npm run db:seed:property:ardhanareesh-flat:live
```

### Then Verify

1. Wait 2-5 minutes
2. Visit: `https://mynanganallur.in/properties`
3. Search for "Ardhanareesh" or "3 BHK"
4. Click to view full details
5. Share the link: `https://mynanganallur.in/properties/sale-3bhk-ardhanareesh-flat-nanganallur`

### Share with Potential Buyers

- Direct link: `mynanganallur.in/properties/sale-3bhk-ardhanareesh-flat-nanganallur`
- WhatsApp-friendly: Property page has WhatsApp button
- Shareable: Open Graph meta tags work on Facebook, LinkedIn, Twitter

---

## Support

**Questions?** Check:
- `PROPERTY_POSTING_GUIDE.md` — General reference
- `scripts/seed-property-*.ts` — Other property examples
- `src/app/(public)/properties/` — Frontend code

