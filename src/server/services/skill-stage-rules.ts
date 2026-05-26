/** Lightweight mock heuristics for skill stage narrative when AI_MODE=mock */
export function buildMockSkillStageHint(skillNames: string[]): string {
  const lower = skillNames.map((s) => s.toLowerCase());
  const hasVue = lower.some((s) => s.includes("vue"));
  const hasReact = lower.some((s) => s.includes("react"));
  const hasNext = lower.some((s) => s.includes("next"));
  const hasTesting = lower.some(
    (s) => s.includes("test") || s.includes("vitest") || s.includes("playwright")
  );
  const hasFramework = hasVue || hasReact || lower.some((s) => s.includes("angular"));

  if (hasVue && !hasReact) {
    return "You have Vue experience but limited React exposure — React is a strong next frontend growth direction.";
  }
  if (hasVue && hasReact && !hasNext) {
    return "You have both Vue and React — consider deepening with Next.js or Nuxt for production-ready SSR and routing.";
  }
  if (hasFramework && !hasTesting) {
    return "You have framework experience — prioritize testing, performance, and frontend architecture next.";
  }
  if (!hasFramework) {
    return "Focus on core JavaScript/TypeScript and one modern framework before advanced production topics.";
  }
  return "You have solid framework fundamentals — expand into production skills, deployment, and optional backend basics.";
}
