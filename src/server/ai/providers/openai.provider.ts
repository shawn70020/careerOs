import type { AIProvider, AIStructuredRequest } from "../ai-provider.interface";
import { MockProvider } from "./mock.provider";

/** OpenAI provider stub — falls back to mock until API integration is configured */
export class OpenAIProvider implements AIProvider {
  private fallback = new MockProvider();

  async generateStructuredData<T>(input: AIStructuredRequest): Promise<T> {
    if (!process.env.OPENAI_API_KEY) {
      return this.fallback.generateStructuredData<T>(input);
    }
    // Real OpenAI calls can be added here; MVP uses mock fallback
    return this.fallback.generateStructuredData<T>(input);
  }
}
