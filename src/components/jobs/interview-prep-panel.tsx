"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutputLanguageSelect } from "@/components/shared/output-language-select";
import type { OutputLanguage } from "@/lib/output-language";

export type PrepData = {
  outputLanguage?: string;
  categories: PrepCategory[];
};

type PrepCategory = {
  category: string;
  questions: {
    question: string;
    questionZh?: string;
    answerDirection: string;
    answerDirectionZh?: string;
  }[];
};

export function InterviewPrepPanel({
  jobId,
  initialPrep,
}: {
  jobId: string;
  initialPrep: PrepData | null;
}) {
  const router = useRouter();
  const t = useTranslations("jobs.interviewPrep");
  const loadingT = useTranslations("common.loading");
  const [lang, setLang] = useState<OutputLanguage>("BILINGUAL");
  const [prep, setPrep] = useState<PrepData | null>(initialPrep);
  const [loading, setLoading] = useState(false);

  const showBilingual = prep?.outputLanguage === "BILINGUAL" || lang === "BILINGUAL";
  const showZh = prep?.outputLanguage === "ZH_TW" || lang === "ZH_TW" || showBilingual;
  const showEn = prep?.outputLanguage === "EN" || lang === "EN" || showBilingual;

  async function generate() {
    setLoading(true);
    const res = await fetch(`/api/jobs/${jobId}/interview-prep`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outputLanguage: lang }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setPrep(data as PrepData);
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <OutputLanguageSelect value={lang} onChange={setLang} />
        <Button onClick={generate} disabled={loading}>
          {loading
            ? loadingT("generating")
            : prep
              ? t("regenerateQuestions")
              : t("generateQuestions")}
        </Button>

        {prep?.categories?.map((cat) => (
          <div key={cat.category} className="space-y-3 border-t pt-4">
            <h3 className="font-semibold">{cat.category}</h3>
            {cat.questions.map((q, i) => (
              <div key={i} className="rounded-md border p-3 text-sm space-y-2">
                {showEn && <p className="font-medium">{q.question}</p>}
                {showZh && q.questionZh && (
                  <p className="font-medium text-muted-foreground">{q.questionZh}</p>
                )}
                <div className="text-muted-foreground">
                  <span className="text-xs uppercase tracking-wide">{t("answerDirection")}</span>
                  {showEn && <p>{q.answerDirection}</p>}
                  {showZh && q.answerDirectionZh && <p>{q.answerDirectionZh}</p>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
