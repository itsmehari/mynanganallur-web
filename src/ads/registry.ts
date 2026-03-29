import type { Creative } from "./types";

/**
 * Portable slot ids (shared across sites). New pages add a string here, then
 * reference it from templates.
 *
 * Wired on mynanganallur.in (v1):
 * - homepage-top, homepage-mid → `page.tsx`
 * - content-top, sidebar → `/local-news` index
 * - article-top, article-mid → `EditorialArticle`
 * - content-mid → `/local-news/topic/[topic]`
 * - listings-index-top → `/directory`
 * - jobs-index-mid → `/jobs`
 * - events-index-mid → `/local-events`
 * - listings-detail-mid → `/areas/[slug]`
 */
export const ALL_SLOTS = [
  "article-top",
  "article-mid",
  "homepage-top",
  "homepage-mid",
  "content-top",
  "content-mid",
  "listing-top",
  "sidebar",
  "global-top",
  "jobs-index-top",
  "jobs-index-mid",
  "jobs-detail-mid",
  "hostels-index-top",
  "hostels-index-mid",
  "hostels-detail-mid",
  "rent-lease-index-top",
  "rent-lease-detail-mid",
  "buy-sell-index-top",
  "buy-sell-detail-mid",
  "classified-ads-index-top",
  "classified-ads-detail-mid",
  "listings-index-top",
  "listings-detail-mid",
  "events-index-top",
  "events-index-mid",
  "events-detail-mid",
  "coworking-index-top",
  "coworking-detail-mid",
  "elections-top",
  "elections-mid",
  "discover-top",
] as const;

export type AdSlotId = (typeof ALL_SLOTS)[number];

const ALL = ALL_SLOTS as unknown as readonly string[];

export const ADS: Creative[] = [
  {
    id: "resumedoctor-1",
    advertiser: "ResumeDoctor",
    url: "https://www.resumedoctor.in/",
    slot_ids: ALL,
    sizes: ["728x90", "336x280", "300x250", "320x50"],
    design: "resumedoctor",
    headline: "Make your resume in minutes",
    tagline:
      "Choose a layout, add your details, download and send to employers",
    active: true,
  },
  {
    id: "mycovai-1",
    advertiser: "MyCovai",
    url: "https://mycovai.in",
    slot_ids: ALL,
    sizes: ["728x90", "336x280", "300x250", "320x50"],
    design: "mycovai",
    headline: "MyCovai — Your Covai Community",
    tagline: "News, local info & community for Coimbatore",
    active: true,
  },
  {
    id: "colourchemist-1",
    advertiser: "Colourchemist",
    url: "https://colourchemist.co.in",
    slot_ids: ALL,
    sizes: ["728x90", "336x280", "300x250", "320x50"],
    design: "colourchemist",
    headline: "Colourchemist — Graphic & Web Design Studio",
    tagline: "Branding, print & digital — logos, sites, campaigns",
    active: true,
  },
  {
    id: "bseri-1",
    advertiser: "BSERI",
    url: "https://bseri.net",
    slot_ids: ALL,
    sizes: ["728x90", "336x280", "300x250", "320x50"],
    design: "bseri",
    headline: "ISO Standards Education & Training",
    tagline: "9001 · 27001 · 22301 — Implementer courses",
    active: true,
  },
];
