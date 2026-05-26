import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { outputLanguageSchema } from "@/lib/output-language";
import { requireUser } from "@/server/auth/require-user";
import { LearningService } from "@/server/services/learning.service";

const schema = z.object({
  targetRole: z.string().optional(),
  growthDirection: z.string().optional(),
  jobId: z.string().optional(),
  outputLanguage: outputLanguageSchema.optional(),
});

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;
  try {
    const data = schema.parse(await req.json().catch(() => ({})));
    if (data.jobId) {
      const { prisma } = await import("@/lib/db");
      const job = await prisma.job.findFirst({
        where: { id: data.jobId, userId: user!.id },
      });
      if (!job) return apiError("NOT_FOUND", "Job not found", 404);
    }
    const roadmap = await LearningService.generate(user!.id, {
      targetRole: data.targetRole,
      growthDirection: data.growthDirection,
      jobId: data.jobId,
      outputLanguage: data.outputLanguage,
    });
    return apiSuccess(roadmap, 201);
  } catch (e) {
    if (e instanceof Error && e.message === "RATE_LIMITED") {
      return apiError("RATE_LIMITED", "Quota exceeded", 429);
    }
    return apiError("INTERNAL_ERROR", "Failed to generate roadmap", 500);
  }
}
