import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { DashboardService } from "@/server/services/dashboard.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, AlertTriangle, GraduationCap, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { jobStatusLabel, priorityLabel } from "@/lib/enum-labels";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const enumsT = await getTranslations("enums");
  const session = await auth();
  const summary = await DashboardService.getSummary(session!.user!.id);

  if (!summary.onboardingComplete) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold">{t("welcome.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("welcome.description")}</p>
        <Button asChild className="mt-6">
          <Link href="/onboarding">{t("welcome.startOnboarding")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> {t("stats.jobsTracked")}
            </CardDescription>
            <CardTitle className="text-3xl">{summary.jobCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t("stats.inPipeline", { count: summary.appliedCount })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> {t("stats.resumeScore")}
            </CardDescription>
            <CardTitle className="text-3xl">{summary.resumeScore ?? "—"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> {t("stats.weakAreas")}
            </CardDescription>
            <CardTitle className="text-3xl">{summary.weakAreas.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> {t("stats.roadmaps")}
            </CardDescription>
            <CardTitle className="text-3xl">{summary.roadmapCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("activeWeakAreas.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summary.weakAreas.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("activeWeakAreas.empty")}</p>
            ) : (
              summary.weakAreas.map((wa) => (
                <div key={wa.id} className="flex items-center justify-between rounded border p-3">
                  <span className="font-medium">{wa.title}</span>
                  <Badge variant="warning">{priorityLabel(enumsT, wa.severity)}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("learningTasks.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summary.learningTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                <Link href="/learning" className="text-primary hover:underline">
                  {t("learningTasks.emptyPrefix")}
                </Link>
                {t("learningTasks.emptySuffix")}
              </p>
            ) : (
              summary.learningTasks.map((task) => (
                <div key={task.id} className="rounded border p-3">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.roadmap.title}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("recentJobs.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.topJobs.length === 0 ? (
            <Button asChild variant="outline">
              <Link href="/jobs/new">{t("recentJobs.addFirst")}</Link>
            </Button>
          ) : (
            <div className="space-y-3">
              {summary.topJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center justify-between rounded border p-3 hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{job.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">{job.companyName}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{jobStatusLabel(enumsT, job.status)}</Badge>
                    {job.analysisReports[0] && (
                      <p className="mt-1 text-sm">{t("recentJobs.score", { score: job.analysisReports[0].overallScore })}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {summary.recentInterviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("recentInterviews.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summary.recentInterviews.map((log) => (
              <Link key={log.id} href={`/interview/logs/${log.id}`} className="block rounded border p-3 hover:bg-muted/50">
                <p className="font-medium">{log.companyName}</p>
                <p className="text-sm text-muted-foreground">{formatDate(log.interviewDate, locale)}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
