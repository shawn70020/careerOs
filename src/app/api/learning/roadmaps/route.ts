import { apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { LearningService } from "@/server/services/learning.service";

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  const roadmaps = await LearningService.listRoadmaps(user!.id);
  return apiSuccess(roadmaps);
}
