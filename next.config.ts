import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        source: "/chennai-local-news",
        destination: "/local-news",
        permanent: true,
      },
      {
        source: "/chennai-local-news/:path*",
        destination: "/local-news/:path*",
        permanent: true,
      },
      {
        source: "/chennai-local-events",
        destination: "/local-events",
        permanent: true,
      },
      {
        source: "/chennai-local-events/:path*",
        destination: "/local-events/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
