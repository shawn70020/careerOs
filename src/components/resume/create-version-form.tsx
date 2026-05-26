"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CreateVersionForm() {
  const router = useRouter();
  const t = useTranslations("resume.createVersion");
  const loadingT = useTranslations("common.loading");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true);
    const res = await fetch("/api/resume/versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, markdownContent: content }),
    });
    setLoading(false);
    if (res.ok) {
      setName("");
      setContent("");
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("newVersion")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label>{t("name")}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} />
        </div>
        <div>
          <Label>{t("markdownContent")}</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[100px]" />
        </div>
        <Button onClick={create} disabled={loading || !name}>
          {loading ? loadingT("creating") : t("createVersion")}
        </Button>
      </CardContent>
    </Card>
  );
}
