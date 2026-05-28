"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { buildTailoredResumeMarkdown } from "@/lib/tailored-resume-markdown";
import {
  tailoredApplicationContentLooseSchema,
  type TailoredApplicationContent,
} from "@/lib/tailored-resume-schema";
import { Button } from "@/components/ui/button";
import type { TailoredSuggestionData } from "@/components/jobs/tailored-resume-panel";

function parseExistingContent(
  suggestion: TailoredSuggestionData | null
): TailoredApplicationContent | null {
  if (!suggestion?.applicationContentJson) return null;
  const parsed = tailoredApplicationContentLooseSchema.safeParse(
    suggestion.applicationContentJson
  );
  return parsed.success ? parsed.data : null;
}

export function JobActions({
  jobId,
  existingSuggestion,
}: {
  jobId: string;
  existingSuggestion: TailoredSuggestionData | null;
}) {
  const router = useRouter();
  const t = useTranslations("jobs.actions");
  const loadingT = useTranslations("common.loading");
  const jobsT = useTranslations("jobs");
  const tailoredT = useTranslations("jobs.tailoredResume");
  const actionsT = useTranslations("common.actions");
  const [loading, setLoading] = useState<string | null>(null);
  const [pendingVersionOverwrite, setPendingVersionOverwrite] = useState(false);

  const existingContent = parseExistingContent(existingSuggestion);

  async function analyze() {
    setLoading("analyze");
    await fetch(`/api/jobs/${jobId}/analyze`, { method: "POST" });
    setLoading(null);
    router.refresh();
  }

  async function saveResumeVersion(content: TailoredApplicationContent) {
    await fetch("/api/resume/versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: jobsT("generatedVersionName"),
        relatedJobId: jobId,
        language: "BILINGUAL",
        markdownContent: buildTailoredResumeMarkdown(content),
        contentJson: content,
      }),
    });
    router.push("/resume/versions");
  }

  async function fetchAndCreateVersion() {
    const res = await fetch(`/api/jobs/${jobId}/tailored-resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outputLanguage: "BILINGUAL" }),
    });
    const suggestion = await res.json();
    if (!res.ok) {
      const code = suggestion?.error?.code ?? suggestion?.code;
      if (code === "NO_RESUME") alert(tailoredT("noResume"));
      return;
    }
    const parsed = tailoredApplicationContentLooseSchema.safeParse(
      suggestion.applicationContentJson
    );
    if (parsed.success) await saveResumeVersion(parsed.data);
  }

  async function createResumeVersion() {
    if (existingContent) {
      setPendingVersionOverwrite(true);
      return;
    }
    setLoading("version");
    await fetchAndCreateVersion();
    setLoading(null);
  }

  async function confirmRegenerateAndCreateVersion() {
    setPendingVersionOverwrite(false);
    setLoading("version");
    await fetchAndCreateVersion();
    setLoading(null);
  }

  async function createVersionFromExisting() {
    setPendingVersionOverwrite(false);
    setLoading("version");
    await saveResumeVersion(existingContent!);
    setLoading(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button onClick={analyze} disabled={!!loading}>
          {loading === "analyze" ? loadingT("analyzing") : t("analyzeJobFit")}
        </Button>
        <Button variant="secondary" onClick={createResumeVersion} disabled={!!loading}>
          {loading === "version" ? loadingT("creating") : t("createJobResumeVersion")}
        </Button>
      </div>

      {pendingVersionOverwrite && existingContent && (
        <div
          className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40"
          role="alert"
        >
          <p className="font-medium text-amber-900 dark:text-amber-100">
            {tailoredT("versionOverwriteTitle")}
          </p>
          <p className="mt-1 text-amber-800/90 dark:text-amber-200/90">
            {tailoredT("versionOverwriteDescription")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => void createVersionFromExisting()}
              disabled={!!loading}
            >
              {tailoredT("versionUseExisting")}
            </Button>
            <Button
              size="sm"
              onClick={() => void confirmRegenerateAndCreateVersion()}
              disabled={!!loading}
            >
              {tailoredT("versionRegenerateAndCreate")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPendingVersionOverwrite(false)}
              disabled={!!loading}
            >
              {actionsT("cancel")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
