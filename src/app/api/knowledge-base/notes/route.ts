import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { KnowledgeBaseService } from "@/server/services/knowledge-base.service";

const schema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()).optional(),
  relatedSkill: z.string().optional(),
  relatedJobId: z.string().optional(),
});

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  const notes = await KnowledgeBaseService.list(user!.id);
  return apiSuccess(notes);
}

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;
  try {
    const data = schema.parse(await req.json());
    const note = await KnowledgeBaseService.create(user!.id, data);
    return apiSuccess(note, 201);
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Failed to create note", 500);
  }
}
