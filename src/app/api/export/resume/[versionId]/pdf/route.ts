import { apiError } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { ResumeService } from "@/server/services/resume.service";
import { generateResumePdf } from "@/server/services/export.service";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: Promise<{ versionId: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { versionId } = await params;
  const version = await ResumeService.getVersion(user!.id, versionId);
  if (!version) return apiError("NOT_FOUND", "Resume version not found", 404);

  const content =
    version.markdownContent ??
    version.originalResumeText ??
    "No resume content available.";

  const buffer = await generateResumePdf(version.name, content);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${version.name.replace(/\s+/g, "-")}.pdf"`,
    },
  });
}
