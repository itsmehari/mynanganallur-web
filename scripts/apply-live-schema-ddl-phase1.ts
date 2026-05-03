/**
 * Phase 1+ additive DDL — submission columns on entities + new operational tables.
 *
 * Idempotent. Re-run safely. Use whenever Drizzle push wants interactive prompts.
 *
 * Live: `npm run db:apply:live-ddl:phase1`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "../src/db/schema";

loadEnv({ path: ".env.production.local" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing (.env.production.local)");
  process.exit(1);
}

const db = drizzle(neon(url), { schema });

async function run(label: string, raw: string) {
  await db.execute(sql.raw(raw));
  console.log("OK:", label);
}

const ENTITIES = [
  "articles",
  "events",
  "job_postings",
  "property_listings",
  "directory_entries",
] as const;

async function main() {
  await run(
    "enum entry_source",
    `DO $$ BEGIN CREATE TYPE "public"."entry_source" AS ENUM('admin','web'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  );

  for (const t of ENTITIES) {
    await run(
      `${t}.source`,
      `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "source" "entry_source" DEFAULT 'admin' NOT NULL;`,
    );
    await run(
      `${t}.submitted_by_name`,
      `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "submitted_by_name" text;`,
    );
    await run(
      `${t}.submitted_by_email`,
      `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "submitted_by_email" text;`,
    );
    await run(
      `${t}.submitted_by_phone`,
      `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "submitted_by_phone" text;`,
    );
    await run(
      `${t}.submitted_at`,
      `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "submitted_at" timestamp with time zone;`,
    );
    await run(
      `${t}.moderation_notes`,
      `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "moderation_notes" text;`,
    );
  }

  for (const t of ["events", "job_postings", "property_listings", "directory_entries"]) {
    await run(
      `${t}.featured_until`,
      `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "featured_until" timestamp with time zone;`,
    );
    await run(
      `${t}.faq_json`,
      `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "faq_json" jsonb;`,
    );
  }

  await run(
    "events.hero_image_url",
    `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "hero_image_url" text;`,
  );
  await run(
    "job_postings.hero_image_url",
    `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "hero_image_url" text;`,
  );
  await run(
    "job_postings.contact_phone",
    `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "contact_phone" text;`,
  );
  await run(
    "job_postings.contact_email",
    `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "contact_email" text;`,
  );
  await run(
    "directory_entries.hero_image_url",
    `ALTER TABLE "directory_entries" ADD COLUMN IF NOT EXISTS "hero_image_url" text;`,
  );
  await run(
    "directory_entries.featured",
    `ALTER TABLE "directory_entries" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false NOT NULL;`,
  );
  await run(
    "directory_entries.hours_summary",
    `ALTER TABLE "directory_entries" ADD COLUMN IF NOT EXISTS "hours_summary" text;`,
  );

  // Operational tables
  await run(
    "table submission_log",
    `CREATE TABLE IF NOT EXISTS "submission_log" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "ip_hash" text NOT NULL,
      "user_agent" text,
      "route" text NOT NULL,
      "entity_type" text NOT NULL,
      "entity_id" uuid,
      "status" text DEFAULT 'ok' NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "idx submission_log_ip_time",
    `CREATE INDEX IF NOT EXISTS "submission_log_ip_time_idx" ON "submission_log" ("ip_hash","created_at");`,
  );
  await run(
    "idx submission_log_route_time",
    `CREATE INDEX IF NOT EXISTS "submission_log_route_time_idx" ON "submission_log" ("route","created_at");`,
  );

  await run(
    "table audit_log",
    `CREATE TABLE IF NOT EXISTS "audit_log" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "actor_id" text,
      "actor_email" text,
      "action" text NOT NULL,
      "entity_type" text NOT NULL,
      "entity_id" uuid,
      "before_json" jsonb,
      "after_json" jsonb,
      "note" text,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "FK audit_log.actor_id -> user (if user table exists)",
    `DO $$ BEGIN
       IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user') THEN
         BEGIN
           ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_user_id_fk"
             FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
         EXCEPTION WHEN duplicate_object THEN NULL;
         END;
       END IF;
     END $$;`,
  );
  await run(
    "idx audit_log_entity",
    `CREATE INDEX IF NOT EXISTS "audit_log_entity_idx" ON "audit_log" ("entity_type","entity_id");`,
  );
  await run(
    "idx audit_log_actor",
    `CREATE INDEX IF NOT EXISTS "audit_log_actor_idx" ON "audit_log" ("actor_id","created_at");`,
  );

  await run(
    "table newsletter_subscribers",
    `CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "email" text NOT NULL UNIQUE,
      "locality" text,
      "confirm_token" text,
      "confirmed_at" timestamp with time zone,
      "unsubscribed_at" timestamp with time zone,
      "source" text,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "idx newsletter_confirmed",
    `CREATE INDEX IF NOT EXISTS "newsletter_confirmed_idx" ON "newsletter_subscribers" ("confirmed_at");`,
  );

  await run(
    "table search_alerts",
    `CREATE TABLE IF NOT EXISTS "search_alerts" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "email" text NOT NULL,
      "query" text,
      "locality" text,
      "entity_type" text DEFAULT 'jobs' NOT NULL,
      "confirmed_at" timestamp with time zone,
      "last_sent_at" timestamp with time zone,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "idx search_alerts_email_entity",
    `CREATE INDEX IF NOT EXISTS "search_alerts_email_entity_idx" ON "search_alerts" ("email","entity_type");`,
  );

  await run(
    "table reactions",
    `CREATE TABLE IF NOT EXISTS "reactions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "entity_type" text NOT NULL,
      "entity_id" uuid NOT NULL,
      "ip_hash" text NOT NULL,
      "value" text NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "idx reactions_entity",
    `CREATE INDEX IF NOT EXISTS "reactions_entity_idx" ON "reactions" ("entity_type","entity_id");`,
  );
  await run(
    "uidx reactions_unique_vote",
    `CREATE UNIQUE INDEX IF NOT EXISTS "reactions_unique_vote_uidx" ON "reactions" ("entity_type","entity_id","ip_hash");`,
  );

  await run(
    "table listing_pricing",
    `CREATE TABLE IF NOT EXISTS "listing_pricing" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "entity_type" text NOT NULL,
      "tier" text NOT NULL,
      "price_inr" integer NOT NULL,
      "duration_days" integer NOT NULL,
      "features" text,
      "active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "uidx listing_pricing_entity_tier",
    `CREATE UNIQUE INDEX IF NOT EXISTS "listing_pricing_entity_tier_uidx" ON "listing_pricing" ("entity_type","tier");`,
  );

  await run(
    "table featured_orders",
    `CREATE TABLE IF NOT EXISTS "featured_orders" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "entity_type" text NOT NULL,
      "entity_id" uuid NOT NULL,
      "tier" text NOT NULL,
      "price_inr" integer NOT NULL,
      "duration_days" integer NOT NULL,
      "status" text DEFAULT 'created' NOT NULL,
      "razorpay_payment_link_id" text,
      "razorpay_payment_id" text,
      "contact_email" text,
      "contact_phone" text,
      "paid_at" timestamp with time zone,
      "expires_at" timestamp with time zone,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "idx featured_orders_entity",
    `CREATE INDEX IF NOT EXISTS "featured_orders_entity_idx" ON "featured_orders" ("entity_type","entity_id");`,
  );
  await run(
    "uidx featured_orders_payment_link",
    `CREATE UNIQUE INDEX IF NOT EXISTS "featured_orders_payment_link_uidx" ON "featured_orders" ("razorpay_payment_link_id");`,
  );

  await run(
    "table ad_creatives",
    `CREATE TABLE IF NOT EXISTS "ad_creatives" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "slot_id" text NOT NULL,
      "name" text NOT NULL,
      "design_json" jsonb NOT NULL,
      "weight" integer DEFAULT 1 NOT NULL,
      "starts_at" timestamp with time zone,
      "ends_at" timestamp with time zone,
      "active" boolean DEFAULT true NOT NULL,
      "impressions_logged" integer DEFAULT 0 NOT NULL,
      "clicks_logged" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "idx ad_creatives_slot",
    `CREATE INDEX IF NOT EXISTS "ad_creatives_slot_idx" ON "ad_creatives" ("slot_id","active");`,
  );

  await run(
    "table sponsorships",
    `CREATE TABLE IF NOT EXISTS "sponsorships" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "title" text NOT NULL,
      "blurb" text,
      "href" text,
      "image_url" text,
      "week_start" timestamp with time zone NOT NULL,
      "week_end" timestamp with time zone NOT NULL,
      "active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "idx sponsorships_week",
    `CREATE INDEX IF NOT EXISTS "sponsorships_week_idx" ON "sponsorships" ("week_start","week_end");`,
  );

  await run(
    "table job_applications",
    `CREATE TABLE IF NOT EXISTS "job_applications" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "job_id" uuid NOT NULL,
      "name" text NOT NULL,
      "phone" text NOT NULL,
      "email" text,
      "cover_note" text,
      "cv_url" text,
      "status" text DEFAULT 'new' NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "FK job_applications.job_id -> job_postings",
    `DO $$ BEGIN
       ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_job_postings_id_fk"
         FOREIGN KEY ("job_id") REFERENCES "public"."job_postings"("id") ON DELETE cascade ON UPDATE no action;
     EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  );
  await run(
    "idx job_applications_job",
    `CREATE INDEX IF NOT EXISTS "job_applications_job_idx" ON "job_applications" ("job_id","created_at");`,
  );

  await run(
    "table property_leads",
    `CREATE TABLE IF NOT EXISTS "property_leads" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "property_id" uuid NOT NULL,
      "name" text NOT NULL,
      "phone" text NOT NULL,
      "email" text,
      "message" text,
      "status" text DEFAULT 'new' NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "FK property_leads.property_id -> property_listings",
    `DO $$ BEGIN
       ALTER TABLE "property_leads" ADD CONSTRAINT "property_leads_property_id_property_listings_id_fk"
         FOREIGN KEY ("property_id") REFERENCES "public"."property_listings"("id") ON DELETE cascade ON UPDATE no action;
     EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  );
  await run(
    "idx property_leads_property",
    `CREATE INDEX IF NOT EXISTS "property_leads_property_idx" ON "property_leads" ("property_id","created_at");`,
  );

  await run(
    "table affiliate_links",
    `CREATE TABLE IF NOT EXISTS "affiliate_links" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "slug" text NOT NULL UNIQUE,
      "label" text,
      "target_url" text NOT NULL,
      "network" text DEFAULT 'amazon' NOT NULL,
      "active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );

  await run(
    "table affiliate_clicks",
    `CREATE TABLE IF NOT EXISTS "affiliate_clicks" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "link_id" uuid NOT NULL,
      "referer" text,
      "placement" text,
      "ip_hash" text,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );
  await run(
    "FK affiliate_clicks.link_id -> affiliate_links",
    `DO $$ BEGIN
       ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "affiliate_clicks_link_id_affiliate_links_id_fk"
         FOREIGN KEY ("link_id") REFERENCES "public"."affiliate_links"("id") ON DELETE cascade ON UPDATE no action;
     EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  );
  await run(
    "idx affiliate_clicks_link_time",
    `CREATE INDEX IF NOT EXISTS "affiliate_clicks_link_time_idx" ON "affiliate_clicks" ("link_id","created_at");`,
  );

  await run(
    "table partners",
    `CREATE TABLE IF NOT EXISTS "partners" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "kind" text DEFAULT 'other' NOT NULL,
      "contact_name" text,
      "contact_phone" text,
      "contact_email" text,
      "locality" text,
      "notes" text,
      "active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );

  await run(
    "table web_push_subscriptions",
    `CREATE TABLE IF NOT EXISTS "web_push_subscriptions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "endpoint" text NOT NULL UNIQUE,
      "p256dh" text NOT NULL,
      "auth" text NOT NULL,
      "locality" text,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
  );

  console.log("\nDone — Phase 1+ live schema patches applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
