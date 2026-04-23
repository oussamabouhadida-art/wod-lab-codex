import { setRequestLocale } from "next-intl/server";
import { WodGrid } from "@/components/wod/WodGrid";
import { fetchPublishedWods } from "@/lib/actions/wod.actions";

export default async function WodsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const wods = await fetchPublishedWods();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <WodGrid wods={wods} locale={locale} />
    </section>
  );
}
