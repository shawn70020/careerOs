import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { InterviewService } from "@/server/services/interview.service";

const createSchema = z.object({
  companyName: z.string(),
  jobTitle: z.string().optional(),
  jobId: z.string().optional(),
  interviewDate: z.string().optional(),
  stage: z.enum(["HR_SCREEN", "TECHNICAL_INTERVIEW", "FINAL_INTERVIEW", "OTHER"]).optional(),
  whatWentWell: z.string().optional(),
  whatWentBadly: z.string().optional(),
  stuckPoints: z.string().optional(),
  result: z.enum(["PENDING", "PASSED", "REJECTED", "WITHDRAWN", "UNKNOWN"]).optional(),
  notes: z.string().optional(),
  questions: z
    .array(z.object({ question: z.string(), userAnswer: z.string().optional(), category: z.string().optional() }))
    .optional(),
});

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  const logs = await InterviewService.list(user!.id);
  return apiSuccess(logs);
}

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;
  try {
    const data = createSchema.parse(await req.json());
    const log = await InterviewService.create(user!.id, {
      ...data,
      interviewDate: data.interviewDate ? new Date(data.interviewDate) : undefined,
    });
    return apiSuccess(log, 201);
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Failed to create log", 500);
  }
}
