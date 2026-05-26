import { prisma } from "@/lib/db";
import type { SkillLevel, UserSkillSource } from "@prisma/client";

export class SkillService {
  static async getTemplates(role = "frontend") {
    return prisma.skill.findMany({
      where: { roleTags: { has: role === "frontend" ? "Frontend Engineer" : role } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
  }

  static async getUserSkills(userId: string) {
    return prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async addUserSkills(
    userId: string,
    skills: { skillId: string; level?: SkillLevel; source?: UserSkillSource }[]
  ) {
    const results = [];
    for (const s of skills) {
      const result = await prisma.userSkill.upsert({
        where: { userId_skillId: { userId, skillId: s.skillId } },
        create: {
          userId,
          skillId: s.skillId,
          level: s.level ?? "FAMILIAR",
          source: s.source ?? "USER_SELECTED",
        },
        update: { level: s.level, source: s.source },
      });
      results.push(result);
    }
    return results;
  }

  static async addCustomSkill(userId: string, name: string, category: string) {
    const skill = await prisma.skill.upsert({
      where: { name_category: { name, category } },
      create: { name, category, roleTags: ["Frontend Engineer"], source: "USER_ADDED" },
      update: {},
    });
    return prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId: skill.id } },
      create: { userId, skillId: skill.id, source: "USER_ADDED" },
      update: {},
    });
  }
}
