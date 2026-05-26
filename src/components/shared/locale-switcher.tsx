"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  return (
    <Select
      value={locale}
      onValueChange={(next) => router.replace(pathname, { locale: next })}
    >
      <SelectTrigger className={`w-[140px] ${className ?? ""}`} aria-label="Language">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {loc === "zh-TW" ? t("localeZhTw") : t("localeEn")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
