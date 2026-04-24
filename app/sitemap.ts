import type { MetadataRoute } from "next";
import { createPublicClient, hasSupabasePublicEnv } from "@/lib/supabase/public";
import { getBaseUrl, supportedLocales } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const now = new Date();

  const staticRoutes = supportedLocales.flatMap((locale) => [
    {
      url: `${base}/${locale}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${base}/${locale}/wods`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.95,
    },
    {
      url: `${base}/${locale}/about`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]);

  if (!hasSupabasePublicEnv()) {
    return staticRoutes;
  }

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("wods")
    .select("slug,updated_at,published_at")
    .eq("is_published", true);

  const dynamicRoutes =
    data?.flatMap((wod) =>
      supportedLocales.map((locale) => ({
        url: `${base}/${locale}/wods/${wod.slug}`,
        lastModified: new Date(wod.updated_at ?? wod.published_at ?? now),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ) ?? [];

  return [...staticRoutes, ...dynamicRoutes];
}

