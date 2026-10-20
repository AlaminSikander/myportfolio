import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/content";
import { siteName } from "@/lib/seo";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings();
  return {
    name: siteName(settings),
    short_name: settings.shortName,
    description: settings.seoDescription,
    start_url: "/",
    display: "browser",
    background_color: "#f6f7fb",
    theme_color: "#0b1230",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
