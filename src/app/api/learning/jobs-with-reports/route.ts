import { apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { LearningContextBuilder } from "@/server/services/learning-context";

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  const jobs = await LearningContextBuilder.listJobsWithReports(user!.id);
  return apiSuccess(jobs);
}
