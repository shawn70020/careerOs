"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function TaskStatusButton({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const t = useTranslations("learning.taskStatus");

  async function setStatus(status: string) {
    await fetch(`/api/learning/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  if (currentStatus === "COMPLETED") {
    return <span className="text-sm text-green-600">{t("completed")}</span>;
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => setStatus("IN_PROGRESS")}>
        {t("start")}
      </Button>
      <Button size="sm" onClick={() => setStatus("COMPLETED")}>
        {t("done")}
      </Button>
    </div>
  );
}
