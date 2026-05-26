import { z } from "zod";
import { learningPromptsSchema } from "./learning-roadmap";

const bumpPriorityUpdateSchema = z.object({
  action: z.literal("BUMP_PRIORITY"),
  matchSkillName: z.string().optional(),
  matchTitle: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

const addTaskUpdateSchema = z.object({
  action: z.literal("ADD_TASK"),
  title: z.string(),
  topic: z.string().optional(),
  skillName: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  reason: z.string().optional(),
  gapDescription: z.string().optional(),
  suggestedGoal: z.string().optional(),
  difficulty: z.string().optional(),
  careerImpact: z.string().optional(),
  suggestedNextAction: z.string().optional(),
  estimatedEffort: z.string().optional(),
  practiceIdea: z.string().optional(),
  relatedSkills: z.array(z.string()).optional(),
  learningPrompts: learningPromptsSchema.optional(),
  practiceTasks: z.array(z.string()).optional(),
  interviewQuestions: z.array(z.string()).optional(),
});

export const interviewRoadmapUpdateSchema = z.discriminatedUnion("action", [
  bumpPriorityUpdateSchema,
  addTaskUpdateSchema,
]);

export type InterviewRoadmapUpdate = z.infer<typeof interviewRoadmapUpdateSchema>;
export type BumpPriorityUpdate = z.infer<typeof bumpPriorityUpdateSchema>;
export type AddTaskUpdate = z.infer<typeof addTaskUpdateSchema>;
