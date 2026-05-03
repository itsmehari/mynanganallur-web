import type { AdSize, Creative } from "./types";
import { AdBannerIcon, normalizeAdDesign } from "./ad-banner-icons";
import {
  pickCreativesForRow,
  selectCreative,
  warnNoEligibleAds,
} from "./select-creative";

function ctaForSize(size: AdSize): string {
  if (size === "728x90") return "Visit site";
  if (size === "468x60") return "Visit ResumeDoctor";
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
  const bannerClass = `mn-promo-card mn-promo-card--${size} mn-promo-card--${designClass}`;
  const ariaLabel = `${creative.advertiser} — ${creative.headline}`;
  const showTagline = size !== "320x50" && size !== "468x60";

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
          <span className="mn-promo-card__icon" aria-hidden>
            <AdBannerIcon design={creative.design} className="mn-promo-card__svg" />
          </span>
          <span className="mn-promo-card__body">
            <span className="mn-promo-card__headline">{creative.headline}</span>
            {showTagline ? (
              <span className="mn-promo-card__tagline">{creative.tagline}</span>
            ) : null}
            <span className="mn-promo-card__cta">{ctaForSize(size)}</span>
          </span>
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
