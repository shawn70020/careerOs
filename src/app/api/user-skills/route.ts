import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { SkillService } from "@/server/services/skill.service";

const addSchema = z.object({
  skills: z.array(
    z.object({
      skillId: z.string(),
      level: z.enum(["BEGINNER", "FAMILIAR", "WORKING_EXPERIENCE", "STRONG"]).optional(),
      source: z.enum(["USER_SELECTED", "RESUME_DETECTED", "USER_ADDED"]).optional(),
    })
  ),
});

const customSchema = z.object({ name: z.string(), category: z.string() });

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  const skills = await SkillService.getUserSkills(user!.id);
  return apiSuccess(skills);
}

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;
  try {
    const body = await req.json();
    if (body.name && body.category) {
      const data = customSchema.parse(body);
      const skill = await SkillService.addCustomSkill(user!.id, data.name, data.category);
      return apiSuccess(skill, 201);
    }
    const data = addSchema.parse(body);
    const skills = await SkillService.addUserSkills(user!.id, data.skills);
    return apiSuccess(skills, 201);
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Failed to add skills", 500);
  }
}
