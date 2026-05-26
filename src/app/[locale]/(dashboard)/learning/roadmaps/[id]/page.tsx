import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { LearningService } from "@/server/services/learning.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatusButton } from "@/components/learning/task-status-button";
import { TaskNoteEditor } from "@/components/learning/task-note-editor";
import { TaskLearningResources } from "@/components/learning/task-learning-resources";
import { SkillStageCard } from "@/components/learning/skill-stage-card";
import { PrioritySkillCards } from "@/components/learning/priority-skill-cards";
import { RoadmapTree, type RoadmapTreeNode } from "@/components/learning/roadmap-tree";
import { Badge } from "@/components/ui/badge";
import { priorityLabel } from "@/lib/enum-labels";

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learning.roadmapDetail");
  const resourcesT = await getTranslations("learning.taskResources");
  const enumsT = await getTranslations("enums");
  const actions = await getTranslations("common.actions");
  const session = await auth();
  const roadmap = await LearningService.getRoadmap(session!.user!.id, id);
  if (!roadmap) notFound();

  const tree = (roadmap.roadmapTreeJson as RoadmapTreeNode[]) ?? [];
  const meta = roadmap.generatedFromJson as {
    priorityRecommendations?: string[];
  } | null;
  const priorityTasks = LearningService.getPriorityTasks(
    roadmap.tasks,
    meta?.priorityRecommendations
  );

  const tasksByCategory = roadmap.tasks.reduce(
    (acc, task) => {
      const cat = task.category ?? t("uncategorized");
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(task);
      return acc;
    },
    {} as Record<string, typeof roadmap.tasks>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">{roadmap.title}</h1>
          <p className="text-muted-foreground">{roadmap.summary}</p>
          {roadmap.growthDirection && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("growthDirection")}: {roadmap.growthDirection}
            </p>
          )}
        </div>
        <Button variant="ghost" asChild>
          <Link href="/learning">{actions("back")}</Link>
        </Button>
      </div>

      {roadmap.skillStageSummary && (
        <SkillStageCard title={t("skillStage")} summary={roadmap.skillStageSummary} />
      )}

      <PrioritySkillCards
        tasks={priorityTasks}
        roadmapId={roadmap.id}
        title={t("priorityCards")}
        priorityLabelFn={(p) => priorityLabel(enumsT, p)}
        labels={{
          difficulty: t("difficulty"),
          careerImpact: t("careerImpact"),
          nextAction: t("nextAction"),
          viewTask: t("viewTask"),
        }}
      />

      <RoadmapTree tree={tree} title={t("treeTitle")} />

      <div className="space-y-8">
        {Object.entries(tasksByCategory).map(([category, tasks]) => (
          <div key={category}>
            <h2 className="mb-3 text-lg font-semibold">{category}</h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} id={`task-${task.id}`}>
                  <CardHeader className="flex flex-row items-start justify-between py-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {task.title}
                        <Badge variant="outline">
                          {priorityLabel(enumsT, task.priority)}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.reason}
                      </p>
                    </div>
                    <TaskStatusButton taskId={task.id} currentStatus={task.status} />
                  </CardHeader>
                  <CardContent className="pt-0">
                    {task.estimatedEffort && (
                      <p className="text-sm text-muted-foreground">
                        {t("effort", { effort: task.estimatedEffort })}
                      </p>
                    )}
                    <TaskLearningResources
                      skillName={task.skillName}
                      topic={task.topic}
                      category={task.category}
                      gapDescription={task.gapDescription}
                      suggestedGoal={task.suggestedGoal}
                      practiceIdea={task.practiceIdea}
                      relatedSkillsJson={task.relatedSkillsJson}
                      learningPromptsJson={task.learningPromptsJson}
                      practiceTasksJson={task.practiceTasksJson}
                      interviewQuestionsJson={task.interviewQuestionsJson}
                      labels={{
                        skill: resourcesT("skill"),
                        topic: resourcesT("topic"),
                        category: resourcesT("category"),
                        gap: resourcesT("gap"),
                        goal: resourcesT("goal"),
                        practiceIdea: resourcesT("practiceIdea"),
                        relatedSkills: resourcesT("relatedSkills"),
                        practice: resourcesT("practice"),
                        interviewQuestions: resourcesT("interviewQuestions"),
                      }}
                    />
                    <TaskNoteEditor taskId={task.id} initialNote={task.notes} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
