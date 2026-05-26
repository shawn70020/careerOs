import { z } from "zod";

export const learningPromptsSchema = z.object({
  beginner: z.string(),
  practice: z.string(),
  interview: z.string(),
  debugging: z.string(),
  project: z.string(),
});

export const roadmapTreeNodeSchema: z.ZodType<RoadmapTreeNode> = z.lazy(() =>
  z.object({
    label: z.string(),
    children: z.array(roadmapTreeNodeSchema).optional(),
  })
);

export type RoadmapTreeNode = {
  label: string;
  children?: RoadmapTreeNode[];
};

export const learningRoadmapItemSchema = z.object({
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

export const learningRoadmapResultSchema = z.object({
  title: z.string(),
  summary: z.string(),
  skillStageSummary: z.string(),
  tree: z.array(roadmapTreeNodeSchema),
  items: z.array(learningRoadmapItemSchema),
  priorityRecommendations: z.array(z.string()).optional(),
});

export type LearningPrompts = z.infer<typeof learningPromptsSchema>;
export type LearningRoadmapItem = z.infer<typeof learningRoadmapItemSchema>;
export type LearningRoadmapResult = z.infer<typeof learningRoadmapResultSchema>;
