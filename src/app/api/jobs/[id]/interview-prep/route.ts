import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { outputLanguageSchema } from "@/lib/output-language";
import { requireUser } from "@/server/auth/require-user";
import { JobService } from "@/server/services/job.service";

const schema = z.object({
  outputLanguage: outputLanguageSchema.optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  try {
    const body = schema.parse(await req.json().catch(() => ({})));
    const prep = await JobService.generateInterviewPrep(
      user!.id,
      id,
      body.outputLanguage ?? "BILINGUAL"
    );
    return apiSuccess(prep);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NOT_FOUND") return apiError("NOT_FOUND", "Job not found", 404);
      if (e.message === "RATE_LIMITED") return apiError("RATE_LIMITED", "Quota exceeded", 429);
    }
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Failed to generate interview prep", 500);
  }
}
