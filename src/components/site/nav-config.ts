import { nanganallurAreas } from "@/lib/nanganallur-areas";
import { TOPIC_SLUG_TO_CATEGORY } from "@/lib/news-topics";

export type MegaNavLink = {
  href: string;
  label: string;
  description?: string;
};

export type MegaNavColumn = {
  heading: string;
  links: MegaNavLink[];
};

export type MegaNavFeatured = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

export type MegaNavSection = {
  id: string;
  label: string;
  columns: MegaNavColumn[];
  featured?: MegaNavFeatured;
};

const topicLinks: MegaNavLink[] = Object.entries(TOPIC_SLUG_TO_CATEGORY).map(
  ([slug, category]) => ({
    href: `/local-news/topic/${slug}`,
    label: category,
    description: `Stories filed under ${category}`,
  }),
);

const areaLinks: MegaNavLink[] = nanganallurAreas.map((z) => ({
  href: `/areas/${z.slug}`,
  label: z.label,
  description: z.blurb,
}));

/** Split areas into two balanced columns for the mega nav */
function splitAreas(): [MegaNavLink[], MegaNavLink[]] {
  const mid = Math.ceil(areaLinks.length / 2);
  return [areaLinks.slice(0, mid), areaLinks.slice(mid)];
}

const [areasColA, areasColB] = splitAreas();

export const MEGA_NAV_SECTIONS: MegaNavSection[] = [
  {
    id: "news",
    label: "News",
    featured: {
      title: "Nanganallur newsroom",
      description:
        "GCC beats, mobility, elections, and neighbourhood explainers for the south belt.",
      href: "/local-news",
      cta: "Open latest",
    },
    columns: [
      {
        heading: "Hub",
        links: [
          {
            href: "/local-news",
            label: "All local news",
            description: "Reverse-chronological feed and signals.",
          },
          {
            href: "/local-news/feed.xml",
            label: "RSS feed",
            description: "Subscribe in your reader.",
          },
          {
            href: "/news",
            label: "News index",
            description: "Alternate entry to coverage.",
          },
        ],
      },
      {
        heading: "Topics",
        links: topicLinks,
      },
    ],
  },
  {
    id: "explore",
    label: "Explore",
    featured: {
      title: "List your business",
      description:
        "Shops, schools, tutors, clinics — add your place to the Nanganallur directory. Free, reviewed within 24 hours.",
      href: "/submit/business",
      cta: "Add to directory",
    },
    columns: [
      {
        heading: "Directory",
        links: [
          {
            href: "/directory",
            label: "City directory",
            description: "Schools, tutors, services, and local listings.",
          },
          {
            href: "/submit/business",
            label: "List your business",
            description: "Add your shop, clinic, or tuition to the directory.",
          },
          {
            href: "/properties",
            label: "Properties",
            description: "Houses and flats for rent or sale.",
          },
          {
            href: "/nanganallur-connect",
            label: "Nanganallur Connect",
            description: "Locality hub — news, jobs, events, listings, and community.",
          },
          {
            href: "/#areas",
            label: "Area map",
            description: "Jump to the neighbourhood map on the home page.",
          },
        ],
      },
      {
        heading: "Core & nearby",
        links: areasColA,
      },
      {
        heading: "Corridors",
        links: areasColB,
      },
    ],
  },
  {
    id: "jobs",
    label: "Jobs",
    featured: {
      title: "Tutors — Math & Science (CBSE)",
      description:
        "Shreyas School of Education, Nanganallur — evening batches, Grades 6–12.",
      href: "/jobs/shreyas-tutors-math-science-nanganallur",
      cta: "View listing",
    },
    columns: [
      {
        heading: "Work",
        links: [
          {
            href: "/jobs",
            label: "Job board",
            description: "Roles across Nanganallur, OMR, and nearby corridors.",
          },
          {
            href: "/careers/open-to-work",
            label: "Open to Work",
            description: "Profiles seeking roles and referrals.",
          },
        ],
      },
    ],
  },
  {
    id: "local-events",
    label: "Events",
    columns: [
      {
        heading: "Happening",
        links: [
          {
            href: "/local-events",
            label: "Local events calendar",
            description: "Temple utsavams, meetups, culture, and civic dates.",
          },
        ],
      },
    ],
  },
];

export function getMegaNavSection(
  id: string | null,
): MegaNavSection | undefined {
  if (!id) return undefined;
  return MEGA_NAV_SECTIONS.find((s) => s.id === id);
}
