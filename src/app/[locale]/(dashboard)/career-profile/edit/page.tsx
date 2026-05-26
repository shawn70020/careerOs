"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormField = "fullName" | "currentTitle" | "location" | "email" | "targetRoles";

export default function EditCareerProfilePage() {
  const router = useRouter();
  const t = useTranslations("dashboard.profileEdit");
  const loadingT = useTranslations("common.loading");
  const actions = useTranslations("common.actions");
  const defaults = useTranslations("common.defaults");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    currentTitle: "",
    location: "",
    email: "",
    resumeText: "",
    targetRoles: defaults("targetRole"),
  });

  const fieldLabels: Record<FormField, string> = {
    fullName: t("fields.fullName"),
    currentTitle: t("fields.currentTitle"),
    location: t("fields.location"),
    email: t("fields.email"),
    targetRoles: t("fields.targetRoles"),
  };

  useEffect(() => {
    fetch("/api/career-profile")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            fullName: data.fullName ?? "",
            currentTitle: data.currentTitle ?? "",
            location: data.location ?? "",
            email: data.email ?? "",
            resumeText: data.resumeText ?? "",
            targetRoles: (data.targetRoles ?? [defaults("targetRole")]).join(", "),
          });
        }
        setLoading(false);
      });
  }, [defaults]);

  async function save() {
    setSaving(true);
    await fetch("/api/career-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        targetRoles: form.targetRoles.split(",").map((s) => s.trim()),
      }),
    });
    setSaving(false);
    router.push("/career-profile");
    router.refresh();
  }

  if (loading) return <p className="text-muted-foreground">{loadingT("loading")}</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(["fullName", "currentTitle", "location", "email", "targetRoles"] as const).map((field) => (
            <div key={field}>
              <Label>{fieldLabels[field]}</Label>
              <Input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <Label>{t("resumeText")}</Label>
            <Textarea
              className="min-h-[150px]"
              value={form.resumeText}
              onChange={(e) => setForm({ ...form, resumeText: e.target.value })}
            />
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? loadingT("saving") : actions("save")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
