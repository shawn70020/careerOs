"use client";

import { useTranslations } from "next-intl";
import { CopyButton } from "@/components/learning/copy-button";

export type LearningPrompts = {
  beginner?: string;
  practice?: string;
  interview?: string;
  debugging?: string;
  project?: string;
};

const PROMPT_KEYS = [
  "beginner",
  "practice",
  "interview",
  "debugging",
  "project",
] as const;

export function LearningPromptLibrary({
  prompts,
}: {
  prompts: LearningPrompts | null;
}) {
  const t = useTranslations("learning.prompts");

  if (!prompts) return null;

  const entries = PROMPT_KEYS.filter((key) => prompts[key]?.trim());
  if (entries.length === 0) return null;

  return (
    <div className="mt-4 space-y-3 border-t pt-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("title")}
      </p>
      {entries.map((key) => (
        <div key={key} className="rounded-lg border bg-muted/30 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-medium">{t(key)}</span>
            <CopyButton text={prompts[key]!} />
          </div>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {prompts[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
