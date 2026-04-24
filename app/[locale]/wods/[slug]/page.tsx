import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient, hasSupabasePublicEnv } from "@/lib/supabase/public";
import { WodTypeBadge } from "@/components/wod/WodTypeBadge";

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

  const title = locale === "fr" ? wod.title_fr : locale === "es" ? wod.title_es : wod.title_en;
  const description = locale === "fr" ? wod.description_fr : locale === "es" ? wod.description_es : wod.description_en;

  return {
    title,
    description: description ?? wod.content_en.slice(0, 140),
    openGraph: {
      title,
      description: description ?? wod.content_en.slice(0, 140),
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

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-6xl uppercase text-heading">{title}</h1>
        <WodTypeBadge type={wod.wod_type} />
      </div>
      {description ? <p className="mb-6 text-body">{description}</p> : null}
      <pre className="rounded-[4px] border border-divider bg-surface-1 p-4 font-mono text-sm whitespace-pre-wrap">{content}</pre>
    </section>
  );
}
