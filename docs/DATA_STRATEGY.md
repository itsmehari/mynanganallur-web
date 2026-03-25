# Data strategy

## Principles

- **Ideas over rows** — no automatic import of legacy MySQL data in v1 unless a dedicated migration project is approved.
- **PII minimization** — collect phone/email only when needed; document retention for listing contact fields.
- **Phone reveal / tracking** — if implemented, mirror auditability (legacy had `phone_reveal_log`); comply with applicable privacy rules.

## Environments

- **Neon branches:** dev branch for local/staging; production branch for Vercel prod.
- **Connection:** `DATABASE_URL` in env; use pooled connection string on serverless.

## Migrations

- **Drizzle Kit** as source of truth; apply in CI before deploy or on release task.
- No hand-edited production schema without migration file.

## Seeding

- Minimal seed: one `cities` row (Nanganallur as primary site city), optional sample categories — **no** fake articles in production pipeline.

## Analytics credentials

- GA4 measurement ID: public env.
- Service account JSON for Data API: **server-only** env path or secret manager — never commit.
