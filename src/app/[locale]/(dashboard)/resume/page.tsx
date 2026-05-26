import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, Layers, Download } from "lucide-react";

export default async function ResumeHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resume.hub");
  const actions = await getTranslations("common.actions");

  const links = [
    { href: "/resume/analyzer" as const, icon: Sparkles, title: t("analyzer.title"), desc: t("analyzer.description") },
    { href: "/resume/versions" as const, icon: Layers, title: t("versions.title"), desc: t("versions.description") },
    { href: "/resume/export" as const, icon: Download, title: t("export.title"), desc: t("export.description") },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FileText className="h-6 w-6" /> {t("title")}
      </h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map((l) => (
          <Card key={l.href} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <l.icon className="h-8 w-8 text-primary" />
              <CardTitle className="text-lg">{l.title}</CardTitle>
              <CardDescription>{l.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={l.href}>{actions("open")}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
