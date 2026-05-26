import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Priority } from "@prisma/client";

export type PriorityTask = {
  id: string;
  title: string;
  priority: Priority;
  reason?: string | null;
  difficulty?: string | null;
  careerImpact?: string | null;
  suggestedNextAction?: string | null;
};

export function PrioritySkillCards({
  tasks,
  roadmapId,
  title,
  priorityLabelFn,
  labels,
}: {
  tasks: PriorityTask[];
  roadmapId: string;
  title: string;
  priorityLabelFn: (priority: Priority) => string;
  labels: {
    difficulty: string;
    careerImpact: string;
    nextAction: string;
    viewTask: string;
  };
}) {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-start justify-between gap-2 text-base">
                <span>{task.title}</span>
                <Badge variant="outline">{priorityLabelFn(task.priority)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2 text-sm">
              {task.reason && (
                <p className="text-muted-foreground line-clamp-2">{task.reason}</p>
              )}
              {task.difficulty && (
                <p>
                  <span className="font-medium">{labels.difficulty}:</span>{" "}
                  {task.difficulty}
                </p>
              )}
              {task.careerImpact && (
                <p>
                  <span className="font-medium">{labels.careerImpact}:</span>{" "}
                  <span className="text-muted-foreground line-clamp-2">
                    {task.careerImpact}
                  </span>
                </p>
              )}
              {task.suggestedNextAction && (
                <p className="text-xs text-primary">{task.suggestedNextAction}</p>
              )}
              <Link
                href={`/learning/roadmaps/${roadmapId}#task-${task.id}`}
                className="mt-auto text-xs font-medium text-primary hover:underline"
              >
                {labels.viewTask}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
