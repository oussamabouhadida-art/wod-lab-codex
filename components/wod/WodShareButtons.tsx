import * as Tooltip from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/Button";
import { buildInstagramShareUrl, buildWhatsappShareUrl } from "@/lib/utils/share";

export function WodShareButtons({ title, url, instagramTip }: { title: string; url: string; instagramTip: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <a href={buildWhatsappShareUrl(title, url)} target="_blank" rel="noreferrer">
        <Button variant="ghost" className="w-full">WhatsApp</Button>
      </a>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <a href={buildInstagramShareUrl()} target="_blank" rel="noreferrer">
              <Button variant="ghost" className="w-full">Instagram</Button>
            </a>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="z-50 rounded-[4px] border border-divider bg-surface-2 px-2 py-1 text-xs text-body">
              {instagramTip}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
