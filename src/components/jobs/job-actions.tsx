"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function JobActions({ jobId }: { jobId: string }) {
  const router = useRouter();
  const t = useTranslations("jobs.actions");
  const loadingT = useTranslations("common.loading");
  const jobsT = useTranslations("jobs");
  const [loading, setLoading] = useState<string | null>(null);

  async function analyze() {
    setLoading("analyze");
    await fetch(`/api/jobs/${jobId}/analyze`, { method: "POST" });
    setLoading(null);
    router.refresh();
  }

  async function tailored() {
    setLoading("tailored");
    await fetch(`/api/jobs/${jobId}/tailored-resume`, { method: "POST" });
    setLoading(null);
    router.refresh();
  }

  async function createResumeVersion() {
    setLoading("version");
    const res = await fetch(`/api/jobs/${jobId}/tailored-resume`, { method: "POST" });
    const suggestion = await res.json();
    if (suggestion) {
      await fetch("/api/resume/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: jobsT("generatedVersionName"),
          relatedJobId: jobId,
          markdownContent: `# Tailored Resume\n\n${suggestion.summarySuggestion ?? ""}\n\n## Positioning\n${suggestion.positioning ?? ""}`,
        }),
      });
    }
    setLoading(null);
    router.push("/resume/versions");
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={analyze} disabled={!!loading}>
        {loading === "analyze" ? loadingT("analyzing") : t("analyzeJobFit")}
      </Button>
      <Button variant="outline" onClick={tailored} disabled={!!loading}>
        {loading === "tailored" ? loadingT("generating") : t("tailoredResumeSuggestions")}
      </Button>
      <Button variant="secondary" onClick={createResumeVersion} disabled={!!loading}>
        {loading === "version" ? loadingT("creating") : t("createJobResumeVersion")}
      </Button>
    </div>
  );
}
