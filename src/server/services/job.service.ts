import { prisma } from "@/lib/db";
import { getAIProvider } from "@/server/ai/ai-client";
import { checkRateLimit, logAIRequest } from "@/server/ai/rate-limit";
import type {
  ApplyRecommendation,
  JobStatus,
  WeakAreaSource,
  WorkType,
} from "@prisma/client";

type JobFitResult = {
  overallScore: number;
  technicalMatch: number;
  experienceMatch: number;
  remoteReadiness: number;
  englishReadiness: number;
  portfolioSupport: number;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  missingSkills: string[];
  recommendation: string;
  risks: string[];
  jobRisks?: { type: string; title: string; description: string; severity: string }[];
  reasoning: string;
};

type TailoredResult = {
  positioning: string;
  summarySuggestion: string;
  skillsToEmphasize: string[];
  bulletSuggestions: { original: string; suggested: string; reason: string }[];
  keywordsToAdd: string[];
  sectionsToReduce: string[];
};

export class JobService {
  static list(userId: string, status?: JobStatus) {
    return prisma.job.findMany({
      where: { userId, ...(status ? { status } : {}) },
      orderBy: { updatedAt: "desc" },
      include: {
        analysisReports: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  }

  static get(userId: string, id: string) {
    return prisma.job.findFirst({
      where: { id, userId },
      include: {
        analysisReports: { orderBy: { createdAt: "desc" } },
        tailoredSuggestions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  }

  static create(
    userId: string,
    data: {
      companyName: string;
      jobTitle: string;
      description: string;
      jobUrl?: string;
      location?: string;
      workType?: WorkType;
      salaryRange?: string;
      tags?: string[];
    }
  ) {
    return prisma.job.create({ data: { userId, ...data, tags: data.tags ?? [] } });
  }

  static update(userId: string, id: string, data: Partial<{ status: JobStatus; companyName: string; jobTitle: string; description: string; tags: string[] }>) {
    return prisma.job.updateMany({ where: { id, userId }, data });
  }

  static delete(userId: string, id: string) {
    return prisma.job.deleteMany({ where: { id, userId } });
  }

  static async analyzeFit(userId: string, jobId: string) {
    const job = await prisma.job.findFirst({ where: { id: jobId, userId } });
    if (!job) throw new Error("NOT_FOUND");

    const allowed = await checkRateLimit(userId, "JOB_ANALYSIS");
    if (!allowed.allowed) throw new Error("RATE_LIMITED");

    const [profile, userSkills] = await Promise.all([
      prisma.careerProfile.findUnique({ where: { userId } }),
      prisma.userSkill.findMany({
        where: { userId },
        include: { skill: true },
      }),
    ]);

    const ai = getAIProvider();
    const result = await ai.generateStructuredData<JobFitResult>({
      action: "JOB_ANALYSIS",
      payload: {
        jobDescription: job.description,
        resumeText: profile?.resumeText,
        userSkills: userSkills.map((us) => ({
          name: us.skill.name,
          level: us.level,
        })),
      },
    });

    const recMap: Record<string, ApplyRecommendation> = {
      STRONG_APPLY: "STRONG_APPLY",
      WORTH_APPLYING: "WORTH_APPLYING",
      STRETCH_ROLE: "STRETCH_ROLE",
      NOT_RECOMMENDED: "NOT_RECOMMENDED",
    };

    const report = await prisma.jobAnalysisReport.create({
      data: {
        jobId,
        overallScore: result.overallScore,
        technicalMatch: result.technicalMatch,
        experienceMatch: result.experienceMatch,
        remoteReadiness: result.remoteReadiness,
        englishReadiness: result.englishReadiness,
        portfolioSupport: result.portfolioSupport,
        mustHaveSkillsJson: result.mustHaveSkills,
        niceToHaveSkillsJson: result.niceToHaveSkills,
        missingSkillsJson: result.missingSkills,
        risksJson: result.risks,
        jobRisksJson: result.jobRisks ?? [],
        recommendation: recMap[result.recommendation] ?? "WORTH_APPLYING",
        reasoning: result.reasoning,
        aiMode: process.env.AI_MODE ?? "mock",
      },
    });

    await prisma.job.update({ where: { id: jobId }, data: { status: "ANALYZING" } });

    for (const skill of result.missingSkills) {
      const existing = await prisma.weakArea.findFirst({
        where: { userId, title: skill, source: "JOB_ANALYSIS" as WeakAreaSource },
      });
      if (existing) {
        await prisma.weakArea.update({
          where: { id: existing.id },
          data: { severity: "HIGH" },
        });
      } else {
        await prisma.weakArea.create({
          data: {
            userId,
            title: skill,
            category: "Skill gap",
            severity: "HIGH",
            source: "JOB_ANALYSIS" as WeakAreaSource,
            suggestedActionsJson: [`Study ${skill} for ${job.jobTitle}`],
          },
        });
      }
    }

    await logAIRequest(userId, "JOB_ANALYSIS", "SUCCESS");
    return report;
  }

  static async tailoredResume(userId: string, jobId: string) {
    const job = await prisma.job.findFirst({ where: { id: jobId, userId } });
    if (!job) throw new Error("NOT_FOUND");

    const allowed = await checkRateLimit(userId, "TAILORED_RESUME");
    if (!allowed.allowed) throw new Error("RATE_LIMITED");

    const ai = getAIProvider();
    const result = await ai.generateStructuredData<TailoredResult>({
      action: "TAILORED_RESUME",
      payload: { jobId },
    });

    const suggestion = await prisma.tailoredResumeSuggestion.create({
      data: {
        jobId,
        positioning: result.positioning,
        summarySuggestion: result.summarySuggestion,
        skillsToEmphasizeJson: result.skillsToEmphasize,
        bulletSuggestionsJson: result.bulletSuggestions,
        keywordsToAddJson: result.keywordsToAdd,
        sectionsToReduceJson: result.sectionsToReduce,
      },
    });

    await logAIRequest(userId, "TAILORED_RESUME", "SUCCESS");
    return suggestion;
  }

  static async generateInterviewPrep(
    userId: string,
    jobId: string,
    outputLanguage: "EN" | "ZH_TW" | "BILINGUAL" = "BILINGUAL"
  ) {
    const job = await prisma.job.findFirst({ where: { id: jobId, userId } });
    if (!job) throw new Error("NOT_FOUND");

    const allowed = await checkRateLimit(userId, "INTERVIEW_PREP");
    if (!allowed.allowed) throw new Error("RATE_LIMITED");

    const ai = getAIProvider();
    const result = await ai.generateStructuredData<Record<string, unknown>>({
      action: "INTERVIEW_PREP",
      payload: { jobDescription: job.description, outputLanguage },
    });

    const prep = { ...result, outputLanguage, generatedAt: new Date().toISOString() };
    await prisma.job.update({
      where: { id: jobId },
      data: { interviewPrepJson: prep },
    });

    await logAIRequest(userId, "INTERVIEW_PREP", "SUCCESS");
    return prep;
  }
}
