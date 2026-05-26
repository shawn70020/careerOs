import { prisma } from "@/lib/db";
import { getAIProvider } from "@/server/ai/ai-client";
import type { InterviewRoadmapUpdate } from "@/server/ai/schemas/interview-roadmap-update";
import type {
  LearningRoadmapItem,
  LearningRoadmapResult,
} from "@/server/ai/schemas/learning-roadmap";
import { learningRoadmapResultSchema } from "@/server/ai/schemas/learning-roadmap";
import { checkRateLimit, logAIRequest } from "@/server/ai/rate-limit";
import { LearningContextBuilder } from "@/server/services/learning-context";
import type { LearningTaskStatus, Priority, RoadmapSource } from "@prisma/client";

const priorityMap: Record<string, Priority> = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
};

function mapPriority(p: string): Priority {
  return priorityMap[p] ?? "MEDIUM";
}

function taskCreateData(item: LearningRoadmapItem) {
  return {
    title: item.title,
    topic: item.topic,
    skillName: item.skillName,
    category: item.category,
    priority: mapPriority(item.priority),
    reason: item.reason,
    gapDescription: item.gapDescription,
    suggestedGoal: item.suggestedGoal,
    difficulty: item.difficulty,
    careerImpact: item.careerImpact,
    suggestedNextAction: item.suggestedNextAction,
    estimatedEffort: item.estimatedEffort,
    practiceIdea: item.practiceIdea,
    relatedSkillsJson: item.relatedSkills ?? [],
    learningPromptsJson: item.learningPrompts ?? undefined,
    practiceTasksJson: item.practiceTasks ?? [],
    interviewQuestionsJson: item.interviewQuestions ?? [],
  };
}

