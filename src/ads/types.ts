/** IAB-style sizes supported by the display-ad renderer */
export const AD_SIZES = [
  "728x90",
  "468x60",
  "336x280",
  "300x250",
  "320x50",
] as const;

export type AdSize = (typeof AD_SIZES)[number];

/**
 * Visual theme key for CSS (`mn-promo-card--{design}`).
 * `resumebuilder` is a legacy alias — normalize to `resumedoctor` for icons/classes.
 */
export type AdDesign =
  | "resumedoctor"
  | "mynanganallur"
  | "colourchemist"
  | "bseri"
  | "default";

/**
 * Horizontal / rectangle creative layouts (reference design system).
 * When omitted, derived from `design` in `resolveBannerTemplate`.
 */
export type BannerTemplate =
  | "diagonal-corporate"
  | "minimal-service"
  | "tech-gradient"
  | "split-promo"
  | "modular";

export type Creative = {
  id: string;
  advertiser: string;
  url: string;
  slot_ids: readonly string[];
  sizes: readonly AdSize[];
  design: AdDesign;
  /** Visual layout; defaults from design if not set */
  bannerTemplate?: BannerTemplate;
  /** Short labels for tech / modular templates (max 3 shown) */
  bannerFeatures?: readonly string[];
  headline: string;
  tagline: string;
  active: boolean;
  /**
   * Optional hero image — shown on leaderboard / rectangles when `sizes` permit.
   * Use site-relative `/…` paths or HTTPS URLs allowed in `next.config` `remotePatterns`.
   */
  heroImageUrl?: string;
  heroImageAlt?: string;
};
