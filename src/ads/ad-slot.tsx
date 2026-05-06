import Image from "next/image";
import type { AdSize, Creative } from "./types";
import { AdBannerIcon, normalizeAdDesign } from "./ad-banner-icons";
import { resolveBannerTemplate } from "./banner-template";
import {
  pickCreativesForRow,
  selectCreative,
  warnNoEligibleAds,
} from "./select-creative";

function sizeSupportsHero(size: AdSize): boolean {
  return size === "728x90" || size === "336x280" || size === "300x250";
}

function ctaForSize(size: AdSize): string {
  if (size === "728x90") return "Visit site";
  if (size === "468x60") return "Visit ResumeDoctor";
  if (size === "320x50") return "Visit";
  return "Learn more";
}

function horizontalRailSize(size: AdSize): boolean {
  return size === "728x90" || size === "468x60" || size === "320x50";
}

function AdBannerCreative({
  creative,
  size,
  slotId,
  className = "",
}: {
  creative: Creative;
  size: AdSize;
  slotId: string;
  className?: string;
}) {
  const designClass = normalizeAdDesign(creative.design);
  const template = resolveBannerTemplate(
    creative.design,
    creative.bannerTemplate,
  );
  const showHero =
    Boolean(creative.heroImageUrl?.trim()) && sizeSupportsHero(size);

  const bannerClass = [
    "mn-promo-card",
    `mn-promo-card--${size}`,
    `mn-promo-card--tpl-${template}`,
    `mn-promo-card--${designClass}`,
    showHero ? "mn-promo-card--has-hero" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const ariaLabel = `${creative.advertiser} — ${creative.headline}`;
  const showTagline = size !== "320x50" && size !== "468x60";
  const useHorizontalStrip = size === "468x60" || size === "320x50";

  const heroSrc = creative.heroImageUrl?.trim() ?? "";
  const heroAlt =
    creative.heroImageAlt?.trim() ||
    `${creative.headline} — partner promotion`;

  const railMods = horizontalRailSize(size)
    ? "mn-promo-card__rail"
    : "mn-promo-card__rail mn-promo-card__rail--roof";

  const heroSizes728 =
    size === "728x90"
      ? "(max-width: 760px) 100vw, min(272px, 38vw)"
      : size === "336x280"
        ? "(max-width: 420px) 100vw, 336px"
        : "(max-width: 380px) 100vw, 300px";

  const features = (creative.bannerFeatures ?? []).slice(0, 3);
  const showFeatureRow =
    features.length > 0 &&
    (template === "tech-gradient" || template === "modular") &&
    !useHorizontalStrip;

  const splitPromoCopyFirst =
    template === "split-promo" &&
    !useHorizontalStrip &&
    (size === "728x90" || size === "336x280" || size === "300x250");

  const showBrandmark = template === "modular" && !useHorizontalStrip;

  const visualBlock = (
    <span className="mn-promo-card__visual">
      {showHero ? (
        <span className="mn-promo-card__hero">
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            sizes={heroSizes728}
            className="mn-promo-card__hero-img"
          />
        </span>
      ) : (
        <span className={railMods} aria-hidden>
          <AdBannerIcon
            design={creative.design}
            className="mn-promo-card__svg"
          />
        </span>
      )}
    </span>
  );

  const copyBlock = (
    <span
      className={
        useHorizontalStrip
          ? "mn-promo-card__body mn-promo-card__body--hstrip"
          : "mn-promo-card__body"
      }
    >
      {showBrandmark ? (
        <span className="mn-promo-card__brandmark">{creative.advertiser}</span>
      ) : null}
      {showFeatureRow ? (
        <span className="mn-promo-card__features" aria-hidden>
          {features.map((label) => (
            <span key={label} className="mn-promo-card__feature">
              {label}
            </span>
          ))}
        </span>
      ) : null}
      <span className="mn-promo-card__headline">{creative.headline}</span>
      {showTagline ? (
        <span className="mn-promo-card__tagline">{creative.tagline}</span>
      ) : null}
      <span className="mn-promo-card__cta mn-promo-card__cta--pill">
        {ctaForSize(size)}
      </span>
    </span>
  );

  return (
    <aside
      className={`mn-promo-host ${className}`.trim()}
      aria-label="Partner tip"
      data-mn-promo-slot={slotId}
    >
      <span className="mn-promo-host__label">Partner</span>
      <a
        href={creative.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={ariaLabel}
        className={bannerClass}
        data-mn-promo-id={creative.id}
      >
        <span className="mn-promo-card__inner">
          {splitPromoCopyFirst ? (
            <>
              {copyBlock}
              {visualBlock}
            </>
          ) : (
            <>
              {visualBlock}
              {copyBlock}
            </>
          )}
        </span>
      </a>
    </aside>
  );
}

type AdSlotProps = {
  slotId: string;
  size: AdSize;
  /** Deterministic seed (e.g. from `buildRotationSeed(pathname, slotId)`) */
  seed: string;
  className?: string;
};

export function AdSlot({ slotId, size, seed, className = "" }: AdSlotProps) {
  const creative = selectCreative({ slotId, size, seed });
  if (!creative) {
    warnNoEligibleAds(slotId, size);
    return null;
  }
  return (
    <AdBannerCreative
      creative={creative}
      size={size}
      slotId={slotId}
      className={className}
    />
  );
}

type AdSlotRowProps = {
  slotId: string;
  size: AdSize;
  /** Base seed; each cell appends `|row-{i}` for independent deterministic picks */
  seed: string;
  count: number;
  /**
   * If true, pick distinct creatives in stable hash order (up to eligible count).
   * If false, each slot independently selects (same advertiser may repeat).
   */
  dedupeAdvertisers?: boolean;
  className?: string;
};

export function AdSlotRow({
  slotId,
  size,
  seed,
  count,
  dedupeAdvertisers = false,
  className = "",
}: AdSlotRowProps) {
  if (count < 1) return null;

  if (!dedupeAdvertisers) {
    return (
      <div className={`mn-promo-row ${className}`.trim()}>
        {Array.from({ length: count }, (_, i) => (
          <AdSlot
            key={i}
            slotId={slotId}
            size={size}
            seed={`${seed}|row-${i}`}
          />
        ))}
      </div>
    );
  }

  const picked = pickCreativesForRow(slotId, size, seed, count);
  if (picked.length === 0) {
    warnNoEligibleAds(slotId, size);
    return null;
  }

  return (
    <div className={`mn-promo-row mn-promo-row--deduped ${className}`.trim()}>
      {picked.map((creative) => (
        <AdBannerCreative
          key={creative.id}
          creative={creative}
          size={size}
          slotId={slotId}
        />
      ))}
    </div>
  );
}
