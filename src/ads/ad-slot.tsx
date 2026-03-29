import type { AdSize, Creative } from "./types";
import { AdBannerIcon, normalizeAdDesign } from "./ad-banner-icons";
import {
  pickCreativesForRow,
  selectCreative,
  warnNoEligibleAds,
} from "./select-creative";

function ctaForSize(size: AdSize): string {
  if (size === "728x90") return "Visit site";
  if (size === "320x50") return "Visit";
  return "Learn more";
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
  const bannerClass = `ad-banner ad-banner--${size} ad-banner--${designClass}`;
  const ariaLabel = `${creative.advertiser} - ${creative.headline}`;
  const showTagline = size !== "320x50";

  return (
    <section
      className={`ad-banner-host ${className}`.trim()}
      aria-label="Sponsored content"
      data-display-ad-placement={slotId}
    >
      <span className="ad-banner-host__label">Ad</span>
      <a
        href={creative.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={ariaLabel}
        className={bannerClass}
        data-display-ad-creative={creative.id}
      >
        <span className="ad-banner__inner">
          <span className="ad-banner__icon" aria-hidden>
            <AdBannerIcon design={creative.design} className="ad-banner__svg" />
          </span>
          <span className="ad-banner__body">
            <span className="ad-banner__headline">{creative.headline}</span>
            {showTagline ? (
              <span className="ad-banner__tagline">{creative.tagline}</span>
            ) : null}
            <span className="ad-banner__cta">{ctaForSize(size)}</span>
          </span>
        </span>
      </a>
    </section>
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
      <div className={`ad-banner-row ${className}`.trim()}>
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
    <div className={`ad-banner-row ad-banner-row--deduped ${className}`.trim()}>
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
