import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/layout/Hero";
import { WodGrid } from "@/components/wod/WodGrid";
import { fetchPublishedWods } from "@/lib/actions/wod.actions";

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const wods = await fetchPublishedWods();

  return (
    <>
      <Hero tagline={t("hero.tagline")} cta={t("hero.cta")} />
      <section id="wods-section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <WodGrid wods={wods} locale={locale} />
      </section>
    </>
  );
}
