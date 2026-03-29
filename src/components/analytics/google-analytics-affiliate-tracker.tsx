"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Tracks outbound affiliate clicks from blocks marked with `data-affiliate-placement`.
 * Emits GA4 custom event: `affiliate_click`.
 */
export function GoogleAnalyticsAffiliateTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const placementHost = anchor.closest("[data-affiliate-placement]");
      if (!(placementHost instanceof HTMLElement)) return;

      const placement = placementHost.dataset.affiliatePlacement;
      if (!placement) return;
      if (typeof window.gtag !== "function") return;

      let destinationHost = "";
      try {
        destinationHost = new URL(anchor.href).hostname;
      } catch {
        destinationHost = "";
      }

      window.gtag("event", "affiliate_click", {
        affiliate_placement: placement,
        destination_url: anchor.href,
        destination_host: destinationHost,
      });
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
