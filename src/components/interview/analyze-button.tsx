"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function AnalyzeInterviewButton({ logId }: { logId: string }) {
  const router = useRouter();
  const t = useTranslations("interview.detail");
  const loadingT = useTranslations("common.loading");
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    await fetch(`/api/interview/logs/${logId}/analyze`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button onClick={analyze} disabled={loading}>
      {loading ? loadingT("analyzing") : t("analyzeWithAi")}
    </Button>
  );
}
