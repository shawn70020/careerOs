import { prisma } from "@/lib/db";

export class DashboardService {
  static async getSummary(userId: string) {
    const [jobs, appliedJobs, weakAreas, learningTasks, recentInterviews, roadmaps, profile] =
      await Promise.all([
        prisma.job.count({ where: { userId } }),
        prisma.job.count({ where: { userId, status: { in: ["APPLIED", "HR_SCREEN", "TECHNICAL_INTERVIEW", "FINAL_INTERVIEW"] } } }),
        prisma.weakArea.findMany({ where: { userId, status: "ACTIVE" }, take: 5 }),
        prisma.learningTask.findMany({
          where: { roadmap: { userId }, status: { in: ["NOT_STARTED", "IN_PROGRESS"] } },
          take: 5,
          include: { roadmap: true },
        }),
        prisma.interviewLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 3 }),
        prisma.learningRoadmap.count({ where: { userId } }),
        prisma.careerProfile.findUnique({ where: { userId } }),
      ]);

    const topJobs = await prisma.job.findMany({
      where: { userId },
      include: { analysisReports: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    const resumeScore = profile?.strengthsJson ? 72 : null;

    return {
      jobCount: jobs,
      appliedCount: appliedJobs,
      weakAreas,
      learningTasks,
      recentInterviews,
      roadmapCount: roadmaps,
      topJobs,
      resumeScore,
      onboardingComplete: profile?.onboardingComplete ?? false,
    };
  }
}
