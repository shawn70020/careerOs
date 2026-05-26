import { apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { DashboardService } from "@/server/services/dashboard.service";

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  const summary = await DashboardService.getSummary(user!.id);
  return apiSuccess(summary);
}
