"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export function ImageUploader({ wodId }: { wodId?: string }) {
  const [uploading, setUploading] = useState(false);

  async function onFileChange(file: File | null) {
    if (!file || !wodId) {
      toast.error("Save the WoD first, then upload images.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/admin/wods/${wodId}/images`, {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload?.error ?? "Image upload failed");
        return;
      }

      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="flex cursor-pointer items-center justify-center rounded-[4px] border border-dashed border-divider bg-surface-2 p-8 text-sm text-body">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
      <Button type="button" variant="ghost" disabled={uploading}>
        <Upload size={14} /> {uploading ? "Uploading..." : "Upload image"}
      </Button>
    </label>
  );
}
