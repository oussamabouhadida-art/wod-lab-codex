import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient, hasSupabasePublicEnv } from "@/lib/supabase/public";
import { WodTypeBadge } from "@/components/wod/WodTypeBadge";
import { getBaseUrl, getLocaleCopy, supportedLocales } from "@/lib/seo";

export async function generateStaticParams() {
  if (!hasSupabasePublicEnv()) return [];
  const supabase = createPublicClient();
  const { data } = await supabase.from("wods").select("slug").eq("is_published", true);
  const slugs = (data ?? []).map((d) => d.slug);

  return ["en", "fr", "es"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  if (!hasSupabasePublicEnv()) return {};
  const { locale, slug } = await params;
  const supabase = createPublicClient();
  const { data: wod } = await supabase.from("wods").select("*").eq("slug", slug).eq("is_published", true).single();
  if (!wod) return {};

  const base = getBaseUrl();
  const copy = getLocaleCopy(locale);
  const title = locale === "fr" ? wod.title_fr : locale === "es" ? wod.title_es : wod.title_en;
  const description = locale === "fr" ? wod.description_fr : locale === "es" ? wod.description_es : wod.description_en;
  const finalDescription = description ?? wod.content_en.slice(0, 140);
  const alternates = Object.fromEntries(
    supportedLocales.map((lang) => [lang, `${base}/${lang}/wods/${wod.slug}`]),
  ) as Record<"en" | "fr" | "es", string>;

  return {
    title: `${title} | ${copy.wodsTitle}`,
    description: finalDescription,
    keywords: [...copy.keywords],
    alternates: {
      canonical: alternates[(locale as "en" | "fr" | "es") ?? "en"],
      languages: {
        ...alternates,
        "x-default": alternates.en,
      },
    },
    openGraph: {
      title,
      description: finalDescription,
      url: `${base}/${locale}/wods/${wod.slug}`,
      type: "article",
      images: ["/images/home-hero-crossfit.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: finalDescription,
      images: ["/images/home-hero-crossfit.png"],
    },
  };
}

export default async function WodDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;

  if (!hasSupabasePublicEnv()) notFound();

  const supabase = createPublicClient();
  const { data: wod } = await supabase.from("wods").select("*").eq("slug", slug).eq("is_published", true).single();

  if (!wod) notFound();

  const title = locale === "fr" ? wod.title_fr : locale === "es" ? wod.title_es : wod.title_en;
  const description = locale === "fr" ? wod.description_fr : locale === "es" ? wod.description_es : wod.description_en;
  const content = locale === "fr" ? wod.content_fr : locale === "es" ? wod.content_es : wod.content_en;
  const base = getBaseUrl();
  const workoutJsonLd = {
    "@context": "https://schema.org",
    "@type": "ExercisePlan",
    name: title,
    description: description ?? content.slice(0, 180),
    category: "CrossFit WoD",
    activityFrequency: "P1D",
    url: `${base}/${locale}/wods/${wod.slug}`,
    inLanguage: locale,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "WodLab", item: `${base}/${locale}` },
      { "@type": "ListItem", position: 2, name: "WoDs", item: `${base}/${locale}/wods` },
      { "@type": "ListItem", position: 3, name: title, item: `${base}/${locale}/wods/${wod.slug}` },
    ],
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workoutJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-6xl uppercase text-heading">{title}</h1>
        <WodTypeBadge type={wod.wod_type} />
      </div>
      {description ? <p className="mb-6 text-body">{description}</p> : null}
      <pre className="rounded-[4px] border border-divider bg-surface-1 p-4 font-mono text-sm whitespace-pre-wrap">{content}</pre>
    </section>
  );
}
