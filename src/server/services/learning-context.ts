import { prisma } from "@/lib/db";
import { buildMockSkillStageHint } from "./skill-stage-rules";

export type LearningGenerationContext = {
  growthDirection: string;
  targetRole: string;
  outputLanguage: string;
  profile: {
    resumeText?: string | null;
    strengths: string[];
    weaknesses: string[];
    targetRoles: string[];
  };
  skills: { name: string; level: string; source: string }[];
  job?: {
    jobId: string;
    jobTitle: string;
    companyName: string;
    missingSkills: string[];
    mustHaveSkills: string[];
  };
  weakAreas: { title: string; severity: string; category?: string | null }[];
  recentStuckPoints?: string | null;
  skillStageHint: string;
  snapshot: {
    userSkillIds: string[];
    reportId?: string;
    weakAreaIds: string[];
  };
};

export class LearningContextBuilder {
  static async build(
    userId: string,
    options: {
      growthDirection?: string;
      targetRole?: string;
      jobId?: string;
      outputLanguage?: string;
    }
  ): Promise<LearningGenerationContext> {
    const growthDirection =
      options.growthDirection?.trim() ||
      options.targetRole?.trim() ||
      "Frontend Engineer";
    const targetRole = options.targetRole?.trim() || growthDirection;
    const outputLanguage = options.outputLanguage ?? "BILINGUAL";

    const [profile, userSkills, weakAreas, recentLog] = await Promise.all([
      prisma.careerProfile.findUnique({ where: { userId } }),
      prisma.userSkill.findMany({
        where: { userId },
        include: { skill: true },
      }),
      prisma.weakArea.findMany({
        where: { userId, status: { in: ["ACTIVE", "IMPROVING"] } },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
      prisma.interviewLog.findFirst({
        where: { userId, stuckPoints: { not: null } },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const skillNames = userSkills.map((us) => us.skill.name);
    const skillStageHint = buildMockSkillStageHint(skillNames);

    let jobContext: LearningGenerationContext["job"];
    let reportId: string | undefined;

    if (options.jobId) {
      const job = await prisma.job.findFirst({
        where: { id: options.jobId, userId },
        include: {
          analysisReports: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });
      if (job?.analysisReports[0]) {
        const report = job.analysisReports[0];
        reportId = report.id;
        jobContext = {
          jobId: job.id,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          missingSkills: (report.missingSkillsJson as string[]) ?? [],
          mustHaveSkills: (report.mustHaveSkillsJson as string[]) ?? [],
        };
      }
    }

    return {
      growthDirection,
      targetRole,
      outputLanguage,
      profile: {
        resumeText: profile?.resumeText,
        strengths: (profile?.strengthsJson as string[]) ?? [],
        weaknesses: (profile?.weaknessesJson as string[]) ?? [],
        targetRoles: profile?.targetRoles ?? [],
      },
      skills: userSkills.map((us) => ({
        name: us.skill.name,
        level: us.level,
        source: us.source,
      })),
      job: jobContext,
      weakAreas: weakAreas.map((wa) => ({
        title: wa.title,
        severity: wa.severity,
        category: wa.category,
      })),
      recentStuckPoints: recentLog?.stuckPoints ?? null,
      skillStageHint,
      snapshot: {
        userSkillIds: userSkills.map((us) => us.id),
        reportId,
        weakAreaIds: weakAreas.map((wa) => wa.id),
      },
    };
  }

  static async listJobsWithReports(userId: string) {
    const jobs = await prisma.job.findMany({
      where: { userId },
      include: {
        analysisReports: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
    return jobs
      .filter((j) => j.analysisReports.length > 0)
      .map((j) => ({
        id: j.id,
        jobTitle: j.jobTitle,
        companyName: j.companyName,
        missingSkills: (j.analysisReports[0].missingSkillsJson as string[]) ?? [],
      }));
  }
}
