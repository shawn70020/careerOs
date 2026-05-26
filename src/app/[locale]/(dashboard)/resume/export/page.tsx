"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Version = { id: string; name: string };

export default function ResumeExportPage() {
  const t = useTranslations("resume.export");
  const [versions, setVersions] = useState<Version[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetch("/api/resume/versions")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVersions(data);
          if (data[0]) setSelected(data[0].id);
        }
      });
  }, []);

  function downloadMarkdown() {
    if (!selected) return;
    window.open(`/api/export/resume/${selected}/markdown`, "_blank");
  }

  async function downloadPdf() {
    if (!selected) return;
    const res = await fetch(`/api/export/resume/${selected}/pdf`, { method: "POST" });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("selectVersion")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t("resumeVersion")}</Label>
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder={t("selectVersionPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {versions.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button onClick={downloadMarkdown} disabled={!selected} variant="outline">
              {t("exportMarkdown")}
            </Button>
            <Button onClick={downloadPdf} disabled={!selected}>
              {t("exportPdf")}
            </Button>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/resume">{t("backToResume")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
