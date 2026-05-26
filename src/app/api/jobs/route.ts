import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { JobService } from "@/server/services/job.service";

const createSchema = z.object({
  companyName: z.string(),
  jobTitle: z.string(),
  description: z.string().min(20),
  jobUrl: z.string().optional(),
  location: z.string().optional(),
  workType: z.enum(["REMOTE", "HYBRID", "ONSITE", "UNKNOWN"]).optional(),
  salaryRange: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;
  const status = new URL(req.url).searchParams.get("status") as import("@prisma/client").JobStatus | null;
  const jobs = await JobService.list(user!.id, status ?? undefined);
  return apiSuccess(jobs);
}

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;
  try {
    const data = createSchema.parse(await req.json());
    const job = await JobService.create(user!.id, data);
    return apiSuccess(job, 201);
  } catch (e) {
    if (e instanceof z.ZodError) return apiError("VALIDATION_ERROR", "Invalid input", 400);
    return apiError("INTERNAL_ERROR", "Failed to create job", 500);
  }
}
