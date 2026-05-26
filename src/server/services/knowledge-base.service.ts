import { prisma } from "@/lib/db";

export class KnowledgeBaseService {
  static list(userId: string) {
    return prisma.knowledgeNote.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  }

  static get(userId: string, id: string) {
    return prisma.knowledgeNote.findFirst({ where: { id, userId } });
  }

  static create(
    userId: string,
    data: { title: string; content: string; tags?: string[]; relatedSkill?: string; relatedJobId?: string }
  ) {
    return prisma.knowledgeNote.create({
      data: { userId, title: data.title, content: data.content, tags: data.tags ?? [], relatedSkill: data.relatedSkill, relatedJobId: data.relatedJobId },
    });
  }

  static update(userId: string, id: string, data: Partial<{ title: string; content: string; tags: string[] }>) {
    return prisma.knowledgeNote.updateMany({ where: { id, userId }, data });
  }

  static delete(userId: string, id: string) {
    return prisma.knowledgeNote.deleteMany({ where: { id, userId } });
  }
}
