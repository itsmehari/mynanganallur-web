import {
  boolean,
  index,
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

/**
 * Provenance for a row that can be created via /admin (operator) or /submit/* (public web form).
 * Defaults to "admin" so legacy rows pre-migration keep behaving.
 */
export const entrySourceEnum = pgEnum("entry_source", ["admin", "web"]);

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
    source: entrySourceEnum("source").notNull().default("admin"),
    submittedByName: text("submitted_by_name"),
    submittedByEmail: text("submitted_by_email"),
    submittedByPhone: text("submitted_by_phone"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    moderationNotes: text("moderation_notes"),
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
    featuredUntil: timestamp("featured_until", { withTimezone: true }),
    heroImageUrl: text("hero_image_url"),
    faqJson: jsonb("faq_json").$type<{
      items: { q: string; a: string }[];
    } | null>(),
    source: entrySourceEnum("source").notNull().default("admin"),
    submittedByName: text("submitted_by_name"),
    submittedByEmail: text("submitted_by_email"),
    submittedByPhone: text("submitted_by_phone"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    moderationNotes: text("moderation_notes"),
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
    featuredUntil: timestamp("featured_until", { withTimezone: true }),
    status: jobPostingStatusEnum("status").notNull().default("draft"),
    heroImageUrl: text("hero_image_url"),
    faqJson: jsonb("faq_json").$type<{
      items: { q: string; a: string }[];
    } | null>(),
    contactPhone: text("contact_phone"),
    contactEmail: text("contact_email"),
    source: entrySourceEnum("source").notNull().default("admin"),
    submittedByName: text("submitted_by_name"),
    submittedByEmail: text("submitted_by_email"),
    submittedByPhone: text("submitted_by_phone"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    moderationNotes: text("moderation_notes"),
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
    featuredUntil: timestamp("featured_until", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    heroImageUrl: text("hero_image_url"),
    faqJson: jsonb("faq_json").$type<{
      items: { q: string; a: string }[];
    } | null>(),
    /** e.g. reader_submitted, owner — for moderation / provenance. */
    listingSource: text("listing_source"),
    source: entrySourceEnum("source").notNull().default("admin"),
    submittedByName: text("submitted_by_name"),
    submittedByEmail: text("submitted_by_email"),
    submittedByPhone: text("submitted_by_phone"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    moderationNotes: text("moderation_notes"),
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
  /** Home tuition, coaching centres, private tutors — confirm batch details by phone. */
  "tutor",
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
    heroImageUrl: text("hero_image_url"),
    faqJson: jsonb("faq_json").$type<{
      items: { q: string; a: string }[];
    } | null>(),
    featured: boolean("featured").notNull().default(false),
    featuredUntil: timestamp("featured_until", { withTimezone: true }),
    hoursSummary: text("hours_summary"),
    source: entrySourceEnum("source").notNull().default("admin"),
    /** Listing owner account (`user` row with role listing_owner). */
    ownerUserId: text("owner_user_id"),
    submittedByName: text("submitted_by_name"),
    submittedByEmail: text("submitted_by_email"),
    submittedByPhone: text("submitted_by_phone"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    moderationNotes: text("moderation_notes"),
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

// ─────────────────────────────────────────────────────────────────────────
// Operational tables added in Phase 1+ (submissions, moderation, growth)
// ─────────────────────────────────────────────────────────────────────────

/** Anti-spam log for /submit/* routes. Hashed IP only — never store raw IP. */
export const submissionLog = pgTable(
  "submission_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ipHash: text("ip_hash").notNull(),
    userAgent: text("user_agent"),
    route: text("route").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id"),
    status: text("status").notNull().default("ok"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    ipTimeIdx: index("submission_log_ip_time_idx").on(t.ipHash, t.createdAt),
    routeTimeIdx: index("submission_log_route_time_idx").on(t.route, t.createdAt),
  }),
);

/** Moderator/editor mutation history. before/after JSON for diff in admin UI. */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
    actorEmail: text("actor_email"),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id"),
    beforeJson: jsonb("before_json").$type<Record<string, unknown> | null>(),
    afterJson: jsonb("after_json").$type<Record<string, unknown> | null>(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    entityIdx: index("audit_log_entity_idx").on(t.entityType, t.entityId),
    actorIdx: index("audit_log_actor_idx").on(t.actorId, t.createdAt),
  }),
);

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    locality: text("locality"),
    confirmToken: text("confirm_token"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
    source: text("source"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    confirmedIdx: index("newsletter_confirmed_idx").on(t.confirmedAt),
  }),
);

export const searchAlerts = pgTable(
  "search_alerts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    query: text("query"),
    locality: text("locality"),
    entityType: text("entity_type").notNull().default("jobs"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    lastSentAt: timestamp("last_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailEntityIdx: index("search_alerts_email_entity_idx").on(
      t.email,
      t.entityType,
    ),
  }),
);

export const reactions = pgTable(
  "reactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    ipHash: text("ip_hash").notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    entityIdx: index("reactions_entity_idx").on(t.entityType, t.entityId),
    uniqVoter: uniqueIndex("reactions_unique_vote_uidx").on(
      t.entityType,
      t.entityId,
      t.ipHash,
    ),
  }),
);

