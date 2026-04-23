import { createAdminClient } from "@/lib/supabase/admin";
import { WodForm } from "@/components/admin/WodForm";

export default async function EditWodPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;

  const supabase = createAdminClient();
  const { data: wod } = await supabase.from("wods").select("*").eq("id", id).single();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-4 font-display text-5xl uppercase text-heading">Edit WoD</h1>
      <WodForm locale={locale} wod={wod ?? undefined} />
    </section>
  );
}
