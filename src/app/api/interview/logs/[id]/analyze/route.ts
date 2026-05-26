import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { InterviewService } from "@/server/services/interview.service";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  try {
    const result = await InterviewService.analyzeFeedback(user!.id, id);
    return apiSuccess(result);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NOT_FOUND") return apiError("NOT_FOUND", "Log not found", 404);
      if (e.message === "RATE_LIMITED") return apiError("RATE_LIMITED", "Quota exceeded", 429);
    }
    return apiError("INTERNAL_ERROR", "Analysis failed", 500);
  }
}
