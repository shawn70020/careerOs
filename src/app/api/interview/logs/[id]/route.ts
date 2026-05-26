import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { InterviewService } from "@/server/services/interview.service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  const log = await InterviewService.get(user!.id, id);
  if (!log) return apiError("NOT_FOUND", "Interview log not found", 404);
  return apiSuccess(log);
}
