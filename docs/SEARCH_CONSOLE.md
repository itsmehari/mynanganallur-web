# Google Search Console checklist

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add property:
   - **Domain** property: `mynanganallur.in` (covers all subdomains and paths) — verify via **DNS TXT** at your DNS host (BigRock or Vercel DNS).
   - Or **URL-prefix**: `https://mynanganallur.in/` — verify via HTML tag or file if you prefer.
3. After verification, go to **Sitemaps** → submit: `https://mynanganallur.in/sitemap.xml` (and optionally `sitemap-news.xml`, `sitemap-images.xml`).
4. **Re-submit or ping** the sitemap after deploys that change URL inventory (directory type paths, new hubs, removed noindex routes). Google recrawls on its own schedule; resubmitting speeds discovery.
5. Optional: In GA4, **Admin → Product links → Search Console links** to link GA4 and GSC.

**Canonical rule (code):** sitemap `loc`, `alternates.canonical`, and internal links must use the same path. Directory verticals use `/directory/{type}` (not `?type=`). Search (`/search`) and submit thanks are `noindex` and excluded from the sitemap.

No API keys are required for basic URL inspection and sitemap submission. For automation: `npm run gsc:submit-sitemap` (see `.env.example`).
