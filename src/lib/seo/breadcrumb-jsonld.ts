import { getSiteUrl } from "@/lib/env";

export type BreadcrumbItem = {
  name: string;
  href: string;
};

/**
 * Build a BreadcrumbList JSON-LD payload. Pass items in display order, e.g.:
 *   [{ name: "Home", href: "/" },
 *    { name: "Jobs", href: "/jobs" },
 *    { name: "Madipakkam Cafe", href: "/jobs/madipakkam-cafe" }]
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.href.startsWith("http") ? it.href : `${base}${it.href}`,
    })),
  };
}
