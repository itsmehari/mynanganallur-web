/** IAB-style sizes supported by the display-ad renderer */
export const AD_SIZES = [
  "728x90",
  "336x280",
  "300x250",
  "320x50",
] as const;

export type AdSize = (typeof AD_SIZES)[number];

/**
 * Visual theme key for CSS (`ad-banner--{design}`).
 * `resumebuilder` is a legacy alias — normalize to `resumedoctor` for icons/classes.
 */
export type AdDesign =
  | "resumedoctor"
  | "mycovai"
  | "colourchemist"
  | "bseri"
  | "default";

export type Creative = {
  id: string;
  advertiser: string;
  url: string;
  slot_ids: readonly string[];
  sizes: readonly AdSize[];
  design: AdDesign;
  headline: string;
  tagline: string;
  active: boolean;
};