export class LearningService {
  static listRoadmaps(userId: string) {
    return prisma.learningRoadmap.findMany({
      where: { userId },
      include: { tasks: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  static getRoadmap(userId: string, id: string) {
    return prisma.learningRoadmap.findFirst({
      where: { id, userId },
      include: { tasks: { orderBy: { priority: "desc" } } },
    });
  }

  static getLatestRoadmap(userId: string, relatedJobId?: string | null) {
    if (relatedJobId) {
      return prisma.learningRoadmap.findFirst({
        where: { userId, relatedJobId },
        orderBy: { updatedAt: "desc" },
        include: { tasks: true },
      });
    }
    return prisma.learningRoadmap.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { tasks: true },
    });
  }

  static async generate(
    userId: string,
    options: {
      growthDirection?: string;
      targetRole?: string;
      jobId?: string;
      outputLanguage?: string;
    } = {}
  ) {
    const allowed = await checkRateLimit(userId, "LEARNING_ROADMAP");
    if (!allowed.allowed) throw new Error("RATE_LIMITED");

    const context = await LearningContextBuilder.build(userId, options);

    const ai = getAIProvider();
    const raw = await ai.generateStructuredData<LearningRoadmapResult>({
      action: "LEARNING_ROADMAP",
      payload: context,
    });

    const parsed = learningRoadmapResultSchema.safeParse(raw);
    const result = parsed.success
      ? parsed.data
      : {
          ...raw,
          skillStageSummary:
            (raw as LearningRoadmapResult).skillStageSummary ??
            context.skillStageHint,
        };

    const source: RoadmapSource =
      context.job?.jobId && context.snapshot.reportId
        ? "JOB_ANALYSIS"
        : "AI_GENERATED";

    const skillStageSummary =
      result.skillStageSummary || context.skillStageHint;

    const roadmap = await prisma.learningRoadmap.create({
      data: {
        userId,
        title: result.title,
        targetRole: context.targetRole,
        growthDirection: context.growthDirection,
        relatedJobId: context.job?.jobId,
        summary: result.summary,
        skillStageSummary,
        roadmapTreeJson: result.tree ?? [],
        source,
        generatedFromJson: {
          ...context.snapshot,
          growthDirection: context.growthDirection,
          outputLanguage: context.outputLanguage,
          weakAreaCount: context.weakAreas.length,
          missingSkills: context.job?.missingSkills ?? [],
          priorityRecommendations: result.priorityRecommendations ?? [],
        },
        tasks: {
          create: result.items.map((item) => taskCreateData(item)),
        },
      },
      include: { tasks: true },
    });

    await logAIRequest(userId, "LEARNING_ROADMAP", "SUCCESS");
    return roadmap;
  }

  static getPriorityTasks<T extends { title: string; priority: Priority }>(
    tasks: T[],
    recommendations?: string[] | null,
    limit = 5
  ): T[] {
    const priorityOrder: Priority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
    const sorted = [...tasks].sort(
      (a, b) =>
        priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
    );
    if (recommendations?.length) {
      const picked: T[] = [];
      for (const rec of recommendations) {
        const match = sorted.find(
          (t) =>
            t.title.toLowerCase() === rec.toLowerCase() ||
            rec.toLowerCase().includes(t.title.toLowerCase())
        );
        if (match && !picked.includes(match)) picked.push(match);
      }
      if (picked.length >= 3) return picked.slice(0, limit);
      for (const t of sorted) {
        if (!picked.includes(t)) picked.push(t);
        if (picked.length >= limit) break;
      }
      return picked;
    }
    return sorted.slice(0, limit);
  }

  static async applyInterviewRoadmapUpdates(
    userId: string,
    logId: string,
    updates: InterviewRoadmapUpdate[]
  ) {
    const log = await prisma.interviewLog.findFirst({
      where: { id: logId, userId },
    });
    if (!log || updates.length === 0) {
      return { roadmap: null, applied: [] as string[] };
    }

    let roadmap = await LearningService.getLatestRoadmap(userId, log.jobId);
    if (!roadmap) {
      roadmap = await LearningService.getLatestRoadmap(userId);
    }
    if (!roadmap) {
      return { roadmap: null, applied: [] as string[] };
    }

    const applied: string[] = [];

    for (const update of updates) {
      if (update.action === "BUMP_PRIORITY") {
        const tasks = roadmap.tasks.filter((t) => {
          if (update.matchSkillName && t.skillName) {
            return (
              t.skillName.toLowerCase() ===
              update.matchSkillName.toLowerCase()
            );
          }
          if (update.matchTitle) {
            return t.title
              .toLowerCase()
              .includes(update.matchTitle.toLowerCase());
          }
          return false;
        });
        for (const task of tasks) {
          await prisma.learningTask.update({
            where: { id: task.id },
            data: { priority: mapPriority(update.priority) },
          });
          applied.push(`Bumped priority: ${task.title}`);
        }
      } else if (update.action === "ADD_TASK") {
        const { action: _a, ...item } = update;
        await prisma.learningTask.create({
          data: {
            roadmapId: roadmap.id,
            ...taskCreateData(item as LearningRoadmapItem),
          },
        });
        applied.push(`Added task: ${update.title}`);
      }
    }

    if (applied.length > 0) {
      const existingMeta =
        (roadmap.generatedFromJson as Record<string, unknown>) ?? {};
      await prisma.learningRoadmap.update({
        where: { id: roadmap.id },
        data: {
          source: "INTERVIEW_FEEDBACK",
          generatedFromJson: {
            ...existingMeta,
            lastInterviewLogId: logId,
            lastInterviewUpdates: applied,
          },
        },
      });
      roadmap = await LearningService.getRoadmap(userId, roadmap.id);
    }

    return { roadmap, applied };
  }

  static updateTask(
    userId: string,
    taskId: string,
    data: { status?: LearningTaskStatus; notes?: string }
  ) {
    return prisma.learningTask.updateMany({
      where: {
        id: taskId,
        roadmap: { userId },
      },
      data,
    });
  }
}
