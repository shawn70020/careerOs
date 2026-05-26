import { prisma } from "@/lib/db";
import { getAIProvider } from "@/server/ai/ai-client";
import type { InterviewRoadmapUpdate } from "@/server/ai/schemas/interview-roadmap-update";
import { interviewRoadmapUpdateSchema } from "@/server/ai/schemas/interview-roadmap-update";
import { checkRateLimit, logAIRequest } from "@/server/ai/rate-limit";
import { LearningService } from "@/server/services/learning.service";
import type { InterviewResult, InterviewStage, Priority, WeakAreaSource } from "@prisma/client";

type FeedbackResult = {
  summary: string;
  weakAreas: {
    title: string;
    category?: string;
    severity: string;
    source: string;
    suggestedActions?: string[];
  }[];
  suggestedPractice: string[];
  roadmapUpdates: InterviewRoadmapUpdate[];
};

export class InterviewService {
  static list(userId: string) {
    return prisma.interviewLog.findMany({
      where: { userId },
      orderBy: { interviewDate: "desc" },
      include: { questions: true },
    });
  }

  static get(userId: string, id: string) {
    return prisma.interviewLog.findFirst({
      where: { id, userId },
      include: { questions: true },
    });
  }

  static create(
    userId: string,
    data: {
      companyName: string;
      jobTitle?: string;
      jobId?: string;
      interviewDate?: Date;
      stage?: InterviewStage;
      whatWentWell?: string;
      whatWentBadly?: string;
      stuckPoints?: string;
      result?: InterviewResult;
      notes?: string;
      questions?: { question: string; userAnswer?: string; category?: string }[];
    }
  ) {
    const { questions, ...rest } = data;
    return prisma.interviewLog.create({
      data: {
        userId,
        ...rest,
        questions: questions
          ? { create: questions.map((q) => ({ question: q.question, userAnswer: q.userAnswer, category: q.category })) }
          : undefined,
      },
      include: { questions: true },
    });
  }

  static async analyzeFeedback(userId: string, logId: string) {
    const log = await prisma.interviewLog.findFirst({
      where: { id: logId, userId },
      include: { questions: true },
    });
    if (!log) throw new Error("NOT_FOUND");

    const allowed = await checkRateLimit(userId, "INTERVIEW_FEEDBACK");
    if (!allowed.allowed) throw new Error("RATE_LIMITED");

    const ai = getAIProvider();
    const result = await ai.generateStructuredData<FeedbackResult>({
      action: "INTERVIEW_FEEDBACK",
      payload: { logId },
    });

    const severityMap: Record<string, Priority> = {
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      HIGH: "HIGH",
      CRITICAL: "CRITICAL",
    };

    for (const wa of result.weakAreas) {
      const existing = await prisma.weakArea.findFirst({
        where: { userId, title: wa.title, source: "INTERVIEW_FEEDBACK" },
      });
      if (existing) {
        await prisma.weakArea.update({
          where: { id: existing.id },
          data: {
            severity: severityMap[wa.severity] ?? "MEDIUM",
            suggestedActionsJson: wa.suggestedActions,
          },
        });
      } else {
        await prisma.weakArea.create({
          data: {
            userId,
            title: wa.title,
            category: wa.category,
            severity: severityMap[wa.severity] ?? "MEDIUM",
            source: "INTERVIEW_FEEDBACK" as WeakAreaSource,
            suggestedActionsJson: wa.suggestedActions,
          },
        });
      }
    }

    const updated = await prisma.interviewLog.update({
      where: { id: logId },
      data: {
        aiSummary: result.summary,
        weakAreasJson: result.weakAreas,
        suggestedPracticeJson: result.suggestedPractice,
      },
      include: { questions: true },
    });

    const parsedUpdates = result.roadmapUpdates
      .map((u) => interviewRoadmapUpdateSchema.safeParse(u))
      .filter((r) => r.success)
      .map((r) => r.data);

    const { roadmap, applied } =
      await LearningService.applyInterviewRoadmapUpdates(
        userId,
        logId,
        parsedUpdates
      );

    await logAIRequest(userId, "INTERVIEW_FEEDBACK", "SUCCESS");
    return {
      log: updated,
      analysis: result,
      roadmapUpdate: { roadmapId: roadmap?.id ?? null, applied },
    };
  }

  static listWeakAreas(userId: string) {
    return prisma.weakArea.findMany({
      where: { userId, status: { in: ["ACTIVE", "IMPROVING"] } },
      orderBy: { updatedAt: "desc" },
    });
  }
}
