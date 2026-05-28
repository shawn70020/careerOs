import type { TailoredApplicationContent } from "@/lib/tailored-resume-schema";

export function buildTailoredResumeMarkdown(content: TailoredApplicationContent): string {
  const zhBullets = content.highlights.zh.map((h) => `- ${h}`).join("\n");
  const enBullets = content.highlights.en.map((h) => `- ${h}`).join("\n");

  return [
    "# 求職自傳（繁體中文）",
    "",
    content.letter.zh.body,
    "",
    "## 重點優勢",
    zhBullets,
    "",
    "---",
    "",
    "# Application Statement (English)",
    "",
    content.letter.en.body,
    "",
    "## Key strengths",
    enBullets,
  ].join("\n");
}
