import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1).optional(),
  AUTH_URL: z.string().url().optional(),
  AI_MODE: z.enum(["mock", "openai"]).default("mock"),
  OPENAI_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

function getEnv() {
  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    AI_MODE: process.env.AI_MODE ?? "mock",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success && process.env.NODE_ENV !== "production") {
    console.warn("Env validation warning:", parsed.error.flatten());
  }

  return {
    databaseUrl: process.env.DATABASE_URL ?? "",
    authSecret: process.env.AUTH_SECRET ?? "dev-secret-change-in-production-min-32-chars",
    authUrl: process.env.AUTH_URL ?? "http://localhost:3000",
    aiMode: (process.env.AI_MODE ?? "mock") as "mock" | "openai",
    openaiApiKey: process.env.OPENAI_API_KEY,
  };
}

export const env = getEnv();
