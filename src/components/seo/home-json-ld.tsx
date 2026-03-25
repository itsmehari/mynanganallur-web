import { getSiteUrl } from "@/lib/env";

export function HomeJsonLd() {
  const base = getSiteUrl();
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "mynanganallur.in",
        description:
          "Nanganallur local news, directory, jobs, events, and neighbourhood hubs.",
        publisher: { "@id": `${base}/#org` },
        inLanguage: "en-IN",
      },
      {
        "@type": "Organization",
        "@id": `${base}/#org`,
        name: "mynanganallur.in",
        url: base,
        logo: `${base}/favicon.ico`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
