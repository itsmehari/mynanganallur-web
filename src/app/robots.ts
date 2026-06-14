import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mynanganallur.in";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/upload", "/my/"],
      },
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      `${base}/sitemap-news.xml`,
      `${base}/sitemap-images.xml`,
    ],
  };
}
