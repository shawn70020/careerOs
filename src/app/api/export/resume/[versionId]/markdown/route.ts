import { apiError } from "@/lib/api-error";
import { requireUser } from "@/server/auth/require-user";
import { ResumeService } from "@/server/services/resume.service";

export async function GET(_: Request, { params }: { params: Promise<{ versionId: string }> }) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { versionId } = await params;
  const version = await ResumeService.getVersion(user!.id, versionId);
  if (!version) return apiError("NOT_FOUND", "Resume version not found", 404);

  const content =
    version.markdownContent ??
    `# ${version.name}\n\n${version.originalResumeText ?? "No content yet."}`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${version.name.replace(/\s+/g, "-")}.md"`,
    },
  });
}
