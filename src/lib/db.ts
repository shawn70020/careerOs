import { PrismaClient } from "@prisma/client";

/** Bump when Prisma schema changes so dev HMR does not keep a stale client. */
const PRISMA_CLIENT_VERSION = "2025-learning-fields";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaClientVersion?: string;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    return globalForPrisma.prisma ?? createPrismaClient();
  }

  if (
    !globalForPrisma.prisma ||
    globalForPrisma.prismaClientVersion !== PRISMA_CLIENT_VERSION
  ) {
    if (globalForPrisma.prisma) {
      void globalForPrisma.prisma.$disconnect();
    }
    globalForPrisma.prisma = createPrismaClient();
    globalForPrisma.prismaClientVersion = PRISMA_CLIENT_VERSION;
  }

  return globalForPrisma.prisma;
}

export const prisma = getPrismaClient();
