# Content architecture

## Editorial workflow

1. **Draft** in admin — preview optional (server-rendered draft route with token or role gate).
2. **Publish** sets `published_at` and `status = published` atomically.
3. **Unpublish** sets `archived` without deleting (retain slug history for redirects if needed).

## Categories and tags

- **Categories:** controlled vocabulary for navigation SEO.
- **Tags:** optional free-form for clustering; avoid tag-sprawl with merge tools later.

## Locality attachment

- Prefer **`locality_id`** FK to normalized table; allow `location_label` override for edge cases.
- **City** always set for locality-scoped content (Nanganallur desk); nullable only for India-wide editorial.

## Media

- Store **URLs** to object storage (e.g. Vercel Blob, S3-compatible) — not database blobs.
- Image optimization via `next/image` with allowed remote patterns.

## Legacy lesson

- Avoid parallel **static file** and **DB** article systems; one source of truth prevents sitemap and canonical conflicts.
