import fs from "fs/promises";
import path from "path";
import type { AIProvider, AIStructuredRequest } from "../ai-provider.interface";

const FILE_MAP: Record<string, string> = {
  RESUME_ANALYSIS: "resume-analysis.json",
  JOB_ANALYSIS: "job-fit-analysis.json",
  TAILORED_RESUME: "tailored-resume.json",
  LEARNING_ROADMAP: "learning-roadmap.json",
  INTERVIEW_FEEDBACK: "interview-feedback.json",
  INTERVIEW_PREP: "interview-prep.json",
};

export class MockProvider implements AIProvider {
  async generateStructuredData<T>(input: AIStructuredRequest): Promise<T> {
    const fileName = FILE_MAP[input.action];
    if (!fileName) {
      throw new Error(`Mock provider: unknown action ${input.action}`);
    }
    const filePath = path.join(process.cwd(), "src", "demo-data", fileName);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  }
}
