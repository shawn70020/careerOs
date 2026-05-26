import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { LearningService } from "@/server/services/learning.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GenerateRoadmapForm } from "@/components/learning/generate-roadmap-form";
import { SkillStageCard } from "@/components/learning/skill-stage-card";
import { PrioritySkillCards } from "@/components/learning/priority-skill-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { priorityLabel } from "@/lib/enum-labels";
import { GraduationCap } from "lucide-react";
export default async function LearningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learning");
  const enumsT = await getTranslations("enums");
  const actions = await getTranslations("common.actions");
  const session = await auth();
  const roadmaps = await LearningService.listRoadmaps(session!.user!.id);
  const latest = roadmaps[0];

  const priorityTasks = latest
    ? LearningService.getPriorityTasks(
        latest.tasks,
        (
          (latest.generatedFromJson as { priorityRecommendations?: string[] })
            ?.priorityRecommendations
        ) ?? undefined
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <GenerateRoadmapForm />

      {latest?.skillStageSummary && (
        <SkillStageCard
          title={t("skillStage.title")}
          summary={latest.skillStageSummary}
        />
      )}

      {latest && priorityTasks.length > 0 && (
        <PrioritySkillCards
          tasks={priorityTasks}
          roadmapId={latest.id}
          title={t("priorityCards.title")}
          priorityLabelFn={(p) => priorityLabel(enumsT, p)}
          labels={{
            difficulty: t("priorityCards.difficulty"),
            careerImpact: t("priorityCards.careerImpact"),
            nextAction: t("priorityCards.nextAction"),
            viewTask: t("priorityCards.viewTask"),
          }}
        />
      )}

      {roadmaps.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={t("empty.title")}
          description={t("empty.description")}
          actionLabel={t("empty.action")}
          actionHref="#generate-roadmap"
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("yourRoadmaps")}</h2>
          {roadmaps.map((r) => (
            <Card key={r.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{r.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{r.summary}</p>
                  {r.growthDirection && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("growthDirectionLabel")}: {r.growthDirection}
                    </p>
                  )}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/learning/roadmaps/${r.id}`}>{actions("view")}</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t("taskCount", { count: r.tasks.length })}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.tasks.slice(0, 3).map((task) => (
                    <Badge key={task.id} variant="secondary">
                      {task.title}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
