import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { ResumeService } from "@/server/services/resume.service";

const schema = z.object({ resumeText: z.string().min(50).max(50000) });

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;
  try {
    const { resumeText } = schema.parse(await req.json());
    const result = await ResumeService.analyze(user!.id, resumeText);
    return apiSuccess(result);
  } catch (e) {
    if (e instanceof Error && e.message === "RATE_LIMITED") {
      return apiError("RATE_LIMITED", "Daily resume analysis quota exceeded", 429);
    }
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Resume text required (min 50 chars)", 400);
    return apiError("INTERNAL_ERROR", "Analysis failed", 500);
  }
}
