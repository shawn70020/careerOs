"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutputLanguageSelect } from "@/components/shared/output-language-select";
import type { OutputLanguage } from "@/lib/output-language";
import {
  tailoredApplicationContentLooseSchema,
  type TailoredApplicationContent,
} from "@/lib/tailored-resume-schema";

export type TailoredSuggestionData = {
  id: string;
  outputLanguage: string | null;
  applicationContentJson: unknown;
};

function parseContent(json: unknown): TailoredApplicationContent | null {
  const parsed = tailoredApplicationContentLooseSchema.safeParse(json);
  return parsed.success ? (parsed.data as TailoredApplicationContent) : null;
}

export function TailoredResumePanel({
  jobId,
  initialSuggestion,
}: {
  jobId: string;
  initialSuggestion: TailoredSuggestionData | null;
}) {
  const router = useRouter();
  const t = useTranslations("jobs.tailoredResume");
  const loadingT = useTranslations("common.loading");
  const [lang, setLang] = useState<OutputLanguage>("BILINGUAL");
  const [suggestion, setSuggestion] = useState(initialSuggestion);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingOverwrite, setPendingOverwrite] = useState(false);
  const actionsT = useTranslations("common.actions");

  const content = suggestion ? parseContent(suggestion.applicationContentJson) : null;
  const hasExisting = !!content;

  const showBilingual =
    suggestion?.outputLanguage === "BILINGUAL" || lang === "BILINGUAL";
  const showZh =
    suggestion?.outputLanguage === "ZH_TW" || lang === "ZH_TW" || showBilingual;
  const showEn = suggestion?.outputLanguage === "EN" || lang === "EN" || showBilingual;

  async function generate() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/jobs/${jobId}/tailored-resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outputLanguage: lang }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      const code = data?.error?.code ?? data?.code;
      if (code === "NO_RESUME") setError(t("noResume"));
      else if (code === "RATE_LIMITED") setError(t("rateLimited"));
      else setError(t("generateFailed"));
      return;
    }
    setSuggestion(data as TailoredSuggestionData);
    setPendingOverwrite(false);
    router.refresh();
  }

  function handleGenerateClick() {
    if (hasExisting) {
      setPendingOverwrite(true);
      return;
    }
    void generate();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <OutputLanguageSelect value={lang} onChange={setLang} />
        <Button onClick={handleGenerateClick} disabled={loading || pendingOverwrite}>
          {loading
            ? loadingT("generating")
            : hasExisting
              ? t("regenerate")
              : t("generate")}
        </Button>

        {pendingOverwrite && (
          <div
            className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40"
            role="alert"
          >
            <p className="font-medium text-amber-900 dark:text-amber-100">
              {t("overwriteConfirmTitle")}
            </p>
            <p className="mt-1 text-amber-800/90 dark:text-amber-200/90">
              {t("overwriteConfirmDescription")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => void generate()}
                disabled={loading}
              >
                {t("overwriteConfirmAction")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPendingOverwrite(false)}
                disabled={loading}
              >
                {actionsT("cancel")}
              </Button>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {content && (
          <div className="space-y-6 border-t pt-4">
            {showZh && (
              <section className="space-y-2">
                <h3 className="font-semibold">{t("letterZh")}</h3>
                <p className="text-xs text-muted-foreground">
                  {t("wordCount", { count: content.letter.zh.wordCount })}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {content.letter.zh.body}
                </p>
              </section>
            )}

            {showEn && (
              <section className="space-y-2">
                <h3 className="font-semibold">{t("letterEn")}</h3>
                <p className="text-xs text-muted-foreground">
                  {t("wordCount", { count: content.letter.en.wordCount })}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {content.letter.en.body}
                </p>
              </section>
            )}

            {(showZh || showEn) && (
              <section className="space-y-2">
                <h3 className="font-semibold">{t("highlights")}</h3>
                {showZh && (
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {content.highlights.zh.map((h, i) => (
                      <li key={`zh-${i}`}>{h}</li>
                    ))}
                  </ul>
                )}
                {showEn && showZh && <div className="h-2" />}
                {showEn && (
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    {content.highlights.en.map((h, i) => (
                      <li key={`en-${i}`}>{h}</li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            <section className="space-y-3">
              <h3 className="font-semibold">{t("matchedSkills")}</h3>
              {content.matchedSkills.map((s, i) => (
                <div key={i} className="rounded-md border p-3 text-sm space-y-1">
                  <p className="font-medium">{s.skill}</p>
                  <p>
                    <span className="text-muted-foreground">{t("jobContext")}: </span>
                    {s.jobContext}
                  </p>
                  <p>
                    <span className="text-muted-foreground">{t("resumeEvidence")}: </span>
                    {s.resumeEvidence}
                  </p>
                </div>
              ))}
            </section>

            {content.relevantExperiences.length > 0 && (
              <section className="space-y-3">
                <h3 className="font-semibold">{t("relevantExperiences")}</h3>
                {content.relevantExperiences.map((e, i) => (
                  <div key={i} className="rounded-md border p-3 text-sm space-y-1">
                    <p className="font-medium">
                      {e.jobTitle} · {e.companyName}
                    </p>
                    {showZh && <p>{e.relevanceZh}</p>}
                    {showEn && (
                      <p className={showZh ? "text-muted-foreground" : ""}>{e.relevanceEn}</p>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
