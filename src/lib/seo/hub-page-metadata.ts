import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";
import { buildOgImageUrl, type OgKind } from "@/lib/seo/og";

export function buildHubMetadata(opts: {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  ogKind: OgKind;
  ogTitle: string;
  locality?: string;
}): Metadata {
  const base = getSiteUrl();
  const canonical = `${base}${opts.path}`;
  const ogImage = buildOgImageUrl({
    title: opts.ogTitle,
    kind: opts.ogKind,
    locality: opts.locality ?? "Nanganallur, Chennai",
  });

  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical },
    keywords: opts.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      type: "website",
      url: canonical,
      siteName: "mynanganallur.in",
      locale: "en_IN",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: opts.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [ogImage],
    },
  };
}
