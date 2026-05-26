import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { CareerProfileService } from "@/server/services/career-profile.service";

const schema = z.object({
  fullName: z.string().optional(),
  currentTitle: z.string().optional(),
  targetRoles: z.array(z.string()).optional(),
  resumeText: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
  onboardingComplete: z.boolean().optional(),
});

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  const profile = await CareerProfileService.getByUserId(user!.id);
  return apiSuccess(profile);
}

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;
  try {
    const data = schema.parse(await req.json());
    const profile = await CareerProfileService.upsert(user!.id, data);
    return apiSuccess(profile, 201);
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Failed to save profile", 500);
  }
}

export async function PATCH(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;
  try {
    const data = schema.parse(await req.json());
    const profile = await CareerProfileService.upsert(user!.id, data);
    return apiSuccess(profile);
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Failed to update profile", 500);
  }
}
