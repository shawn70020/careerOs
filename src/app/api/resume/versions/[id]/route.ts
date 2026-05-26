import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { ResumeService } from "@/server/services/resume.service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  const version = await ResumeService.getVersion(user!.id, id);
  if (!version) return apiError("NOT_FOUND", "Resume version not found", 404);
  return apiSuccess(version);
}

const patchSchema = z.object({
  name: z.string().optional(),
  markdownContent: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  try {
    const data = patchSchema.parse(await req.json());
    await ResumeService.updateVersion(user!.id, id, data);
    const version = await ResumeService.getVersion(user!.id, id);
    return apiSuccess(version);
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Update failed", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  await ResumeService.deleteVersion(user!.id, id);
  return apiSuccess({ ok: true });
}
