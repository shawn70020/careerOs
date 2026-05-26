import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { env } from "@/lib/env";
import { getAIProvider } from "@/server/ai/ai-client";

const schema = z.object({ resumeText: z.string().min(50).max(10000) });

/** Public demo — no auth; mock AI only; does not persist to database */
export async function POST(req: Request) {
  if (env.aiMode !== "mock") {
    return apiError("FORBIDDEN", "Public demo is only available in mock mode", 403);
  }

  try {
    const { resumeText } = schema.parse(await req.json());
    const ai = getAIProvider();
    const result = await ai.generateStructuredData<Record<string, unknown>>({
      action: "RESUME_ANALYSIS",
      payload: { resumeText },
    });
    return apiSuccess({ ...result, demo: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return apiError("VALIDATION_ERROR", "Resume text required (min 50 chars)", 400);
    }
    return apiError("INTERNAL_ERROR", "Demo analysis failed", 500);
  }
}
