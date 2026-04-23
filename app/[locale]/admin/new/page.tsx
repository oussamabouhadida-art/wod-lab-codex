import { WodForm } from "@/components/admin/WodForm";

export default async function NewWodPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-4 font-display text-5xl uppercase text-heading">New WoD</h1>
      <WodForm locale={locale} />
    </section>
  );
}
