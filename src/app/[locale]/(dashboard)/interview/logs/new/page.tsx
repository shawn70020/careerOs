"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewInterviewLogPage() {
  const router = useRouter();
  const t = useTranslations("interview.new");
  const labels = useTranslations("common.labels");
  const loadingT = useTranslations("common.loading");
  const actions = useTranslations("common.actions");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    interviewDate: "",
    whatWentWell: "",
    whatWentBadly: "",
    stuckPoints: "",
    notes: "",
    question: "",
    userAnswer: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/interview/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.companyName,
        jobTitle: form.jobTitle,
        interviewDate: form.interviewDate || undefined,
        whatWentWell: form.whatWentWell,
        whatWentBadly: form.whatWentBadly,
        stuckPoints: form.stuckPoints,
        notes: form.notes,
        stage: "TECHNICAL_INTERVIEW",
        questions: form.question
          ? [{ question: form.question, userAnswer: form.userAnswer, category: "Technical" }]
          : [],
      }),
    });
    setLoading(false);
    if (res.ok) {
      const log = await res.json();
      await fetch(`/api/interview/logs/${log.id}/analyze`, { method: "POST" });
      router.push(`/interview/logs/${log.id}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card>
        <CardHeader><CardTitle>{t("details")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div><Label>{labels("company")}</Label><Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required /></div>
            <div><Label>{labels("jobTitle")}</Label><Input value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} /></div>
            <div><Label>{labels("date")}</Label><Input type="date" value={form.interviewDate} onChange={(e) => setForm({ ...form, interviewDate: e.target.value })} /></div>
            <div><Label>{t("whatWentWell")}</Label><Textarea value={form.whatWentWell} onChange={(e) => setForm({ ...form, whatWentWell: e.target.value })} /></div>
            <div><Label>{t("whatWentBadly")}</Label><Textarea value={form.whatWentBadly} onChange={(e) => setForm({ ...form, whatWentBadly: e.target.value })} /></div>
            <div><Label>{t("stuckPoints")}</Label><Textarea value={form.stuckPoints} onChange={(e) => setForm({ ...form, stuckPoints: e.target.value })} /></div>
            <div><Label>{t("sampleQuestion")}</Label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></div>
            <div><Label>{t("yourAnswer")}</Label><Textarea value={form.userAnswer} onChange={(e) => setForm({ ...form, userAnswer: e.target.value })} /></div>
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading ? loadingT("saving") : t("saveAndAnalyze")}</Button>
              <Button variant="ghost" asChild><Link href="/interview">{actions("cancel")}</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
