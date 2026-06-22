import type { FaqItem } from "@/lib/seo/faq-jsonld";

export const OPEN_TO_WORK_HUB = {
  path: "/careers/open-to-work",
  eyebrow: "Open to Work",
  h1: "People open to referrals",
  intro:
    "Professionals seeking roles or referrals in banking, finance, operations, and nearby sectors. Share a profile if you are looking — or browse if you can refer someone.",
  geoQuestion: "Where can I find job seekers open to referrals near Nanganallur?",
  geoDirectAnswer:
    "mynanganallur.in lists Open to Work profiles from residents and professionals seeking roles in Chennai, Bangalore, Coimbatore, and remote or hybrid setups. Each profile has a detail page with experience summary and contact options when provided.",
  localityLine:
    "Profiles from Nanganallur, Chennai, Bangalore, Coimbatore, and remote-friendly candidates.",
  metaTitle: "Open to Work · Job seeker profiles · mynanganallur.in",
  metaDescription:
    "Professionals open to work and referrals in banking, finance, and operations. Browse profiles or share yours on mynanganallur.in.",
  keywords: [
    "open to work Chennai",
    "job seeker referrals Bangalore",
    "banking jobs referral",
    "finance jobs Tamil Nadu",
    "mynanganallur careers",
  ],
  ogTitle: "Open to Work profiles",
  itemListName: "Open to Work profiles",
  faq: [
    {
      q: "What is Open to Work on mynanganallur.in?",
      a: "Open to Work is for people seeking roles or referrals — not employer vacancies. Browse profiles if you can refer someone, or submit your own profile for moderation.",
    },
    {
      q: "How do I share my Open to Work profile?",
      a: "Use Submit → Open to Work. Include your headline, experience summary, preferred locations, and at least one contact method. We review within 24 hours.",
    },
    {
      q: "Is there a fee to list or contact someone?",
      a: "No fee should be paid to mynanganallur.in to list or respond to a profile. If anyone asks for money, treat it as a red flag.",
    },
  ] satisfies FaqItem[],
  emptyTitle: "No profiles match your search",
  emptyBody: "Try different keywords or share your profile so referrers can find you.",
  emptyCtaHref: "/submit/open-to-work",
  emptyCtaLabel: "Share your profile",
} as const;
