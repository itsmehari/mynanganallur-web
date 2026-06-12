import Script from "next/script";

type Props = {
  measurementId: string;
};

/**
 * GA4 gtag.js loader — equivalent to the standard Google tag snippet.
 * Mounted once in root `app/layout.tsx` via `SiteAnalytics`.
 */
export function GoogleAnalyticsScripts({ measurementId }: Props) {
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
