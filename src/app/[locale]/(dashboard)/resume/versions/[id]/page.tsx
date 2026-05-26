import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ResumeService } from "@/server/services/resume.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ResumeVersionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resume.versionDetail");
  const versionsT = await getTranslations("resume.versions");
  const actions = await getTranslations("common.actions");
  const session = await auth();
  const version = await ResumeService.getVersion(session!.user!.id, id);
  if (!version) notFound();

  const content = version.markdownContent ?? version.originalResumeText ?? versionsT("noContent");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{version.name}</h1>
        <Button variant="ghost" asChild>
          <Link href="/resume/versions">{actions("back")}</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("preview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm font-mono">{content}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
