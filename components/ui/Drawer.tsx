"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

export function Drawer({ open, onOpenChange, children, content }: { open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode; content: ReactNode; }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/75" />
        <Dialog.Content className="fixed bottom-0 right-0 z-50 h-[85vh] w-full max-w-[480px] overflow-y-auto border-l border-divider bg-surface-1 p-5 sm:h-full">
          {content}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
