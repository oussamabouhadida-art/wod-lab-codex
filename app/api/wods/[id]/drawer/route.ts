import { NextResponse } from "next/server";
import { createPublicClient, hasSupabasePublicEnv } from "@/lib/supabase/public";

function extractTagNames(rows: { tags?: unknown }[]) {
  return rows
    .flatMap((row) => {
      const value = row.tags;
      if (Array.isArray(value)) return value;
      return value ? [value] : [];
    })
    .map((entry) => (entry as { name?: string }).name)
    .filter(Boolean);
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasSupabasePublicEnv()) {
    return NextResponse.json({ images: [], kpi: null, components: [], tags: [] });
  }

  const { id } = await params;
  const supabase = createPublicClient();

  const [images, kpi, components, tags] = await Promise.all([
    supabase.from("wod_images").select("*").eq("wod_id", id).order("sort_order", { ascending: true }),
    supabase.from("wod_kpis").select("*").eq("wod_id", id).maybeSingle(),
    supabase.from("wod_components").select("component").eq("wod_id", id),
    supabase.from("wod_tags").select("tags:tag_id(name,slug)").eq("wod_id", id),
  ]);

  return NextResponse.json({
    images: images.data ?? [],
    kpi: kpi.data ?? null,
    components: (components.data ?? []).map((c) => c.component),
    tags: extractTagNames(tags.data ?? []),
  });
}
