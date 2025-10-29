import {
  DATA_PROGRESS_LABELS,
  PROGRESS_STAGE_LABELS,
  PROGRESS_STAGE_ORDER,
  type BudgetProgressStage,
  type DataProgress,
} from "~/constants/progress-stages";

const isKnownStage = (
  stage: BudgetProgressStage | null | undefined
): stage is BudgetProgressStage =>
  !!stage && PROGRESS_STAGE_ORDER.includes(stage);

const isKnownDataProgress = (
  value: string | null | undefined
): value is DataProgress =>
  !!value && Object.hasOwn(DATA_PROGRESS_LABELS, value);

export function calculateProgressPercentage(
  currentStage: BudgetProgressStage | null | undefined
): number {
  if (!isKnownStage(currentStage)) return 0;

  const currentIndex = PROGRESS_STAGE_ORDER.indexOf(currentStage);
  const totalStages = PROGRESS_STAGE_ORDER.length;

  if (currentIndex === -1 || totalStages === 0) return 0;

  const percentage = ((currentIndex + 1) / totalStages) * 100;
  return Math.round(percentage);
}

export function formatProgressText(
  year: number | null | undefined,
  dataProgress: string | null | undefined
): string {
  if (!year) return "載入中...";

  const progressLabel = isKnownDataProgress(dataProgress)
    ? DATA_PROGRESS_LABELS[dataProgress]
    : "進行中";

  return `${year} 年度中央政府總預算${progressLabel}`;
}

export function getProgressStageLabel(
  stage: BudgetProgressStage | null | undefined
): string {
  if (!isKnownStage(stage)) return "未知階段";

  return PROGRESS_STAGE_LABELS[stage];
}
