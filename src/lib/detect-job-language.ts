export type DetectedJobLanguage = "ZH" | "EN" | "MIXED";

const CJK_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf]/;
const LATIN_REGEX = /[a-zA-Z]/;

/** Detect primary language of job posting text (description + optional title/company). */
export function detectJobLanguage(
  description: string,
  extras: { jobTitle?: string; companyName?: string } = {}
): DetectedJobLanguage {
  const text = [description, extras.jobTitle, extras.companyName].filter(Boolean).join("\n");
  const hasCjk = CJK_REGEX.test(text);
  const hasLatin = LATIN_REGEX.test(text);

  if (hasCjk && hasLatin) return "MIXED";
  if (hasCjk) return "ZH";
  return "EN";
}
