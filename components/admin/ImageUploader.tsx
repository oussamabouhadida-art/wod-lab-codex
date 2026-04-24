"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

type UploadedImage = {
  id: string;
  url: string;
};

export function ImageUploader({ wodId }: { wodId?: string }) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadImages() {
      if (!wodId) {
        setImages([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/wods/${wodId}/drawer`);
        const payload = await response.json();
        if (response.ok) {
          const nextImages = ((payload?.images ?? []) as { id?: string; url?: string }[])
            .filter((img) => img.url)
            .map((img, index) => ({ id: img.id ?? `${index}-${img.url}`, url: img.url as string }));
          setImages(nextImages);
        }
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [wodId]);

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

      if (payload?.url) {
        setImages((current) => [{ id: `${Date.now()}-${payload.url}`, url: payload.url as string }, ...current]);
      }
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center justify-center rounded-[4px] border border-dashed border-divider bg-surface-2 p-8 text-sm text-body">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            onFileChange(file);
            e.currentTarget.value = "";
          }}
        />
        <Button type="button" variant="ghost" disabled={uploading}>
          <Upload size={14} /> {uploading ? "Uploading..." : "Upload image"}
        </Button>
      </label>

      <div className="rounded-[4px] border border-divider bg-surface-1 p-3">
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted">Uploaded Images</p>
        {loading ? (
          <p className="text-sm text-muted">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="text-sm text-muted">No images yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {images.map((image) => (
              <div key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-divider">
                <Image src={image.url} alt="WoD uploaded image" fill sizes="(max-width: 640px) 45vw, 30vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
