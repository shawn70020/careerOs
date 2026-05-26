import { env } from "@/lib/env";
import type { AIProvider } from "./ai-provider.interface";
import { MockProvider } from "./providers/mock.provider";
import { OpenAIProvider } from "./providers/openai.provider";

let provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!provider) {
    provider = env.aiMode === "openai" ? new OpenAIProvider() : new MockProvider();
  }
  return provider;
}
