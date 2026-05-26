import { z } from "zod";

export const outputLanguageSchema = z.enum(["EN", "ZH_TW", "BILINGUAL"]);
export type OutputLanguage = z.infer<typeof outputLanguageSchema>;

export const OUTPUT_LANGUAGE_OPTIONS: { value: OutputLanguage; label: string }[] = [
  { value: "EN", label: "English" },
  { value: "ZH_TW", label: "Traditional Chinese" },
  { value: "BILINGUAL", label: "Bilingual (EN + 中文)" },
];

export function outputLanguageLabel(lang: OutputLanguage) {
  return OUTPUT_LANGUAGE_OPTIONS.find((o) => o.value === lang)?.label ?? lang;
}
