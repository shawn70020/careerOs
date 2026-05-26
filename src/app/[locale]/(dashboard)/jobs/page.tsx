import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { JobService } from "@/server/services/job.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { jobStatusLabel } from "@/lib/enum-labels";
import { Briefcase } from "lucide-react";

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("jobs");
  const enumsT = await getTranslations("enums");
  const analysis = await getTranslations("common.analysis");
  const session = await auth();
  const jobs = await JobService.list(session!.user!.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/jobs/new">{t("addJob")}</Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={t("empty.title")}
          description={t("empty.description")}
          actionLabel={t("empty.action")}
          actionHref="/jobs/new"
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card className="hover:border-primary/40 transition-colors">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{job.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">{job.companyName}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{jobStatusLabel(enumsT, job.status)}</Badge>
                    {job.analysisReports[0] && (
                      <p className="mt-1 text-sm">
                        {analysis("fitPercent", { score: job.analysisReports[0].overallScore })}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
