import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { JobService } from "@/server/services/job.service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  const job = await JobService.get(user!.id, id);
  if (!job) return apiError("NOT_FOUND", "Job not found", 404);
  return apiSuccess(job);
}

const patchSchema = z.object({
  status: z.string().optional(),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  try {
    const data = patchSchema.parse(await req.json());
    await JobService.update(user!.id, id, data as Parameters<typeof JobService.update>[2]);
    const job = await JobService.get(user!.id, id);
    return apiSuccess(job);
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Update failed", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  await JobService.delete(user!.id, id);
  return apiSuccess({ ok: true });
}
