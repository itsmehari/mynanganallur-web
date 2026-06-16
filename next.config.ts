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
      {
        source: "/places",
        destination: "/directory",
        permanent: true,
      },
      {
        source: "/places/:path*",
        destination: "/directory/:path*",
        permanent: true,
      },
      {
        source: "/directory/business",
        destination: "/directory/industry",
        permanent: true,
      },
      {
        source: "/whatsapp",
        destination: "/nanganallur-whatsapp-group",
        permanent: true,
      },
      {
        source: "/community/whatsapp",
        destination: "/nanganallur-whatsapp-group",
        permanent: true,
      },
      {
        source: "/join-nanganallur-whatsapp-group",
        destination: "/nanganallur-whatsapp-group",
        permanent: true,
      },
      {
        source: "/connect",
        destination: "/nanganallur-connect",
        permanent: true,
      },
      {
        source: "/nanganallur",
        destination: "/nanganallur-connect",
        permanent: true,
      },
      {
        source: "/about-nanganallur",
        destination: "/nanganallur-connect",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c9admin.cottage9.com",
        pathname: "/uploads/5581/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/thumb/**",
      },
      /** Partner-hosted hero imagery for display ads (`Creative.heroImageUrl`) */
      { protocol: "https", hostname: "www.resumedoctor.in", pathname: "/**" },
      { protocol: "https", hostname: "resumedoctor.in", pathname: "/**" },
      { protocol: "https", hostname: "bseri.net", pathname: "/**" },
      { protocol: "https", hostname: "www.bseri.net", pathname: "/**" },
      { protocol: "https", hostname: "colourchemist.co.in", pathname: "/**" },
      { protocol: "https", hostname: "www.colourchemist.co.in", pathname: "/**" },
      { protocol: "https", hostname: "mynanganallur.in", pathname: "/**" },
      { protocol: "https", hostname: "www.mynanganallur.in", pathname: "/**" },
    ],
  },
};

export default nextConfig;
