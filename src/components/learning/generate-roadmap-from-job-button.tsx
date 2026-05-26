"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function GenerateRoadmapFromJobButton({
  jobId,
  growthDirection,
}: {
  jobId: string;
  growthDirection: string;
}) {
  const router = useRouter();
  const t = useTranslations("learning.generate");
  const loadingT = useTranslations("common.loading");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/learning/roadmaps/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        growthDirection,
        targetRole: growthDirection,
        outputLanguage: "BILINGUAL",
      }),
    });
    setLoading(false);
    if (res.ok) {
      const json = await res.json();
      router.push(`/learning/roadmaps/${json.id}`);
    }
  }

  return (
    <Button onClick={generate} disabled={loading} variant="default">
      {loading ? loadingT("generating") : t("fromJobCta")}
    </Button>
  );
}
