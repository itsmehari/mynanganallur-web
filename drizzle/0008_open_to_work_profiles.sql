CREATE TABLE IF NOT EXISTS "open_to_work_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "city_id" uuid NOT NULL,
  "slug" text NOT NULL,
  "display_name" text NOT NULL,
  "headline" text NOT NULL,
  "body" text NOT NULL,
  "domains_label" text,
  "preferred_locations" text,
  "work_mode_preferences" text DEFAULT 'hybrid' NOT NULL,
  "years_experience" integer,
  "contact_email" text,
  "contact_phone" text,
  "linkedin_url" text,
  "resume_url" text,
  "status" "job_posting_status" DEFAULT 'draft' NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "expires_at" timestamp with time zone,
  "published_at" timestamp with time zone,
  "source" "entry_source" DEFAULT 'admin' NOT NULL,
  "submitted_by_name" text,
  "submitted_by_email" text,
  "submitted_by_phone" text,
  "submitted_at" timestamp with time zone,
  "moderation_notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
  ALTER TABLE "open_to_work_profiles" ADD CONSTRAINT "open_to_work_profiles_city_id_cities_id_fk"
    FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "open_to_work_profiles_city_slug_uidx"
  ON "open_to_work_profiles" ("city_id", "slug");
