import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { InterviewService } from "@/server/services/interview.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyzeInterviewButton } from "@/components/interview/analyze-button";
import { LearningService } from "@/server/services/learning.service";

export default async function InterviewLogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("interview.detail");
  const common = await getTranslations("common");
  const actions = await getTranslations("common.actions");
  const session = await auth();
  const log = await InterviewService.get(session!.user!.id, id);
  if (!log) notFound();

  const practice = (log.suggestedPracticeJson as string[]) ?? [];
  const weakAreas = (log.weakAreasJson as { title: string }[]) ?? [];

  const roadmap = await LearningService.getLatestRoadmap(
    session!.user!.id,
    log.jobId
  );
  const roadmapMeta = roadmap?.generatedFromJson as {
    lastInterviewLogId?: string;
    lastInterviewUpdates?: string[];
  } | null;
  const showRoadmapBanner =
    log.aiSummary &&
    roadmapMeta?.lastInterviewLogId === log.id &&
    (roadmapMeta.lastInterviewUpdates?.length ?? 0) > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{log.companyName}</h1>
        <Button variant="ghost" asChild><Link href="/interview">{actions("back")}</Link></Button>
      </div>

      {!log.aiSummary && <AnalyzeInterviewButton logId={log.id} />}

      {showRoadmapBanner && roadmap && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">{t("roadmapUpdated")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="list-disc pl-5">
              {roadmapMeta!.lastInterviewUpdates!.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
            <Button asChild size="sm" variant="outline">
              <Link href={`/learning/roadmaps/${roadmap.id}`}>
                {t("viewRoadmap")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {log.aiSummary && (
        <Card>
          <CardHeader><CardTitle>{t("aiSummary")}</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{log.aiSummary}</p></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>{t("yourNotes")}</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><strong>{t("well")}</strong> {log.whatWentWell ?? common("emptyPlaceholder")}</p>
          <p><strong>{t("bad")}</strong> {log.whatWentBadly ?? common("emptyPlaceholder")}</p>
          <p><strong>{t("stuck")}</strong> {log.stuckPoints ?? common("emptyPlaceholder")}</p>
        </CardContent>
      </Card>

      {weakAreas.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{t("weakAreas")}</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm">
              {weakAreas.map((w, i) => (
                <li key={i}>{w.title}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {practice.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{t("suggestedPractice")}</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm">
              {practice.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {log.questions.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{t("questions")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {log.questions.map((q) => (
              <div key={q.id} className="border-b pb-3 last:border-0">
                <p className="font-medium">{q.question}</p>
                <p className="text-sm text-muted-foreground mt-1">{q.userAnswer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
