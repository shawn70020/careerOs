import { prisma } from "@/lib/db";
import { detectJobLanguage, type DetectedJobLanguage } from "@/lib/detect-job-language";
import type { OutputLanguage } from "@/lib/output-language";

export type TailoredResumeGenerationContext = {
  outputLanguage: OutputLanguage;
  detectedJobLanguage: DetectedJobLanguage;
  job: {
    id: string;
    jobTitle: string;
    companyName: string;
    description: string;
  };
  resumeText: string;
  profile: {
    fullName: string | null;
    currentTitle: string | null;
    targetRoles: string[];
  } | null;
  experiences: {
    companyName: string;
    jobTitle: string;
    description: string | null;
    technologies: string[];
    isCurrent: boolean;
  }[];
  userSkills: { name: string; level: string }[];
  fitReport: {
    mustHaveSkills: string[];
    niceToHaveSkills: string[];
    missingSkills: string[];
    overallScore: number;
  } | null;
};

export class TailoredResumeContextBuilder {
  static async build(
    userId: string,
    jobId: string,
    outputLanguage: OutputLanguage = "BILINGUAL"
  ): Promise<TailoredResumeGenerationContext> {
    const job = await prisma.job.findFirst({
      where: { id: jobId, userId },
      include: {
        analysisReports: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    if (!job) throw new Error("NOT_FOUND");

    const [profile, userSkills] = await Promise.all([
      prisma.careerProfile.findUnique({
        where: { userId },
        include: {
          experiences: { orderBy: { startDate: "desc" } },
        },
      }),
      prisma.userSkill.findMany({
        where: { userId },
        include: { skill: true },
      }),
    ]);

    const resumeText = profile?.resumeText?.trim() ?? "";
    if (!resumeText) throw new Error("NO_RESUME");

    const detectedJobLanguage = detectJobLanguage(job.description, {
      jobTitle: job.jobTitle,
      companyName: job.companyName,
    });

    const report = job.analysisReports[0];
    const fitReport = report
      ? {
          mustHaveSkills: (report.mustHaveSkillsJson as string[]) ?? [],
          niceToHaveSkills: (report.niceToHaveSkillsJson as string[]) ?? [],
          missingSkills: (report.missingSkillsJson as string[]) ?? [],
          overallScore: report.overallScore,
        }
      : null;

    return {
      outputLanguage,
      detectedJobLanguage,
      job: {
        id: job.id,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        description: job.description,
      },
      resumeText,
      profile: profile
        ? {
            fullName: profile.fullName,
            currentTitle: profile.currentTitle,
            targetRoles: profile.targetRoles,
          }
        : null,
      experiences: (profile?.experiences ?? []).map((e) => ({
        companyName: e.companyName,
        jobTitle: e.jobTitle,
        description: e.description,
        technologies: e.technologies,
        isCurrent: e.isCurrent,
      })),
      userSkills: userSkills.map((us) => ({
        name: us.skill.name,
        level: us.level,
      })),
      fitReport,
    };
  }
}
