"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Tracks clicks on display ads (`data-display-ad-placement` on host, link inside).
 * Emits GA4 custom event: `display_ad_click`.
 */
export function GoogleAnalyticsDisplayAdTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const host = anchor.closest("[data-display-ad-placement]");
      if (!(host instanceof HTMLElement)) return;

      const placement = host.dataset.displayAdPlacement;
      const creativeId = anchor.dataset.displayAdCreative;
      if (!placement) return;
      if (typeof window.gtag !== "function") return;

      let destinationHost = "";
      try {
        destinationHost = new URL(anchor.href).hostname;
      } catch {
        destinationHost = "";
      }

      window.gtag("event", "display_ad_click", {
        display_ad_placement: placement,
        display_ad_creative: creativeId ?? "",
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
