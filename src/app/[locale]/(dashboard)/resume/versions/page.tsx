import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { ResumeService } from "@/server/services/resume.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateVersionForm } from "@/components/resume/create-version-form";

export default async function ResumeVersionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resume.versions");
  const actions = await getTranslations("common.actions");
  const session = await auth();
  const versions = await ResumeService.listVersions(session!.user!.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <CreateVersionForm />
      <div className="space-y-3">
        {versions.length === 0 ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          versions.map((v) => (
            <Card key={v.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-lg">{v.name}</CardTitle>
                  {v.relatedJob && (
                    <p className="text-sm text-muted-foreground">
                      {t("forJob", {
                        jobTitle: v.relatedJob.jobTitle,
                        companyName: v.relatedJob.companyName,
                      })}
                    </p>
                  )}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/resume/versions/${v.id}`}>{actions("view")}</Link>
                </Button>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
