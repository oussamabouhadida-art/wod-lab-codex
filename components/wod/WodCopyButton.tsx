"use client";

import { useState } from "react";
import { Check, Clipboard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export function WodCopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(label);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button onClick={onCopy} variant="ghost" className="w-full">
      {copied ? <Check size={14} /> : <Clipboard size={14} />} Copy WoD
    </Button>
  );
}
