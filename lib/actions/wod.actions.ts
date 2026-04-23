"use server";

import { revalidatePath } from "next/cache";
import { componentOptions, objectiveOptions, wodTypeOptions } from "@/lib/utils/wod-types";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

function unique<T>(arr: T[]) {
  return [...new Set(arr)];
}

export async function fetchPublishedWods() {
  if (!hasSupabaseAdminEnv()) return [];
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("wods")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchAllWods() {
  if (!hasSupabaseAdminEnv()) return [];
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("wods").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchDrawerData(wodId: string) {
  if (!hasSupabaseAdminEnv()) return { images: [], kpi: null, components: [], tags: [] };
  const supabase = createAdminClient();
  const [imagesRes, kpiRes, componentsRes, tagsRes] = await Promise.all([
    supabase.from("wod_images").select("*").eq("wod_id", wodId).order("sort_order", { ascending: true }),
    supabase.from("wod_kpis").select("*").eq("wod_id", wodId).maybeSingle(),
    supabase.from("wod_components").select("component").eq("wod_id", wodId),
    supabase
      .from("wod_tags")
      .select("tags:tag_id(name,slug)")
      .eq("wod_id", wodId),
  ]);

  return {
    images: imagesRes.data ?? [],
    kpi: kpiRes.data,
    components: (componentsRes.data ?? []).map((c) => c.component),
    tags: (tagsRes.data ?? [])
      .flatMap((t) => ((t.tags as unknown as { name?: string }[] | null) ?? []).map((entry) => entry.name))
      .filter(Boolean),
  };
}

export async function upsertWod(input: {
  id?: string;
  slug: string;
  title_en: string;
  title_fr: string;
  title_es: string;
  description_en?: string;
  description_fr?: string;
  description_es?: string;
  content_en: string;
  content_fr: string;
  content_es: string;
  wod_type: string;
  objective: string;
  is_published: boolean;
  published_at?: string;
  components?: string[];
}) {
  if (!hasSupabaseAdminEnv()) throw new Error("Missing Supabase admin credentials");
  if (!wodTypeOptions.includes(input.wod_type as (typeof wodTypeOptions)[number])) throw new Error("Invalid wod type");
  if (!objectiveOptions.includes(input.objective as (typeof objectiveOptions)[number])) throw new Error("Invalid objective");

  const supabase = createAdminClient();

  const payload = {
    id: input.id,
    slug: input.slug,
    title_en: input.title_en,
    title_fr: input.title_fr,
    title_es: input.title_es,
    description_en: input.description_en ?? null,
    description_fr: input.description_fr ?? null,
    description_es: input.description_es ?? null,
    content_en: input.content_en,
    content_fr: input.content_fr,
    content_es: input.content_es,
    wod_type: input.wod_type,
    objective: input.objective,
    is_published: input.is_published,
    published_at: input.published_at ?? new Date().toISOString(),
  };

  const { data, error } = await supabase.from("wods").upsert(payload).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Could not save WoD");

  if (input.components?.length) {
    const clean = unique(input.components).filter((v) => componentOptions.includes(v as (typeof componentOptions)[number]));
    await supabase.from("wod_components").delete().eq("wod_id", data.id);
    if (clean.length > 0) {
      const { error: compError } = await supabase.from("wod_components").insert(clean.map((component) => ({ wod_id: data.id, component })));
      if (compError) throw new Error(compError.message);
    }
  }

  revalidatePath("/en");
  revalidatePath("/fr");
  revalidatePath("/es");
  revalidatePath("/en/admin");
  revalidatePath("/fr/admin");
  revalidatePath("/es/admin");

  return data.id;
}
