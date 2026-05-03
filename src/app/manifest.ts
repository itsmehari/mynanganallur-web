import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "mynanganallur.in — neighbourhood news, jobs, events",
    short_name: "mynanganallur",
    description:
      "Hyperlocal news, directory, jobs, events and properties for Nanganallur and nearby neighbourhoods.",
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    orientation: "portrait",
    lang: "en-IN",
    categories: ["news", "lifestyle", "social"],
    icons: [
      {
        src: "/home-hero-scene.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      { name: "News", url: "/local-news" },
      { name: "Jobs", url: "/jobs" },
      { name: "Events", url: "/local-events" },
      { name: "Submit", url: "/submit" },
    ],
  };
}
