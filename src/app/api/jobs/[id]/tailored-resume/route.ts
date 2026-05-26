import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { JobService } from "@/server/services/job.service";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  try {
    const suggestion = await JobService.tailoredResume(user!.id, id);
    return apiSuccess(suggestion);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NOT_FOUND") return apiError("NOT_FOUND", "Job not found", 404);
      if (e.message === "RATE_LIMITED") return apiError("RATE_LIMITED", "Quota exceeded", 429);
    }
    return apiError("INTERNAL_ERROR", "Failed to generate suggestions", 500);
  }
}
