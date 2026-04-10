CREATE TYPE "public"."property_listing_kind" AS ENUM('rent', 'sale', 'other');--> statement-breakpoint
CREATE TYPE "public"."property_listing_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."property_furnishing" AS ENUM('unfurnished', 'semi_furnished', 'fully_furnished', 'unspecified');--> statement-breakpoint
CREATE TABLE "property_listings" (
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
);
--> statement-breakpoint
ALTER TABLE "property_listings" ADD CONSTRAINT "property_listings_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "property_listings_city_slug_uidx" ON "property_listings" USING btree ("city_id","slug");
