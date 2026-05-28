import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { JobService } from "@/server/services/job.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobActions } from "@/components/jobs/job-actions";
import { InterviewPrepPanel, type PrepData } from "@/components/jobs/interview-prep-panel";
import { TailoredResumePanel } from "@/components/jobs/tailored-resume-panel";
import { applyRecommendationLabel, jobStatusLabel } from "@/lib/enum-labels";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("jobs.detail");
  const enumsT = await getTranslations("enums");
  const analysis = await getTranslations("common.analysis");
  const actions = await getTranslations("common.actions");
  const session = await auth();
  const job = await JobService.get(session!.user!.id, id);
  if (!job) notFound();

  const latestReport = job.analysisReports[0];
  const latestSuggestion = job.tailoredSuggestions[0];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
          <p className="text-muted-foreground">{job.companyName}</p>
          <Badge className="mt-2" variant="secondary">{jobStatusLabel(enumsT, job.status)}</Badge>
        </div>
        <Button variant="ghost" asChild><Link href="/jobs">{actions("back")}</Link></Button>
      </div>

      <JobActions
        jobId={job.id}
        existingSuggestion={
          latestSuggestion
            ? {
                id: latestSuggestion.id,
                outputLanguage: latestSuggestion.outputLanguage,
                applicationContentJson: latestSuggestion.applicationContentJson,
              }
            : null
        }
      />

      {latestReport && (
        <Card>
          <CardHeader>
            <CardTitle>{t("latestFitAnalysis")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">{analysis("percentMatch", { score: latestReport.overallScore })}</p>
            <p><strong>{analysis("recommendation")}</strong> {applyRecommendationLabel(enumsT, latestReport.recommendation)}</p>
            <p className="text-sm text-muted-foreground">{latestReport.reasoning}</p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/jobs/${job.id}/analysis`}>{t("viewFullReport")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <InterviewPrepPanel
        jobId={job.id}
        initialPrep={(job.interviewPrepJson as PrepData | null) ?? null}
      />

      <TailoredResumePanel
        jobId={job.id}
        initialSuggestion={
          latestSuggestion
            ? {
                id: latestSuggestion.id,
                outputLanguage: latestSuggestion.outputLanguage,
                applicationContentJson: latestSuggestion.applicationContentJson,
              }
            : null
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("jobDescription")}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm">{job.description}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
