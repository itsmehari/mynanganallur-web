import type { AdDesign, BannerTemplate } from "./types";
import { normalizeAdDesign } from "./ad-banner-icons";

export function resolveBannerTemplate(
  design: AdDesign | string,
  override?: BannerTemplate,
): BannerTemplate {
  if (override) return override;
  const d = normalizeAdDesign(design);
  switch (d) {
    case "bseri":
      return "diagonal-corporate";
    case "mynanganallur":
      return "minimal-service";
    case "resumedoctor":
      return "tech-gradient";
    case "colourchemist":
      return "split-promo";
    default:
      return "modular";
  }
}
