import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  const base = getBaseUrl();

  return {
    name: "WodLab",
    short_name: "WodLab",
    description: "CrossFit WoD platform with structured one-hour workouts.",
    start_url: "/en",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    scope: "/",
    id: base,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

