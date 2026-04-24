import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAlternates, getBaseUrl, getLocaleCopy } from "@/lib/seo";

const aboutContent = {
  en: {
    heading: "About WodLab",
    paragraphs: [
      "WodLab is a CrossFit-first training platform focused on clear workout structure, coaching quality, and real-world performance.",
      "Each workout is designed to fit a complete one-hour class with five blocks: mobility, warm-up, main WoD, short strength finisher, and stretching.",
      "Athletes and coaches can use WodLab to discover, adapt, and generate workout ideas quickly for all levels.",
    ],
  },
  fr: {
    heading: "A propos de WodLab",
    paragraphs: [
      "WodLab est une plateforme orientee CrossFit avec un objectif simple: proposer des seances claires, efficaces et adaptables.",
      "Chaque seance tient dans 60 minutes avec cinq blocs: mobilite, echauffement, WoD principal, renforcement court et stretching.",
      "Athletes et coachs peuvent utiliser WodLab pour trouver et generer rapidement des idees de workout.",
    ],
  },
  es: {
    heading: "Sobre WodLab",
    paragraphs: [
      "WodLab es una plataforma centrada en CrossFit para programar sesiones claras, efectivas y escalables.",
      "Cada sesion esta pensada para una hora completa con cinco bloques: movilidad, calentamiento, WoD principal, fuerza corta y estiramiento.",
      "Atletas y coaches pueden usar WodLab para descubrir y generar ideas de workout de forma rapida.",
    ],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getLocaleCopy(locale);
  const alternates = getAlternates("/about");

  return {
    title: copy.aboutTitle,
    description: copy.aboutDescription,
    keywords: [...copy.keywords],
    alternates,
    openGraph: {
      title: copy.aboutTitle,
      description: copy.aboutDescription,
      images: ["/images/home-hero-crossfit.png"],
      url: alternates.languages[(locale as "en" | "fr" | "es") ?? "en"],
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const block = aboutContent[(locale as "en" | "fr" | "es") ?? "en"];
  const base = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: block.heading,
    inLanguage: locale,
    url: `${base}/${locale}/about`,
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="font-display text-6xl uppercase text-heading">{block.heading}</h1>
      <div className="mt-6 space-y-4 text-body/90">
        {block.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
