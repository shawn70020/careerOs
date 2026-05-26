type EnumT = (key: string) => string;

export function jobStatusLabel(t: EnumT, status: string) {
  return t(`jobStatus.${status}`);
}

export function applyRecommendationLabel(t: EnumT, value: string) {
  return t(`applyRecommendation.${value}`);
}

export function workTypeLabel(t: EnumT, value: string) {
  return t(`workType.${value}`);
}

export function priorityLabel(t: EnumT, value: string) {
  return t(`priority.${value}`);
}

export function learningTaskStatusLabel(t: EnumT, value: string) {
  return t(`learningTaskStatus.${value}`);
}
