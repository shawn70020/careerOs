"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";

type ResumeResult = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  detectedSkills?: { name: string; category: string }[];
};

type JobFitResult = {
  overallScore: number;
  recommendation: string;
  reasoning: string;
  missingSkills?: string[];
};

export default function PublicDemoPage() {
  const t = useTranslations("demo");
  const nav = useTranslations("nav");
  const common = useTranslations("common");
  const analysis = useTranslations("common.analysis");
  const loadingT = useTranslations("common.loading");
  const errorsT = useTranslations("common.errors");
  const enumsT = useTranslations("enums");

  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumeResult, setResumeResult] = useState<ResumeResult | null>(null);
  const [jobResult, setJobResult] = useState<JobFitResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function analyzeResume() {
    setLoading("resume");
    setError("");
    const res = await fetch("/api/demo/resume/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText }),
    });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setError(data.error?.message ?? errorsT("analysisFailed"));
      return;
    }
    setResumeResult(data);
  }

  async function analyzeJob() {
    setLoading("job");
    setError("");
    const res = await fetch("/api/demo/job-fit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription: jdText }),
    });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setError(data.error?.message ?? errorsT("analysisFailed"));
      return;
    }
    setJobResult(data);
  }

  function recommendationLabel(value: string) {
    try {
      return enumsT(`applyRecommendation.${value}` as "applyRecommendation.STRONG_APPLY");
    } catch {
      return value;
    }
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="font-bold text-primary">
            {common("appName")}
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{t("badge")}</Badge>
            <LocaleSwitcher />
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">{nav("signIn")}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">{nav("createAccount")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>

        {error && (
          <p className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Tabs defaultValue="resume">
          <TabsList>
            <TabsTrigger value="resume">{t("tabs.resumeAnalysis")}</TabsTrigger>
            <TabsTrigger value="job">{t("tabs.jobFitAnalysis")}</TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("resume.cardTitle")}</CardTitle>
                <CardDescription>{t("resume.cardDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  className="min-h-[160px]"
                  placeholder={t("resume.placeholder")}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
                <Button onClick={analyzeResume} disabled={loading === "resume" || resumeText.length < 50}>
                  {loading === "resume" ? loadingT("analyzing") : t("resume.analyze")}
                </Button>
              </CardContent>
            </Card>
            {resumeResult && (
              <Card>
                <CardHeader>
                  <CardTitle>{analysis("scoreOutOf100", { score: resumeResult.score })}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <h3 className="font-medium text-green-700">{analysis("strengths")}</h3>
                    <ul className="mt-1 list-disc pl-5">
                      {resumeResult.strengths?.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-700">{analysis("weaknesses")}</h3>
                    <ul className="mt-1 list-disc pl-5">
                      {resumeResult.weaknesses?.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  {resumeResult.detectedSkills && (
                    <div className="sm:col-span-2 flex flex-wrap gap-2">
                      {resumeResult.detectedSkills.map((s) => (
                        <Badge key={s.name} variant="outline">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="job" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("job.cardTitle")}</CardTitle>
                <CardDescription>{t("job.cardDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  className="min-h-[160px]"
                  placeholder={t("job.placeholder")}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
                <Button onClick={analyzeJob} disabled={loading === "job" || jdText.length < 50}>
                  {loading === "job" ? loadingT("analyzing") : t("job.analyze")}
                </Button>
              </CardContent>
            </Card>
            {jobResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {analysis("percentMatch", { score: jobResult.overallScore })}
                    <Badge>{recommendationLabel(jobResult.recommendation)}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>{jobResult.reasoning}</p>
                  {jobResult.missingSkills && jobResult.missingSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {jobResult.missingSkills.map((s) => (
                        <Badge key={s} variant="warning">
                          {analysis("missingSkill", { skill: s })}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-semibold">{t("cta.title")}</p>
              <p className="text-sm text-muted-foreground">{t("cta.description")}</p>
            </div>
            <Button asChild>
              <Link href="/register">{common("actions.getStarted")}</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
