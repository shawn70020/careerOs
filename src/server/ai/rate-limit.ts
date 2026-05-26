import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import type { AIAction } from "@prisma/client";

const QUOTAS: Record<AIAction, number> = {
  RESUME_ANALYSIS: 2,
  JOB_ANALYSIS: 5,
  TAILORED_RESUME: 3,
  LEARNING_ROADMAP: 2,
  INTERVIEW_FEEDBACK: 3,
  INTERVIEW_PREP: 3,
};

export async function checkRateLimit(userId: string, action: AIAction) {
  if (env.aiMode === "mock") return { allowed: true };

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const count = await prisma.aIRequestLog.count({
    where: {
      userId,
      action,
      status: "SUCCESS",
      createdAt: { gte: startOfDay },
    },
  });

  return { allowed: count < (QUOTAS[action] ?? 5) };
}

export async function logAIRequest(
  userId: string,
  action: AIAction,
  status: "SUCCESS" | "FAILED" | "RATE_LIMITED",
  errorMessage?: string
) {
  await prisma.aIRequestLog.create({
    data: {
      userId,
      action,
      mode: env.aiMode,
      provider: env.aiMode,
      status,
      errorMessage,
    },
  });
}
