import type { TailoredResumeGenerationContext } from "@/server/services/tailored-resume-context";

export function buildTailoredResumeSystemPrompt(): string {
  return `You are an expert career coach helping software engineers write job application statements (求職自傳 / cover letter style) for specific roles.

Output valid JSON matching the required schema. Write TWO independent versions:
- letter.zh: Traditional Chinese (繁體中文), 250–500 Chinese characters (字), formal tone
- letter.en: English, 150–300 words, natural professional tone (not a literal translation)

Each letter must address:
1. Why the candidate is applying for this specific role and company
2. Why the company should hire them
3. Optional: referrer, standout skills, or details that do not fit on a resume (omit referrer if unknown)

Also provide:
- highlights.zh / highlights.en: 3–6 bullet points of key strengths
- matchedSkills: skills present in BOTH the resume and job description, with jobContext and resumeEvidence
- relevantExperiences: past roles that relate to this job, with relevanceZh and relevanceEn

Rules:
- Only claim skills and experiences supported by the provided resume and profile
- If job description is in Chinese or mixed, letter.zh should mirror JD terminology where appropriate
- letter.en must be independently written, not word-for-word translation
- Set wordCount on each letter to the actual character count (zh) or word count (en)`;
}

export function buildTailoredResumeUserPrompt(ctx: TailoredResumeGenerationContext): string {
  const parts = [
    `## Job`,
    `Title: ${ctx.job.jobTitle}`,
    `Company: ${ctx.job.companyName}`,
    `Detected JD language: ${ctx.detectedJobLanguage}`,
    `Output language mode: ${ctx.outputLanguage}`,
    ``,
    `## Job description`,
    ctx.job.description,
    ``,
    `## Resume text`,
    ctx.resumeText,
  ];

  if (ctx.profile) {
    parts.push(
      ``,
      `## Profile`,
      `Name: ${ctx.profile.fullName ?? "N/A"}`,
      `Current title: ${ctx.profile.currentTitle ?? "N/A"}`,
      `Target roles: ${ctx.profile.targetRoles.join(", ")}`
    );
  }

  if (ctx.experiences.length > 0) {
    parts.push(``, `## Work experiences`);
    for (const e of ctx.experiences) {
      parts.push(
        `- ${e.jobTitle} @ ${e.companyName}${e.isCurrent ? " (current)" : ""}`,
        `  Tech: ${e.technologies.join(", ") || "N/A"}`,
        e.description ? `  ${e.description.slice(0, 500)}` : ""
      );
    }
  }

  if (ctx.userSkills.length > 0) {
    parts.push(
      ``,
      `## User skills`,
      ctx.userSkills.map((s) => `- ${s.name} (${s.level})`).join("\n")
    );
  }

  if (ctx.fitReport) {
    parts.push(
      ``,
      `## Prior fit analysis`,
      `Overall score: ${ctx.fitReport.overallScore}`,
      `Must-have: ${ctx.fitReport.mustHaveSkills.join(", ")}`,
      `Nice-to-have: ${ctx.fitReport.niceToHaveSkills.join(", ")}`,
      `Missing: ${ctx.fitReport.missingSkills.join(", ")}`
    );
  }

  return parts.filter(Boolean).join("\n");
}
