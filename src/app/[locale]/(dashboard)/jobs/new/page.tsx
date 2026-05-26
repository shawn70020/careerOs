"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewJobPage() {
  const router = useRouter();
  const t = useTranslations("jobs.new");
  const labels = useTranslations("common.labels");
  const loadingT = useTranslations("common.loading");
  const actions = useTranslations("common.actions");
  const enumsT = useTranslations("enums");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    jobUrl: "",
    location: "",
    workType: "REMOTE",
    description: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      const job = await res.json();
      router.push(`/jobs/${job.id}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("jobDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>{labels("company")}</Label>
              <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
            </div>
            <div>
              <Label>{labels("jobTitle")}</Label>
              <Input value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} required />
            </div>
            <div>
              <Label>{t("jobUrl")}</Label>
              <Input value={form.jobUrl} onChange={(e) => setForm({ ...form, jobUrl: e.target.value })} />
            </div>
            <div>
              <Label>{labels("location")}</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <Label>{t("workType")}</Label>
              <Select value={form.workType} onValueChange={(v) => setForm({ ...form, workType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["REMOTE", "HYBRID", "ONSITE", "UNKNOWN"] as const).map((w) => (
                    <SelectItem key={w} value={w}>{enumsT(`workType.${w}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("jobDescription")}</Label>
              <Textarea className="min-h-[200px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading ? loadingT("saving") : t("createJob")}</Button>
              <Button variant="ghost" asChild><Link href="/jobs">{actions("cancel")}</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
