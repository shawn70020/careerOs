"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const t = useTranslations("learning.prompts");
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy}>
      {copied ? (
        <>
          <Check className="mr-1 h-3 w-3" />
          {t("copied")}
        </>
      ) : (
        <>
          <Copy className="mr-1 h-3 w-3" />
          {t("copy")}
        </>
      )}
    </Button>
  );
}
