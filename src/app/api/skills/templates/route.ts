import { apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { SkillService } from "@/server/services/skill.service";

export async function GET(req: Request) {
  const { error } = await requireUser();
  if (error) return error;
  const role = new URL(req.url).searchParams.get("role") ?? "frontend";
  const skills = await SkillService.getTemplates(role);
  return apiSuccess(skills);
}
