"use client";

import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function ImageUploader({ wodId }: { wodId?: string }) {
  async function onFileChange(file: File | null) {
    if (!file || !wodId) return;

    const supabase = createClient();
    const filePath = `${wodId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("wod-images").upload(filePath, file, { upsert: true });
    if (error) {
      console.error(error.message);
      return;
    }

    const { data } = supabase.storage.from("wod-images").getPublicUrl(filePath);
    await supabase.from("wod_images").insert({ wod_id: wodId, url: data.publicUrl });
  }

  return (
    <label className="flex cursor-pointer items-center justify-center rounded-[4px] border border-dashed border-divider bg-surface-2 p-8 text-sm text-body">
      <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} />
      <Button type="button" variant="ghost">
        <Upload size={14} /> Upload image
      </Button>
    </label>
  );
}
