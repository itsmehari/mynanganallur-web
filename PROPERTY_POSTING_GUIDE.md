# How to Post a Property on mynanganallur.in

## Overview

Properties are posted in the **"Properties"** section of mynanganallur.in at `/properties`. They appear as:
- Listings page: `/properties` — shows all published properties with filtering
- Detail page: `/properties/[slug]` — individual property page with full description

---

## Section Options

### 1. **Properties** (`/properties`)
- **For:** Residential & commercial real estate listings (rent, sale, lease)
- **Suitable for:**
  - Flats / Apartments
  - Houses
  - Commercial spaces (shops, offices)
  - Land
  - Any rental or sale listing

### 2. **Directory** (`/directory`)
- **For:** Businesses, services, institutions
- **NOT suitable** for property sales/rentals

### 3. **Jobs** (`/jobs`)
- **For:** Employment opportunities only

---

## Your Property Details Analysis

**Your Listing:**
```
Newly built 3-BHK Flat for sale in Nanganallur
Location: Near Ardhanareesh Varar Kovil, 2nd Floor
Features: Lift, covered carparking, full power backup
Age: 1 year old
Area: 1,305 sqft (main area), 500 sqft (UDS)
Price: ₹1.50 Cr (final)
Contact: Manikandan - 9789848127
```

**Section:** ✅ **Properties** (SALE)

---

## End-to-End Content Flow

### Step 1: Prepare Property Information

```
Title (40-60 chars):
"3 BHK flat for sale near Ardhanareesh Varar Kovil, Nanganallur"

Summary (80-120 chars for listings page):
"2nd floor, 1,305 sq ft + 500 sq ft UDS, lift, parking, power backup. ₹1.50 Cr. Direct owner. Call 9789848127."

Locality Label:
"Nanganallur, Chennai"

Landmark:
"Near Ardhanareesh Varar Kovil"
```

### Step 2: Create Full Description (Markdown)

```markdown
## About this property

**3 BHK flat** for sale in **Nanganallur**, near **Ardhanareesh Varar Kovil**.

### Details
- **Construction:** Newly built, 1 year old
- **Floor:** 2nd floor with lift access
- **Built-up area:** 1,305 sq ft
- **UDS (Undivided land share):** 500 sq ft
- **Bedrooms:** 3
- **Parking:** Covered carparking

### Amenities
- Lift facility
- Full power backup
- Secure compound

## Terms

- **Price:** ₹1.50 Crore (final)
- **Direct seller:** Owner-promoted listing
- **Note:** Direct from owner — negotiate if interested

## Contact

**Manikandan**
📞 **9789848127**

## Before you proceed

This listing is advertiser-submitted (direct owner). **Visit in person**, verify property documents, and confirm all details before committing. Do not transfer money to unknown accounts or via informal channels. Always execute property transactions through proper legal channels with registered documents.
```

### Step 3: Organize Property Metadata

| Field | Value |
|-------|-------|
| **Kind** | `sale` |
| **Bedrooms** | `3` |
| **Bathrooms** | — (not specified) |
| **Area (sqft)** | `1305` |
| **Floor Label** | `2nd Floor` |
| **Facing** | — (not specified) |
| **Furnishing** | `unspecified` |
| **Parking** | `Covered carparking with lift access` |
| **Vegetarian Only** | `false` |
| **Sale Price** | `150000000` (₹1.50 Cr in paise) |
| **Contact Phone** | `9789848127` |
| **Contact Email** | — (optional) |

### Step 4: Create Database Seeding Script

1. Create file: `scripts/seed-property-ardhanareesh-flat.ts`
2. Use template from `scripts/seed-property-guruvayoorappan.ts` or `scripts/seed-property-thillai-ganga-shop.ts`
3. Fill in property details
4. Add npm script in `package.json`

### Step 5: Seed to Database

**Dev environment:**
```bash
npm run db:seed:property:ardhanareesh-flat
```

**Production environment:**
```bash
npm run db:seed:property:ardhanareesh-flat:live
```

### Step 6: Verify Posting

1. **Dev:** Open `http://localhost:3000/properties`
2. **Live:** Open `https://mynanganallur.in/properties`
3. Property should appear in list
4. Click to view detail page: `/properties/sale-3bhk-ardhanareesh-flat-nanganallur`
5. Verify all details display correctly

---

## SEO & Visibility

Each property posting gets:
- ✅ Dedicated page with structured data (JSON-LD)
- ✅ Searchable across site search
- ✅ Breadcrumb navigation
- ✅ Social media sharing ready (Open Graph)
- ✅ Related properties section
- ✅ Share buttons
- ✅ WhatsApp CTA button

**URL Structure:** `/properties/[slug]`
- **Slug format:** `sale-3bhk-ardhanareesh-flat-nanganallur`
- **Unique:** One slug per property per city

---

## Content Best Practices

### ✅ Do

- **Be specific** about location landmarks
- **List all amenities** clearly
- **Mention age/condition** of property
- **State furnishing level** (if relevant)
- **Clarify restrictions** (vegetarian only, pets, etc.)
- **Highlight unique features** (lift, parking, backup power, etc.)
- **Provide emergency contact** info
- **Use markdown formatting** for readability

### ❌ Don't

- Use excessive caps or multiple exclamation marks!!!
- Make false claims about amenities
- Omit important disclaimers about visiting in person
- Share personal details beyond necessary contact info
- Use spam/clickbait language

---

## Property Status Options

- `draft` — Not visible publicly; for editing before publishing
- `published` — Visible on `/properties` list and detail page
- `archived` — Hidden from public but still in database

**Default:** `published` (visible immediately after seeding)

---

## Editing or Updating Listings

If you need to modify a property later:

1. Update the seeding script
2. Re-run the script — it detects existing entries by slug and **updates** instead of duplicating
3. Verify the change on the live site (may take 2 minutes to refresh due to ISR)

---

## Support Contact Information

For technical issues or to submit corrections:
- **Site:** mynanganallur.in
- **Contact:** Provided on /contact page

---

## Quick Reference: Your Property Script

| Item | Your Data |
|------|-----------|
| **Slug** | `sale-3bhk-ardhanareesh-flat-nanganallur` |
| **Title** | `3 BHK flat for sale near Ardhanareesh Varar Kovil, Nanganallur` |
| **Kind** | `sale` |
| **Status** | `published` |
| **Price** | `150000000` |
| **Bedrooms** | `3` |
| **Area** | `1305` |
| **Floor** | `2nd Floor` |
| **Locality** | `Nanganallur, Chennai` |
| **Landmark** | `Near Ardhanareesh Varar Kovil` |
| **Parking** | `Covered carparking with lift access` |
| **Contact** | `9789848127` (Manikandan) |
| **Source** | `owner` (direct from owner) |

