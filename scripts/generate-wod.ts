import slugify from "slugify";
import { createClient } from "@supabase/supabase-js";

type Args = Record<string, string | boolean>;

function parseArgs(argv: string[]) {
  const result: Args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      result[key] = true;
    } else {
      result[key] = next;
      i += 1;
    }
  }
  return result;
}

async function main() {
  const args = parseArgs(process.argv);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const required = ["title-en", "title-fr", "title-es", "type", "objective", "content-en", "content-fr", "content-es"];
  for (const key of required) {
    if (!args[key]) throw new Error(`Missing --${key}`);
  }

  const titleEn = String(args["title-en"]);
  const slug = slugify(titleEn, { lower: true, strict: true });

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: wod, error: wodError } = await supabase
    .from("wods")
    .insert({
      slug,
      title_en: titleEn,
      title_fr: String(args["title-fr"]),
      title_es: String(args["title-es"]),
      content_en: String(args["content-en"]),
      content_fr: String(args["content-fr"]),
      content_es: String(args["content-es"]),
      wod_type: String(args.type),
      objective: String(args.objective),
      is_published: Boolean(args.publish),
      published_at: new Date().toISOString(),
    })
    .select("id,slug")
    .single();

  if (wodError || !wod) throw new Error(wodError?.message ?? "Could not create wod");

  const components = String(args.components ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  if (components.length > 0) {
    const rows = components.map((component) => ({ wod_id: wod.id, component }));
    const { error } = await supabase.from("wod_components").insert(rows);
    if (error) throw new Error(error.message);
  }

  const tags = String(args.tags ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  for (const tagName of tags) {
    const tagSlug = slugify(tagName, { lower: true, strict: true });
    const { data: tag } = await supabase.from("tags").upsert({ name: tagName, slug: tagSlug }, { onConflict: "slug" }).select("id").single();
    if (tag) {
      await supabase.from("wod_tags").upsert({ wod_id: wod.id, tag_id: tag.id });
    }
  }

  const hasKpi = ["duration", "avg-hr", "max-hr", "calories", "training-effect", "intensity", "recovery", "load"].some((k) => args[k]);
  if (hasKpi) {
    const { error } = await supabase.from("wod_kpis").insert({
      wod_id: wod.id,
      estimated_duration_min: args.duration ? Number(args.duration) : null,
      avg_heart_rate: args["avg-hr"] ? Number(args["avg-hr"]) : null,
      max_heart_rate: args["max-hr"] ? Number(args["max-hr"]) : null,
      estimated_calories: args.calories ? Number(args.calories) : null,
      training_effect: args["training-effect"] ? String(args["training-effect"]) : null,
      intensity_level: args.intensity ? String(args.intensity) : null,
      recovery_time_hours: args.recovery ? Number(args.recovery) : null,
      training_load: args.load ? Number(args.load) : null,
    });
    if (error) throw new Error(error.message);
  }

  console.log(`WOD_CREATED ${slug} ${process.env.NEXT_PUBLIC_APP_URL ?? "https://wodlab.vercel.app"}/en/wods/${slug}`);
}

main().catch((error) => {
  console.error(`ERROR ${error.message}`);
  process.exit(1);
});
