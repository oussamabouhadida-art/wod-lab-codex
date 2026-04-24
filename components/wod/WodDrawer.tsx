"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Wod, WodImage, WodKpi } from "@/lib/utils/wod-types";
import { WodTypeBadge } from "@/components/wod/WodTypeBadge";
import { WodKpiBlock } from "@/components/wod/WodKpiBlock";
import { WodCopyButton } from "@/components/wod/WodCopyButton";
import { WodShareButtons } from "@/components/wod/WodShareButtons";
import { buildWodUrl } from "@/lib/utils/share";

export function WodDrawer({ wod, locale, open, onOpenChange }: { wod: Wod | null; locale: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [kpi, setKpi] = useState<WodKpi | null>(null);
  const [images, setImages] = useState<WodImage[]>([]);

  useEffect(() => {
    if (!open || !wod) return;
    fetch(`/api/wods/${wod.id}/drawer`)
      .then((res) => res.json())
      .then((data) => {
        setKpi(data.kpi ?? null);
        setImages(data.images ?? []);
      })
      .catch(() => {
        setKpi(null);
        setImages([]);
      });
  }, [open, wod]);

  if (!wod) return null;

  const title = locale === "fr" ? wod.title_fr : locale === "es" ? wod.title_es : wod.title_en;
  const content = locale === "fr" ? wod.content_fr : locale === "es" ? wod.content_es : wod.content_en;
  const description = locale === "fr" ? wod.description_fr : locale === "es" ? wod.description_es : wod.description_en;
  const url = buildWodUrl(locale, wod.slug);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70" />
        <Dialog.Content
          className="fixed right-0 top-0 z-50 h-full w-full max-w-[480px] overflow-y-auto border-l border-divider bg-surface-1 p-5 outline-none max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:h-[88vh] max-sm:max-w-none max-sm:rounded-t-[10px] max-sm:border-l-0 max-sm:border-t"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-4xl uppercase text-heading">{title}</h3>
            <WodTypeBadge type={wod.wod_type} />
          </div>
          <div className="mb-4 space-y-3">
            {images.length > 0 ? (
              <div className="relative h-48 overflow-hidden rounded-[4px] border border-divider">
                <Image src={images[0].url} alt={images[0].alt_en ?? title} fill sizes="480px" className="object-cover" loading="lazy" />
              </div>
            ) : null}
            <pre className="whitespace-pre-wrap rounded-[4px] bg-black/20 p-3 font-mono text-sm text-body">{content}</pre>
            <WodCopyButton value={content} label="WoD copied! Time to crush it" />
            <WodShareButtons title={title} url={url} instagramTip="Copy the WoD and paste it in your story caption" />
            <WodKpiBlock kpi={kpi} />
            {description ? <p className="text-sm text-body/90">{description}</p> : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
