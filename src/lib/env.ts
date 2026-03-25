/** Shared env helpers. Prefer reading at call sites for tree-shaking. */

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://mynanganallur.in";
}