export const listingPricing = pgTable(
  "listing_pricing",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: text("entity_type").notNull(),
    tier: text("tier").notNull(),
    priceInr: integer("price_inr").notNull(),
    durationDays: integer("duration_days").notNull(),
    features: text("features"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    entityTierIdx: uniqueIndex("listing_pricing_entity_tier_uidx").on(
      t.entityType,
      t.tier,
    ),
  }),
);

export const featuredOrders = pgTable(
  "featured_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    tier: text("tier").notNull(),
    priceInr: integer("price_inr").notNull(),
    durationDays: integer("duration_days").notNull(),
    status: text("status").notNull().default("created"),
    razorpayPaymentLinkId: text("razorpay_payment_link_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    entityIdx: index("featured_orders_entity_idx").on(t.entityType, t.entityId),
    paymentIdx: uniqueIndex("featured_orders_payment_link_uidx").on(
      t.razorpayPaymentLinkId,
    ),
  }),
);

export const adCreatives = pgTable(
  "ad_creatives",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slotId: text("slot_id").notNull(),
    name: text("name").notNull(),
    designJson: jsonb("design_json").$type<Record<string, unknown>>().notNull(),
    weight: integer("weight").notNull().default(1),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    active: boolean("active").notNull().default(true),
    impressionsLogged: integer("impressions_logged").notNull().default(0),
    clicksLogged: integer("clicks_logged").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slotIdx: index("ad_creatives_slot_idx").on(t.slotId, t.active),
  }),
);

export const sponsorships = pgTable(
  "sponsorships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    blurb: text("blurb"),
    href: text("href"),
    imageUrl: text("image_url"),
    weekStart: timestamp("week_start", { withTimezone: true }).notNull(),
    weekEnd: timestamp("week_end", { withTimezone: true }).notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    weekIdx: index("sponsorships_week_idx").on(t.weekStart, t.weekEnd),
  }),
);

export const jobApplications = pgTable(
  "job_applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobPostings.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    coverNote: text("cover_note"),
    cvUrl: text("cv_url"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    jobIdx: index("job_applications_job_idx").on(t.jobId, t.createdAt),
  }),
);

export const propertyLeads = pgTable(
  "property_leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => propertyListings.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    message: text("message"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    propertyIdx: index("property_leads_property_idx").on(t.propertyId, t.createdAt),
  }),
);

export const affiliateLinks = pgTable(
  "affiliate_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    label: text("label"),
    targetUrl: text("target_url").notNull(),
    network: text("network").notNull().default("amazon"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const affiliateClicks = pgTable(
  "affiliate_clicks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    linkId: uuid("link_id")
      .notNull()
      .references(() => affiliateLinks.id, { onDelete: "cascade" }),
    referer: text("referer"),
    placement: text("placement"),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    linkTimeIdx: index("affiliate_clicks_link_time_idx").on(t.linkId, t.createdAt),
  }),
);

export const partners = pgTable(
  "partners",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    kind: text("kind").notNull().default("other"),
    contactName: text("contact_name"),
    contactPhone: text("contact_phone"),
    contactEmail: text("contact_email"),
    locality: text("locality"),
    notes: text("notes"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const webPushSubscriptions = pgTable(
  "web_push_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    locality: text("locality"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
);
