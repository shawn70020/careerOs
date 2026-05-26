"use client";

import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { LogOut } from "lucide-react";

export function Header({ userName }: { userName?: string | null }) {
  const t = useTranslations("common");
  const locale = useLocale();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <p className="text-sm text-muted-foreground">
        {t("welcome", {
          nameSuffix: userName ? t("welcomeNameSuffix", { name: userName }) : "",
        })}
      </p>
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
        >
          <LogOut className="h-4 w-4" />
          {t("actions.signOut")}
        </Button>
      </div>
    </header>
  );
}
