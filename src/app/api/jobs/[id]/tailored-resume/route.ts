import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { outputLanguageSchema } from "@/lib/output-language";
import { requireUser } from "@/server/auth/require-user";
import { JobService } from "@/server/services/job.service";

const bodySchema = z.object({
  outputLanguage: outputLanguageSchema.optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;

  let outputLanguage: z.infer<typeof outputLanguageSchema> | undefined;
  try {
    const json = await req.json().catch(() => ({}));
    outputLanguage = bodySchema.parse(json).outputLanguage;
  } catch (e) {
    if (e instanceof z.ZodError) {
      return apiError("VALIDATION_ERROR", "Invalid input", 400);
    }
  }

  try {
    const suggestion = await JobService.tailoredResume(
      user!.id,
      id,
      outputLanguage ?? "BILINGUAL"
    );
    return apiSuccess(suggestion);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NOT_FOUND") return apiError("NOT_FOUND", "Job not found", 404);
      if (e.message === "RATE_LIMITED") return apiError("RATE_LIMITED", "Quota exceeded", 429);
      if (e.message === "NO_RESUME") {
        return apiError(
          "NO_RESUME",
          "Please add resume text via career profile or resume analyzer first",
          400
        );
      }
    }
    return apiError("INTERNAL_ERROR", "Failed to generate suggestions", 500);
  }
}
