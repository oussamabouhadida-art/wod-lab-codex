import { NextResponse } from "next/server";
import { createPublicClient, hasSupabasePublicEnv } from "@/lib/supabase/public";

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
    tags: (tags.data ?? [])
      .flatMap((t) => ((t.tags as unknown as { name?: string }[] | null) ?? []).map((entry) => entry.name))
      .filter(Boolean),
  });
}
