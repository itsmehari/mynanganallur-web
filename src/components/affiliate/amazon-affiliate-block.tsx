import { Section } from "@/components/home/section";
import { getAmazonAffiliateUrl } from "@/lib/amazon-affiliate";

function IconCart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <path d="M2 3h2l1.2 12.1A2 2 0 0 0 7.2 17H17.8a2 2 0 0 0 2-1.7L21 7H6" />
    </svg>
  );
}

const disclosureShort =
  "mynanganallur.in is a participant in the Amazon Associates Programme. As an Amazon Associate we earn from qualifying purchases.";

export type AmazonAffiliatePlacement =
  | "home-featured"
  | "article-endcap"
  | "hub-local-news"
  | "hub-directory"
  | "hub-jobs"
  | "hub-properties"
  | "hub-events"
  | "hub-area"
  | "hub-topic"
  | "footer-global";

type BlockProps = {
  variant: "home" | "compact" | "rail" | "footer";
  placement: AmazonAffiliatePlacement;
  className?: string;
};

/**
 * Shared Amazon Associates UI. Renders nothing if `NEXT_PUBLIC_AMAZON_AFFILIATE_URL` is unset.
 * Use `data-affiliate-placement` for future GA4 event mapping.
 */
export function AmazonAffiliateBlock({
  variant,
  placement,
  className = "",
}: BlockProps) {
  const href = getAmazonAffiliateUrl();
  if (!href) return null;

  const dataPlacement = { "data-affiliate-placement": placement };

  if (variant === "footer") {
    return (
      <div
        className={`text-xs leading-relaxed text-[var(--footer-muted)] ${className}`}
        {...dataPlacement}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-semibold text-[var(--footer-link)] underline-offset-2 transition hover:text-[var(--footer-link-hover)] hover:underline"
        >
          Shop on Amazon (affiliate)
        </a>
        <span className="text-[var(--footer-muted)]">
          {" "}
          — we earn from qualifying purchases; prices are on Amazon.
        </span>
      </div>
    );
  }

  if (variant === "rail") {
    return (
      <aside
        className={`rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,var(--accent)_4%)] p-4 shadow-sm ${className}`}
        aria-label="Affiliate"
        {...dataPlacement}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
          Affiliate
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
          Shop & support
        </p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
          Use our link when you buy on Amazon — at no extra cost to you.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-3 flex w-full items-center justify-center rounded-full bg-[var(--foreground)] px-4 py-2.5 text-center text-xs font-bold text-[var(--background)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Continue to Amazon
        </a>
        <p className="mt-3 text-[10px] leading-snug text-[var(--muted)]">
          {disclosureShort}
        </p>
      </aside>
    );
  }

  if (variant === "compact") {
    return (
      <section
        className={className}
        aria-label="Affiliate"
        {...dataPlacement}
      >
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,var(--accent)_4%)] p-5 shadow-sm">
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-30 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, var(--accent), transparent 70%)",
            }}
          />
          <div className="relative flex gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[var(--accent-fg)]"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 72%, #000))",
              }}
              aria-hidden
            >
              <IconCart className="h-6 w-6 opacity-95" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                Affiliate
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                Support this site with your next Amazon order
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                {disclosureShort}
              </p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-2.5 text-xs font-bold text-[var(--background)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Shop via our link
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* home */
  return (
    <Section
      id="shop-affiliate"
      eyebrow="Affiliate"
      title="Shop online & support this site"
      subtitle="When you use our link and buy eligible items, we may earn a small commission at no extra cost to you."
      className={className}
    >
      <div
        {...dataPlacement}
        className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--accent)_5%)] shadow-md"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-35 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--accent), transparent 72%)",
          }}
        />
        <div className="relative grid gap-6 p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8 sm:p-8">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-[var(--accent-fg)] shadow-sm"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 72%, #000))",
            }}
            aria-hidden
          >
            <IconCart className="opacity-95" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold leading-snug text-[var(--foreground)] sm:text-lg">
              Continue to Amazon for everyday essentials, books, electronics,
              and more — same prices you expect.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
              {disclosureShort}
            </p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] px-8 text-sm font-bold text-[var(--background)] shadow-lg transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:h-12 sm:self-center"
          >
            Shop via our link
          </a>
        </div>
      </div>
    </Section>
  );
}
