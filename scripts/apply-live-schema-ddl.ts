/**
 * Applies additive DDL when `drizzle-kit push` cannot run (non-TTY / conflict prompts).
 * Safe to re-run: types/constraints/index use idempotent patterns.
 *
 * Live: `npm run db:apply:live-ddl`
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

async function main() {
  await run(
    "job_postings.featured",
    `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false NOT NULL;`,
  );

  await run(
    "enum property_listing_kind",
    `DO $$ BEGIN CREATE TYPE "public"."property_listing_kind" AS ENUM('rent', 'sale', 'other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  );
  await run(
    "enum property_listing_status",
    `DO $$ BEGIN CREATE TYPE "public"."property_listing_status" AS ENUM('draft', 'published', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  );
  await run(
    "enum property_furnishing",
    `DO $$ BEGIN CREATE TYPE "public"."property_furnishing" AS ENUM('unfurnished', 'semi_furnished', 'fully_furnished', 'unspecified'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  );

  await run(
    "table property_listings",
    `CREATE TABLE IF NOT EXISTS "property_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"body" text NOT NULL,
	"kind" "property_listing_kind" NOT NULL,
	"status" "property_listing_status" DEFAULT 'draft' NOT NULL,
	"locality_label" text,
	"landmark_note" text,
	"rent_per_month" integer,
	"sale_price" integer,
	"advance_months" integer,
	"bedrooms" integer,
	"bathrooms" integer,
	"area_sqft" integer,
	"floor_label" text,
	"facing" text,
	"furnishing" "property_furnishing" DEFAULT 'unspecified' NOT NULL,
	"parking_summary" text,
	"vegetarian_household_only" boolean DEFAULT false NOT NULL,
	"contact_phone" text NOT NULL,
	"contact_email" text,
	"featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"hero_image_url" text,
	"listing_source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);`,
  );

  await run(
    "FK property_listings -> cities",
    `DO $$ BEGIN
  ALTER TABLE "property_listings" ADD CONSTRAINT "property_listings_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;`,
  );

  await run(
    "index property_listings_city_slug_uidx",
    `CREATE UNIQUE INDEX IF NOT EXISTS "property_listings_city_slug_uidx" ON "property_listings" USING btree ("city_id","slug");`,
  );

  console.log("Done — live schema patches applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
