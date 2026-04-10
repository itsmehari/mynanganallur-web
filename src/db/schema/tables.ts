import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth";

export const articleStatusEnum = pgEnum("article_status", [
  "draft",
  "published",
  "archived",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "scheduled",
  "cancelled",
  "completed",
]);

export const jobPostingStatusEnum = pgEnum("job_posting_status", [
  "draft",
  "open",
  "closed",
]);

export const propertyListingKindEnum = pgEnum("property_listing_kind", [
  "rent",
  "sale",
  "other",
]);

export const propertyListingStatusEnum = pgEnum("property_listing_status", [
  "draft",
  "published",
  "archived",
]);

export const propertyFurnishingEnum = pgEnum("property_furnishing", [
  "unfurnished",
  "semi_furnished",
  "fully_furnished",
  "unspecified",
]);

export const cities = pgTable("cities", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  countryCode: text("country_code").notNull().default("IN"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    /** Legacy / RSS plain fallback; prefer reportBody + analysisBody when set. */
    body: text("body").notNull(),
    reportBody: text("report_body"),
    analysisBody: text("analysis_body"),
    interactiveJson: jsonb("interactive_json").$type<Record<string, unknown> | null>(),
    sourceUrl: text("source_url"),
    sourceName: text("source_name"),
    category: text("category"),
    dek: text("dek"),
    status: articleStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    featured: boolean("featured").notNull().default(false),
    heroImageUrl: text("hero_image_url"),
    /** Optional FAQ for AEO — visible Q&A + FAQPage JSON-LD when `items` non-empty. */
    faqJson: jsonb("faq_json").$type<{
      items: { q: string; a: string }[];
    } | null>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    citySlug: uniqueIndex("articles_city_slug_uidx").on(t.cityId, t.slug),
  }),
);

export const employers = pgTable("employers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  websiteUrl: text("website_url"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    allDay: boolean("all_day").notNull().default(false),
    venueName: text("venue_name"),
    venueAddress: text("venue_address"),
    localityLabel: text("locality_label"),
    status: eventStatusEnum("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    citySlug: uniqueIndex("events_city_slug_uidx").on(t.cityId, t.slug),
  }),
);

export const jobPostings = pgTable(
  "job_postings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employerId: uuid("employer_id")
      .notNull()
      .references(() => employers.id, { onDelete: "cascade" }),
    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    locationLabel: text("location_label"),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    salaryDisclosed: boolean("salary_disclosed").notNull().default(true),
    remotePolicy: text("remote_policy").notNull().default("onsite"),
    openingsCount: integer("openings_count").notNull().default(1),
    /** When true, sorts to the top of `/jobs` and can be highlighted in nav. */
    featured: boolean("featured").notNull().default(false),
    status: jobPostingStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    citySlug: uniqueIndex("job_postings_city_slug_uidx").on(t.cityId, t.slug),
  }),
);

export const propertyListings = pgTable(
  "property_listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    /** Markdown — full description, house rules, disclaimers. */
    body: text("body").notNull(),
    kind: propertyListingKindEnum("kind").notNull(),
    status: propertyListingStatusEnum("status").notNull().default("draft"),
    localityLabel: text("locality_label"),
    landmarkNote: text("landmark_note"),
    /** Monthly rent in whole INR (when kind is rent). */
    rentPerMonth: integer("rent_per_month"),
    /** Asking price in whole INR (when kind is sale). */
    salePrice: integer("sale_price"),
    advanceMonths: integer("advance_months"),
    bedrooms: integer("bedrooms"),
    bathrooms: integer("bathrooms"),
    areaSqft: integer("area_sqft"),
    floorLabel: text("floor_label"),
    facing: text("facing"),
    furnishing: propertyFurnishingEnum("furnishing").notNull().default("unspecified"),
    parkingSummary: text("parking_summary"),
    vegetarianHouseholdOnly: boolean("vegetarian_household_only")
      .notNull()
      .default(false),
    contactPhone: text("contact_phone").notNull(),
    contactEmail: text("contact_email"),
    featured: boolean("featured").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    heroImageUrl: text("hero_image_url"),
    /** e.g. reader_submitted, owner — for moderation / provenance. */
    listingSource: text("listing_source"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    citySlug: uniqueIndex("property_listings_city_slug_uidx").on(t.cityId, t.slug),
  }),
);

export const directoryEntryTypeEnum = pgEnum("directory_entry_type", [
  "bank",
  "school",
  "hospital",
  "park",
  "restaurant",
  "atm",
  "it_company",
  "it_park",
  "government_office",
  "industry",
  /** Places of worship — HRCE / community listings; always verify timings by phone. */
  "temple",
]);

export const directoryEntries = pgTable(
  "directory_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    type: directoryEntryTypeEnum("type").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    address: text("address"),
    localityLabel: text("locality_label"),
    phone: text("phone"),
    websiteUrl: text("website_url"),
    verified: boolean("verified").notNull().default(false),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    cityTypeSlug: uniqueIndex("directory_city_type_slug_uidx").on(
      t.cityId,
      t.type,
      t.slug,
    ),
  }),
);
