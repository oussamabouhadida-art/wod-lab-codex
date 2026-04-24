import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { WodGrid } from "@/components/wod/WodGrid";
import { fetchPublishedWods } from "@/lib/actions/wod.actions";
import { getAlternates, getBaseUrl, getLocaleCopy } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getLocaleCopy(locale);
  const alternates = getAlternates("/wods");

  return {
    title: copy.wodsTitle,
    description: copy.wodsDescription,
    keywords: [...copy.keywords],
    alternates,
    openGraph: {
      title: copy.wodsTitle,
      description: copy.wodsDescription,
      url: alternates.languages[(locale as "en" | "fr" | "es") ?? "en"],
      images: ["/images/home-hero-crossfit.png"],
    },
  };
}

export default async function WodsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const wods = await fetchPublishedWods();
  const base = getBaseUrl();
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "WodLab", item: `${base}/${locale}` },
      { "@type": "ListItem", position: 2, name: "WoDs", item: `${base}/${locale}/wods` },
    ],
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <WodGrid wods={wods} locale={locale} />
    </section>
  );
}
