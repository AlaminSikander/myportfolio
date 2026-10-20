import type { MetadataRoute } from "next";
import { person, seo } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${person.name} — Portfolio`,
    short_name: person.shortName,
    description: seo.description,
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
