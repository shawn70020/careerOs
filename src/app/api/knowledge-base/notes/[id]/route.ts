import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { KnowledgeBaseService } from "@/server/services/knowledge-base.service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  const note = await KnowledgeBaseService.get(user!.id, id);
  if (!note) return apiError("NOT_FOUND", "Note not found", 404);
  return apiSuccess(note);
}

const patchSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  try {
    const data = patchSchema.parse(await req.json());
    await KnowledgeBaseService.update(user!.id, id, data);
    const note = await KnowledgeBaseService.get(user!.id, id);
    return apiSuccess(note);
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Update failed", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  await KnowledgeBaseService.delete(user!.id, id);
  return apiSuccess({ ok: true });
}
