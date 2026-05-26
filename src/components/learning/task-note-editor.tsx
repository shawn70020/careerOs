"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function TaskNoteEditor({ taskId, initialNote }: { taskId: string; initialNote: string | null }) {
  const router = useRouter();
  const t = useTranslations("learning.taskNote");
  const loadingT = useTranslations("common.loading");
  const [note, setNote] = useState(initialNote ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/learning/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: note }),
    });
    setSaving(false);
    router.refresh();
  }

  async function remove() {
    setSaving(true);
    await fetch(`/api/learning/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "" }),
    });
    setNote("");
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      <Label className="text-xs text-muted-foreground">{t("label")}</Label>
      <Textarea
        className="min-h-[72px] text-sm"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t("placeholder")}
      />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={save} disabled={saving}>
          {saving ? loadingT("saving") : t("saveNote")}
        </Button>
        {note && (
          <Button size="sm" variant="ghost" onClick={remove} disabled={saving}>
            {t("deleteNote")}
          </Button>
        )}
      </div>
    </div>
  );
}
