const stageLabelMap: Record<string, string> = {
  budget_review: "預算審議",
  budget_unfreeze: "預算解凍",
};

export function mapStageLabel(
  type?: string | null,
  fallbackStage = "階段"
): string {
  if (!type) return fallbackStage;
  return stageLabelMap[type] ?? fallbackStage;
}

export { stageLabelMap };
