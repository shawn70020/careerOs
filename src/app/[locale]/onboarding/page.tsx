"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DetectedSkill = { name: string; category: string; confidence: number };
type SkillTemplate = { id: string; name: string; category: string };

export default function OnboardingPage() {
  const router = useRouter();
  const t = useTranslations("auth.onboarding");
  const loadingT = useTranslations("common.loading");
  const defaults = useTranslations("common.defaults");
  const commonActions = useTranslations("common.actions");

  const STEPS = [t("steps.resume"), t("steps.role"), t("steps.skills"), t("steps.review")];

  const [step, setStep] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState(defaults("targetRole"));
  const [fullName, setFullName] = useState("");
  const [detectedSkills, setDetectedSkills] = useState<DetectedSkill[]>([]);
  const [templates, setTemplates] = useState<SkillTemplate[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [analysis, setAnalysis] = useState<{ score: number; strengths: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/skills/templates?role=frontend")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTemplates(data);
      });
  }, []);

  async function analyzeResume() {
    setLoading(true);
    const res = await fetch("/api/resume/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setAnalysis({ score: data.score, strengths: data.strengths });
      setDetectedSkills(data.detectedSkills ?? []);
      const matches = await fetch("/api/skills/templates?role=frontend").then((r) => r.json());
      const ids = new Set<string>();
      for (const d of data.detectedSkills ?? []) {
        const found = (matches as SkillTemplate[]).find(
          (s) => s.name.toLowerCase() === d.name.toLowerCase()
        );
        if (found) ids.add(found.id);
      }
      setSelectedIds(ids);
      setStep(1);
    }
  }

  function toggleSkill(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  async function finish() {
    setLoading(true);
    await fetch("/api/career-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        targetRoles: [targetRole],
        resumeText,
        onboardingComplete: true,
      }),
    });
    await fetch("/api/user-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skills: [...selectedIds].map((skillId) => ({
          skillId,
          source: detectedSkills.some((d) => {
            const tmpl = templates.find((x) => x.id === skillId);
            return tmpl?.name === d.name;
          })
            ? "RESUME_DETECTED"
            : "USER_SELECTED",
        })),
      }),
    });
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-muted/20 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex-1 rounded-full py-1 text-center text-xs font-medium ${
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && (
              <>
                <div>
                  <Label>{t("fullName")}</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                  <Label>{t("pasteResume")}</Label>
                  <Textarea
                    className="min-h-[200px]"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder={t("pasteResumePlaceholder")}
                  />
                </div>
                <Button onClick={analyzeResume} disabled={loading || resumeText.length < 50}>
                  {loading ? loadingT("analyzing") : t("analyzeAndContinue")}
                </Button>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <Label>{t("targetRole")}</Label>
                  <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
                </div>
                {analysis && (
                  <p className="text-sm text-muted-foreground">
                    {t("resumeScore", { score: analysis.score })}
                  </p>
                )}
                <Button onClick={() => setStep(2)}>{t("continueToSkills")}</Button>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm text-muted-foreground">{t("confirmSkills")}</p>
                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                  {templates.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSkill(s.id)}
                      className={`rounded-full border px-3 py-1 text-sm ${
                        selectedIds.has(s.id) ? "border-primary bg-primary/10" : ""
                      }`}
                    >
                      {s.name}
                      <span className="ml-1 text-xs text-muted-foreground">{s.category}</span>
                    </button>
                  ))}
                </div>
                {detectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {detectedSkills.map((d) => (
                      <Badge key={d.name} variant="success">
                        {t("detected", { skill: d.name })}
                      </Badge>
                    ))}
                  </div>
                )}
                <Button onClick={() => setStep(3)} disabled={selectedIds.size === 0}>
                  {commonActions("continue")}
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <p><strong>{t("reviewName")}</strong> {fullName}</p>
                <p><strong>{t("reviewRole")}</strong> {targetRole}</p>
                <p><strong>{t("reviewSkillsSelected")}</strong> {selectedIds.size}</p>
                <Button onClick={finish} disabled={loading}>
                  {loading ? loadingT("saving") : t("completeOnboarding")}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
