<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Repo: mynanganallur-web

- **Stack:** Next.js (App Router), Drizzle ORM, Postgres on **Neon**, Auth.js. DB client: `src/db/client.ts`; schema: `src/db/schema/`.
- **Production data:** Set `DATABASE_URL` on Vercel to the Neon pooled string. Local live operations: `.env.production.local` (see `docs/DEPLOY.md`). Do not commit credentials.
- **Adding a production event:** Add a script under `scripts/seed-event-*.ts` modeled on `scripts/seed-event-panguni.ts` (city slug `nanganallur`, unique `slug`, `tsx … --live`); register an npm script in `package.json`. Idempotent checks use `(cityId, slug)`.
- **Worklog / learnings:** Record notable changes in `docs/PROJECT_UPDATE.md` and durable tips in `docs/LEARNINGS.md`.
- **Remote images (Next.js):** When adding `next/image` for remote URLs, update `next.config.ts` `images.remotePatterns` for the new host/path.
