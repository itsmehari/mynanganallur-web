import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalyticsAffiliateTracker } from "./google-analytics-affiliate-tracker";
import { GoogleAnalyticsDisplayAdTracker } from "./google-analytics-display-ad-tracker";
import { GoogleAnalyticsRouteTracker } from "./google-analytics-route-tracker";
import { GoogleAnalyticsScripts } from "./google-analytics-scripts";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

/**
 * Single entry for all site-wide measurement. Mounted once in `app/layout.tsx`
 * so every route (public, admin, API error pages, etc.) is covered.
 */
export function SiteAnalytics() {
  return (
    <>
      {gaId ? (
        <>
          <GoogleAnalyticsScripts measurementId={gaId} />
          <Suspense fallback={null}>
            <GoogleAnalyticsRouteTracker measurementId={gaId} />
          </Suspense>
          <GoogleAnalyticsAffiliateTracker />
          <GoogleAnalyticsDisplayAdTracker />
        </>
      ) : null}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
