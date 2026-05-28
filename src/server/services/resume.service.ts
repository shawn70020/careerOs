import { prisma } from "@/lib/db";
import { getAIProvider } from "@/server/ai/ai-client";
import { checkRateLimit, logAIRequest } from "@/server/ai/rate-limit";
import type { ResumeLanguage } from "@prisma/client";

type ResumeAnalysisResult = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  atsSuggestions: string[];
  detectedSkills: { name: string; category: string; confidence: number }[];
  improvementSuggestions: {
    section: string;
    original: string;
    suggested: string;
    reason: string;
    riskFlag: boolean;
  }[];
};

export class ResumeService {
  static async analyze(userId: string, resumeText: string) {
    const allowed = await checkRateLimit(userId, "RESUME_ANALYSIS");
    if (!allowed.allowed) {
      await logAIRequest(userId, "RESUME_ANALYSIS", "RATE_LIMITED");
      throw new Error("RATE_LIMITED");
    }

    const ai = getAIProvider();
    const result = await ai.generateStructuredData<ResumeAnalysisResult>({
      action: "RESUME_ANALYSIS",
      payload: { resumeText },
    });

    await prisma.careerProfile.upsert({
      where: { userId },
      create: {
        userId,
        resumeText,
        targetRoles: ["Frontend Engineer"],
        strengthsJson: result.strengths,
        weaknessesJson: result.weaknesses,
      },
      update: {
        resumeText,
        strengthsJson: result.strengths,
        weaknessesJson: result.weaknesses,
      },
    });

    await logAIRequest(userId, "RESUME_ANALYSIS", "SUCCESS");
    return result;
  }

  static listVersions(userId: string) {
    return prisma.resumeVersion.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { relatedJob: { select: { companyName: true, jobTitle: true } } },
    });
  }

  static getVersion(userId: string, id: string) {
    return prisma.resumeVersion.findFirst({ where: { id, userId } });
  }

  static createVersion(
    userId: string,
    data: {
      name: string;
      targetRole?: string;
      relatedJobId?: string;
      markdownContent?: string;
      originalResumeText?: string;
      language?: ResumeLanguage;
      contentJson?: object;
    }
  ) {
    return prisma.resumeVersion.create({
      data: {
        userId,
        name: data.name,
        targetRole: data.targetRole,
        relatedJobId: data.relatedJobId,
        markdownContent: data.markdownContent,
        originalResumeText: data.originalResumeText,
        language: data.language ?? "EN",
        contentJson: data.contentJson ?? { sections: [] },
      },
    });
  }

  static updateVersion(
    userId: string,
    id: string,
    data: { name?: string; markdownContent?: string }
  ) {
    return prisma.resumeVersion.updateMany({
      where: { id, userId },
      data,
    });
  }

  static deleteVersion(userId: string, id: string) {
    return prisma.resumeVersion.deleteMany({ where: { id, userId } });
  }
}
