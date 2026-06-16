-- Listing-owner login (email + phone) and directory ownership
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phone" text;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phoneVerified" timestamp;
ALTER TABLE "directory_entries" ADD COLUMN IF NOT EXISTS "owner_user_id" text;

CREATE TABLE IF NOT EXISTS "listing_owner_otps" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "phone" text NOT NULL,
  "code_hash" text NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "listing_owner_sessions" (
  "session_token" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "expires" timestamp with time zone NOT NULL
);

CREATE INDEX IF NOT EXISTS "listing_owner_otps_email_phone_idx"
  ON "listing_owner_otps" ("email", "phone");

CREATE INDEX IF NOT EXISTS "directory_entries_owner_user_id_idx"
  ON "directory_entries" ("owner_user_id");
