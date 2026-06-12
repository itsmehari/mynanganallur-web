import type { Metadata } from "next";
import {
  META_DESCRIPTION,
  PAGE_TITLE,
  WhatsappJoinPage,
} from "@/components/community/whatsapp-join-page";
import { WHATSAPP_PAGE_PATH } from "@/lib/community/whatsapp";
import { getSiteUrl } from "@/lib/env";
import { buildOgImageUrl } from "@/lib/seo/og";

const base = getSiteUrl();
const canonical = `${base}${WHATSAPP_PAGE_PATH}`;

const ogImage = buildOgImageUrl({
  title: "Nanganallur WhatsApp Group",
  kind: "community",
  locality: "Nanganallur, Chennai",
});

export const metadata: Metadata = {
  title: "Join the Nanganallur WhatsApp Group · Local Community · mynanganallur.in",
  description: META_DESCRIPTION,
  alternates: { canonical },
  keywords: [
    "Nanganallur WhatsApp group",
    "Nanganallur community group",
    "join Nanganallur WhatsApp",
    "Madipakkam WhatsApp group",
    "Adambakkam local group",
    "Chennai neighbourhood WhatsApp",
    "Nanganallur local news",
    "Nanganallur jobs",
    "Nanganallur events",
    "mynanganallur",
  ],
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
    title: PAGE_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    url: canonical,
    siteName: "mynanganallur.in",
    locale: "en_IN",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Join the Nanganallur WhatsApp community group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the My Nanganallur WhatsApp group",
    description: META_DESCRIPTION,
    images: [ogImage],
  },
};

export default function NanganallurWhatsappGroupPage() {
  return <WhatsappJoinPage />;
}
