import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { LearningService } from "@/server/services/learning.service";

const schema = z.object({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "SKIPPED"]).optional(),
  notes: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  try {
    const data = schema.parse(await req.json());
    if (!data.status && data.notes === undefined) {
      return apiError("VALIDATION_ERROR", "Provide status or notes", 400);
    }
    await LearningService.updateTask(user!.id, id, data);
    return apiSuccess({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Update failed", 500);
  }
}
