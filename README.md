# mynanganallur.in

Next.js (App Router) + Neon Postgres + Vercel — **mynanganallur.in** local platform scaffold.

## Stack

- **Framework:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Database:** Neon (Postgres) via Drizzle ORM
- **Auth:** Auth.js (NextAuth v5) with Drizzle adapter
- **Analytics:** GA4 (optional env), Vercel Analytics, Speed Insights

## Quick start

```bash
npm install
cp .env.example .env.local
# Set DATABASE_URL (Neon), AUTH_SECRET (openssl rand -base64 32), AUTH_URL=http://localhost:3000 for local dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (set `AUTH_SECRET` for NextAuth compile) |
| `npm run lint` | ESLint (fails on any warning — same as CI) |
| `npm run db:push` | Push Drizzle schema to Neon (run after pulling — adds `temple` directory type) |
| `npm run db:seed` | Seed city + news articles (`nanganallur`) |
| `npm run db:seed:directory` | Seed `directory_entries` from public web sources (Wikipedia, HRCE, etc.) — after `db:seed` |
| `npm run db:seed:live` / `db:seed:directory:live` | Same seeds using `.env.production.local` |
| `npm run db:studio` | Drizzle Studio |

## Documentation

- [docs/DEPLOY.md](docs/DEPLOY.md) — GitHub, Vercel, Neon, DNS, GA4, OAuth, Search Console
- [docs/SEARCH_CONSOLE.md](docs/SEARCH_CONSOLE.md) — GSC checklist
- [MIGRATION_ANALYSIS.md](MIGRATION_ANALYSIS.md) — legacy system intelligence extraction
- [docs/](docs/) — PRD, architecture, feature map

## License

Private / unlicensed unless you add a LICENSE file.
