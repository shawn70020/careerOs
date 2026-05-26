import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { JobService } from "@/server/services/job.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { applyRecommendationLabel } from "@/lib/enum-labels";
import { GenerateRoadmapFromJobButton } from "@/components/learning/generate-roadmap-from-job-button";

type JobRisk = { type: string; title: string; description: string; severity: string };

export default async function JobAnalysisPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("jobs.analysis");
  const enumsT = await getTranslations("enums");
  const analysis = await getTranslations("common.analysis");
  const actions = await getTranslations("common.actions");
  const session = await auth();
  const job = await JobService.get(session!.user!.id, id);
  if (!job) notFound();
  const report = job.analysisReports[0];
  if (!report) {
    return (
      <div>
        <p>{t("noAnalysis")}</p>
        <Button asChild className="mt-4"><Link href={`/jobs/${id}`}>{t("backToJob")}</Link></Button>
      </div>
    );
  }

  const missing = (report.missingSkillsJson as string[]) ?? [];
  const jobRisks = (report.jobRisksJson as JobRisk[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button variant="ghost" asChild><Link href={`/jobs/${id}`}>{actions("back")}</Link></Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            {analysis("overallPercent", { score: report.overallScore })}
            <Badge>{applyRecommendationLabel(enumsT, report.recommendation)}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
          <p>{t("technical", { score: report.technicalMatch ?? 0 })}</p>
          <p>{t("experience", { score: report.experienceMatch ?? 0 })}</p>
          <p>{t("remote", { score: report.remoteReadiness ?? 0 })}</p>
          <p>{t("english", { score: report.englishReadiness ?? 0 })}</p>
          <p className="sm:col-span-2">{report.reasoning}</p>
        </CardContent>
      </Card>

      {missing.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("skillGap")}</CardTitle>
            <GenerateRoadmapFromJobButton
              jobId={id}
              growthDirection={`${job.jobTitle} @ ${job.companyName}`}
            />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {missing.map((s) => (
              <Badge key={s} variant="warning">{analysis("missingSkill", { skill: s })}</Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {jobRisks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("jobRiskAnalysis")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobRisks.map((risk) => (
              <div key={risk.type} className="rounded-md border p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{risk.title}</p>
                  <Badge variant={risk.severity === "HIGH" ? "destructive" : "warning"}>
                    {enumsT(`riskSeverity.${risk.severity}`)}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{risk.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{analysis("type", { type: risk.type })}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
