import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Hero } from "@/components/layout/Hero";
import { WodGrid } from "@/components/wod/WodGrid";
import { fetchPublishedWods } from "@/lib/actions/wod.actions";
import { SeoEditorialSection } from "@/components/layout/SeoEditorialSection";
import { getAlternates, getBaseUrl, getLocaleCopy } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getLocaleCopy(locale);
  const alternates = getAlternates("/");

  return {
    title: copy.homeTitle,
    description: copy.homeDescription,
    keywords: [...copy.keywords],
    alternates,
    openGraph: {
      title: copy.homeTitle,
      description: copy.homeDescription,
      url: alternates.languages[(locale as "en" | "fr" | "es") ?? "en"],
      images: ["/images/home-hero-crossfit.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.homeTitle,
      description: copy.homeDescription,
      images: ["/images/home-hero-crossfit.png"],
    },
  };
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const wods = await fetchPublishedWods();
  const base = getBaseUrl();
  const copy = getLocaleCopy(locale);
  const faqByLocale = {
    en: [
      {
        question: "What is a WoD in CrossFit?",
        answer:
          "A WoD is the Workout of the Day in CrossFit, combining conditioning, gymnastics, and weightlifting in a structured training session.",
      },
      {
        question: "How do I generate workout ideas with WodLab?",
        answer:
          "Browse the Wod library, choose a format like AMRAP or EMOM, and adapt loads, reps, and time caps based on your level.",
      },
    ],
    fr: [
      {
        question: "Qu'est-ce qu'un WoD en CrossFit ?",
        answer:
          "Un WoD est le Workout of the Day en CrossFit. Il combine conditioning, gymnastique et haltérophilie dans une seance structuree.",
      },
      {
        question: "Comment generer des idees de workout avec WodLab ?",
        answer:
          "Parcours les WoD, choisis un format AMRAP, EMOM ou For Time, puis adapte la charge, le volume et le time cap.",
      },
    ],
    es: [
      {
        question: "Que es un WoD en CrossFit?",
        answer:
          "Un WoD es el Workout of the Day en CrossFit. Combina acondicionamiento, gimnasia y levantamiento en una sesion estructurada.",
      },
      {
        question: "Como generar ideas de workout con WodLab?",
        answer:
          "Explora la biblioteca de WoDs, elige un formato como AMRAP o EMOM y adapta cargas y volumen a tu nivel.",
      },
    ],
  } as const;

  const activeFaq = faqByLocale[(locale as "en" | "fr" | "es") ?? "en"];
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WodLab",
    url: base,
    inLanguage: locale,
    description: copy.homeDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/${locale}/wods?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: activeFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: wods.slice(0, 10).map((wod, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: locale === "fr" ? wod.title_fr : locale === "es" ? wod.title_es : wod.title_en,
      url: `${base}/${locale}/wods/${wod.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
      <Hero tagline={t("hero.tagline")} cta={t("hero.cta")} />
      <section id="wods-section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <WodGrid wods={wods} locale={locale} />
      </section>
      <SeoEditorialSection locale={locale} />
    </>
  );
}
