import { getSiteUrl } from "@/lib/env";

/** Absolute canonical URL — `path` must start with `/`. */
export function canonicalUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
