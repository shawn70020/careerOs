import { parseStringArray } from "@/lib/parse-json-arrays";
import { LearningPromptLibrary, type LearningPrompts } from "@/components/learning/learning-prompt-library";

type TaskLearningResourcesProps = {
  skillName?: string | null;
  topic?: string | null;
  category?: string | null;
  gapDescription?: string | null;
  suggestedGoal?: string | null;
  practiceIdea?: string | null;
  relatedSkillsJson: unknown;
  learningPromptsJson: unknown;
  practiceTasksJson: unknown;
  interviewQuestionsJson: unknown;
  labels: {
    skill: string;
    topic: string;
    category: string;
    gap: string;
    goal: string;
    practiceIdea: string;
    relatedSkills: string;
    practice: string;
    interviewQuestions: string;
  };
};

function parsePrompts(json: unknown): LearningPrompts | null {
  if (!json || typeof json !== "object") return null;
  return json as LearningPrompts;
}

export function TaskLearningResources({
  skillName,
  topic,
  category,
  gapDescription,
  suggestedGoal,
  practiceIdea,
  relatedSkillsJson,
  learningPromptsJson,
  practiceTasksJson,
  interviewQuestionsJson,
  labels,
}: TaskLearningResourcesProps) {
  const practice = parseStringArray(practiceTasksJson);
  const questions = parseStringArray(interviewQuestionsJson);
  const relatedSkills = parseStringArray(relatedSkillsJson);
  const prompts = parsePrompts(learningPromptsJson);

  const hasMeta =
    skillName ||
    topic ||
    category ||
    gapDescription ||
    suggestedGoal ||
    practiceIdea ||
    relatedSkills.length > 0;

  if (
    !hasMeta &&
    practice.length === 0 &&
    questions.length === 0 &&
    !prompts
  ) {
    return null;
  }

  return (
    <div className="mt-3 space-y-3 border-t pt-3">
      {hasMeta && (
        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {skillName && (
              <span className="rounded-md bg-muted px-2 py-0.5">
                {labels.skill}: <span className="text-foreground">{skillName}</span>
              </span>
            )}
            {topic && (
              <span className="rounded-md bg-muted px-2 py-0.5">
                {labels.topic}: <span className="text-foreground">{topic}</span>
              </span>
            )}
            {category && (
              <span className="rounded-md bg-muted px-2 py-0.5">
                {labels.category}: <span className="text-foreground">{category}</span>
              </span>
            )}
          </div>
          {gapDescription && (
            <p>
              <span className="font-medium">{labels.gap}:</span>{" "}
              <span className="text-muted-foreground">{gapDescription}</span>
            </p>
          )}
          {suggestedGoal && (
            <p>
              <span className="font-medium">{labels.goal}:</span>{" "}
              <span className="text-muted-foreground">{suggestedGoal}</span>
            </p>
          )}
          {practiceIdea && (
            <p>
              <span className="font-medium">{labels.practiceIdea}:</span>{" "}
              <span className="text-muted-foreground">{practiceIdea}</span>
            </p>
          )}
          {relatedSkills.length > 0 && (
            <p>
              <span className="font-medium">{labels.relatedSkills}:</span>{" "}
              {relatedSkills.join(", ")}
            </p>
          )}
        </div>
      )}

      <LearningPromptLibrary prompts={prompts} />

      {practice.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {labels.practice}
          </p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm">
            {practice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {questions.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {labels.interviewQuestions}
          </p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm">
            {questions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
