# Scaling strategy

## Near term (single region, single city)

- Neon **autoscale** or reasonable compute; connection pooling for serverless (`@neondatabase/serverless` + Drizzle).
- Next.js caching to protect the database on home and hub pages.

## Medium term

- **Read replicas** on Neon for reporting queries if admin analytics grows.
- **Cache layer** (Redis/KV) for popular list endpoints if DB CPU becomes bound.

## Multi-city

- **Data:** `city_id` on all location-scoped entities; avoid hardcoding a legacy city name in application code — use config or DB (`SITE_CITY_SLUG`, etc.).
- **Traffic:** Optional geographic routing later; not required at launch.

## Background processing

- Move heavy work (large image processing, bulk imports) off request path into queued jobs when usage justifies it.

## Bottlenecks to avoid (from legacy)

- Homepage aggregating many unrelated queries without cache — use **tagged** partial caching or stale-while-revalidate.
