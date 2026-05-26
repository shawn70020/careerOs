import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { LearningService } from "@/server/services/learning.service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  const roadmap = await LearningService.getRoadmap(user!.id, id);
  if (!roadmap) return apiError("NOT_FOUND", "Roadmap not found", 404);
  return apiSuccess(roadmap);
}
