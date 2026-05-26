import { getTranslations, setRequestLocale } from "next-intl/server";
import { env } from "@/lib/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("environment")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="flex justify-between">
            <span className="text-muted-foreground">{t("aiMode")}</span>
            <Badge>{env.aiMode}</Badge>
          </p>
          <p className="text-muted-foreground">{t("mockModeDescription")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
