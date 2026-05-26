"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Analysis = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  atsSuggestions: string[];
  detectedSkills: { name: string; category: string }[];
  improvementSuggestions: { section: string; original: string; suggested: string; reason: string; riskFlag: boolean }[];
};

export default function ResumeAnalyzerPage() {
  const t = useTranslations("resume.analyzer");
  const analysis = useTranslations("common.analysis");
  const loadingT = useTranslations("common.loading");
  const actions = useTranslations("common.actions");
  const [text, setText] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    const res = await fetch("/api/resume/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText: text }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) setResult(data);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button variant="ghost" asChild>
          <Link href="/resume">{actions("back")}</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label>{t("resumeText")}</Label>
            <Textarea className="min-h-[180px] mt-2" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <Button onClick={analyze} disabled={loading || text.length < 50}>
            {loading ? loadingT("analyzing") : t("analyze")}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{analysis("scoreOutOf100", { score: result.score })}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-medium text-green-700">{analysis("strengths")}</h3>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {result.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-amber-700">{analysis("weaknesses")}</h3>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {result.weaknesses.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {result.improvementSuggestions?.map((s, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {s.section}
                  {s.riskFlag && <Badge variant="destructive">{t("reviewExaggeration")}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">{analysis("original")}</span> {s.original}</p>
                <p><span className="text-muted-foreground">{analysis("suggested")}</span> {s.suggested}</p>
                <p className="text-muted-foreground italic">{s.reason}</p>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
