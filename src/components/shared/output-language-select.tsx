"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OutputLanguage } from "@/lib/output-language";

const OUTPUT_VALUES: OutputLanguage[] = ["EN", "ZH_TW", "BILINGUAL"];

export function OutputLanguageSelect({
  value,
  onChange,
}: {
  value: OutputLanguage;
  onChange: (v: OutputLanguage) => void;
}) {
  const t = useTranslations("outputLanguage");

  const labels: Record<OutputLanguage, string> = {
    EN: t("en"),
    ZH_TW: t("zhTw"),
    BILINGUAL: t("bilingual"),
  };

  return (
    <div>
      <Label className="text-sm">{t("label")}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as OutputLanguage)}>
        <SelectTrigger className="mt-1 w-full max-w-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OUTPUT_VALUES.map((o) => (
            <SelectItem key={o} value={o}>
              {labels[o]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
