import { z } from "zod";

const letterLocaleSchema = z.object({
  body: z.string().min(1),
  wordCount: z.number().int().nonnegative(),
});

function countZhChars(text: string): number {
  return [...text.replace(/\s/g, "")].length;
}

function countEnWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const tailoredApplicationContentSchema = z
  .object({
    detectedJobLanguage: z.enum(["ZH", "EN", "MIXED"]),
    letter: z.object({
      zh: letterLocaleSchema,
      en: letterLocaleSchema,
    }),
    highlights: z.object({
      zh: z.array(z.string().min(1)).min(3).max(8),
      en: z.array(z.string().min(1)).min(3).max(8),
    }),
    matchedSkills: z
      .array(
        z.object({
          skill: z.string().min(1),
          jobContext: z.string().min(1),
          resumeEvidence: z.string().min(1),
        })
      )
      .min(1),
    relevantExperiences: z
      .array(
        z.object({
          companyName: z.string().min(1),
          jobTitle: z.string().min(1),
          relevanceZh: z.string().min(1),
          relevanceEn: z.string().min(1),
        })
      )
      .min(0),
  })
  .superRefine((data, ctx) => {
    const zhCount = countZhChars(data.letter.zh.body);
    if (zhCount < 250 || zhCount > 500) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Chinese letter must be 250–500 characters (got ${zhCount})`,
        path: ["letter", "zh", "body"],
      });
    }
    const enWords = countEnWords(data.letter.en.body);
    if (enWords < 150 || enWords > 300) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `English letter must be 150–300 words (got ${enWords})`,
        path: ["letter", "en", "body"],
      });
    }
  });

export type TailoredApplicationContent = z.infer<typeof tailoredApplicationContentSchema>;

export const tailoredApplicationContentLooseSchema = z.object({
  detectedJobLanguage: z.enum(["ZH", "EN", "MIXED"]),
  letter: z.object({
    zh: letterLocaleSchema,
    en: letterLocaleSchema,
  }),
  highlights: z.object({
    zh: z.array(z.string()),
    en: z.array(z.string()),
  }),
  matchedSkills: z.array(
    z.object({
      skill: z.string(),
      jobContext: z.string(),
      resumeEvidence: z.string(),
    })
  ),
  relevantExperiences: z.array(
    z.object({
      companyName: z.string(),
      jobTitle: z.string(),
      relevanceZh: z.string(),
      relevanceEn: z.string(),
    })
  ),
});

export function parseTailoredApplicationContent(
  data: unknown,
  options?: { strictLength?: boolean }
): TailoredApplicationContent {
  const schema =
    options?.strictLength === false
      ? tailoredApplicationContentLooseSchema
      : tailoredApplicationContentSchema;
  return schema.parse(data) as TailoredApplicationContent;
}
