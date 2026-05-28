import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { ResumeService } from "@/server/services/resume.service";

const createSchema = z.object({
  name: z.string(),
  targetRole: z.string().optional(),
  relatedJobId: z.string().optional(),
  markdownContent: z.string().optional(),
  originalResumeText: z.string().optional(),
  language: z.enum(["EN", "ZH_TW", "BILINGUAL"]).optional(),
  contentJson: z.record(z.unknown()).optional(),
});

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  const versions = await ResumeService.listVersions(user!.id);
  return apiSuccess(versions);
}

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;
  try {
    const data = createSchema.parse(await req.json());
    const version = await ResumeService.createVersion(user!.id, data);
    return apiSuccess(version, 201);
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Failed to create version", 500);
  }
}
