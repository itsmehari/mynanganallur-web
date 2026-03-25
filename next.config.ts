import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Alternate public paths → canonical `/local-news` and `/local-events`.
   * Keeps short `/events` working; branded aliases for bookmarks and inbound links.
   */
  async redirects() {
    return [
      {
        source: "/events",
        destination: "/local-events",
        permanent: true,
      },
      {
        source: "/events/:path*",
        destination: "/local-events/:path*",
        permanent: true,
      },
      {
        source: "/nanganallur-local-news",
        destination: "/local-news",
        permanent: true,
      },
      {
        source: "/nanganallur-local-news/:path*",
        destination: "/local-news/:path*",
        permanent: true,
      },
      {
        source: "/nanganallur-local-events",
        destination: "/local-events",
        permanent: true,
      },
      {
        source: "/nanganallur-local-events/:path*",
        destination: "/local-events/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
