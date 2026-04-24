import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { isAdminRequest } from "@/lib/auth.admin";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ error: "Missing Supabase admin credentials" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image exceeds 8MB limit" }, { status: 413 });
  }

  const contentType = file.type || "application/octet-stream";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const safeExt = (ext || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filePath = `${id}/${Date.now()}-${randomUUID()}.${safeExt || "bin"}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = createAdminClient();

  const { error: uploadError } = await supabase.storage
    .from("wod-images")
    .upload(filePath, buffer, { contentType, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("wod-images").getPublicUrl(filePath);
  const { error: insertError } = await supabase.from("wod_images").insert({ wod_id: id, url: data.publicUrl });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ url: data.publicUrl });
}
