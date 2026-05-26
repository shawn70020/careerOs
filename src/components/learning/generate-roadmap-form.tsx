"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutputLanguageSelect } from "@/components/shared/output-language-select";
import type { OutputLanguage } from "@/lib/output-language";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PRESET_KEYS = [
  "remoteFrontend",
  "reactFrontend",
  "fullstackLeaning",
  "aiSaasFrontend",
  "frontendArchitect",
  "backendBasics",
  "betterUiSlicing",
] as const;

type JobOption = {
  id: string;
  jobTitle: string;
  companyName: string;
  missingSkills: string[];
};

export function GenerateRoadmapForm({
  initialJobId,
  initialGrowthDirection,
}: {
  initialJobId?: string;
  initialGrowthDirection?: string;
}) {
  const router = useRouter();
  const t = useTranslations("learning.generate");
  const loadingT = useTranslations("common.loading");
  const [growthDirection, setGrowthDirection] = useState(
    initialGrowthDirection ?? ""
  );
  const [customDirection, setCustomDirection] = useState("");
  const [jobId, setJobId] = useState(initialJobId ?? "");
  const [jobs, setJobs] = useState<JobOption[]>([]);
  const [outputLanguage, setOutputLanguage] =
    useState<OutputLanguage>("BILINGUAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/learning/jobs-with-reports")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialGrowthDirection) setGrowthDirection(initialGrowthDirection);
  }, [initialGrowthDirection]);

  useEffect(() => {
    if (initialJobId) setJobId(initialJobId);
  }, [initialJobId]);

  const direction =
    customDirection.trim() || growthDirection || t("defaultDirection");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/learning/roadmaps/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        growthDirection: direction,
        targetRole: direction,
        jobId: jobId || undefined,
        outputLanguage,
      }),
    });
    setLoading(false);
    if (res.ok) {
      const json = await res.json();
      router.push(`/learning/roadmaps/${json.id}`);
      router.refresh();
    } else if (res.status === 429) {
      setError(t("rateLimited"));
    } else {
      setError(t("failed"));
    }
  }

  return (
    <Card id="generate-roadmap">
      <CardHeader>
        <CardTitle className="text-lg">{t("title")}</CardTitle>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-sm">{t("growthDirection")}</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESET_KEYS.map((key) => {
                const label = t(`presets.${key}`);
                const selected = growthDirection === label && !customDirection;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setGrowthDirection(label);
                      setCustomDirection("");
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="custom-direction">{t("customDirection")}</Label>
            <Input
              id="custom-direction"
              className="mt-1"
              value={customDirection}
              onChange={(e) => setCustomDirection(e.target.value)}
              placeholder={t("customPlaceholder")}
            />
          </div>

          {jobs.length > 0 && (
            <div>
              <Label>{t("jobGap")}</Label>
              <Select
                value={jobId || "__none__"}
                onValueChange={(v) => setJobId(v === "__none__" ? "" : v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t("jobGapPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t("noJob")}</SelectItem>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.jobTitle} @ {j.companyName}
                      {j.missingSkills.length > 0 &&
                        ` (${j.missingSkills.slice(0, 2).join(", ")}…)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <OutputLanguageSelect
            value={outputLanguage}
            onChange={setOutputLanguage}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? loadingT("generating") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
