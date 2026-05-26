import { prisma } from "@/lib/db";

export class CareerProfileService {
  static async getByUserId(userId: string) {
    return prisma.careerProfile.findUnique({
      where: { userId },
      include: { experiences: { orderBy: { startDate: "desc" } }, projects: true },
    });
  }

  static async upsert(
    userId: string,
    data: {
      fullName?: string;
      currentTitle?: string;
      targetRoles?: string[];
      resumeText?: string;
      email?: string;
      location?: string;
      onboardingComplete?: boolean;
    }
  ) {
    return prisma.careerProfile.upsert({
      where: { userId },
      create: { userId, targetRoles: data.targetRoles ?? ["Frontend Engineer"], ...data },
      update: data,
    });
  }
}
