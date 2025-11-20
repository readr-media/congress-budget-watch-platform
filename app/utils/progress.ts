import {
  DATA_PROGRESS_LABELS,
  PROGRESS_STAGE_LABELS,
  PROGRESS_STAGE_ORDER,
} from "~/constants/progress-stages";
import type {
  BudgetProgressStage,
  DataProgress,
  ProgressMeta,
} from "~/types/progress";

const isKnownStage = (
  stage: BudgetProgressStage | null | undefined
): stage is BudgetProgressStage =>
  !!stage && PROGRESS_STAGE_ORDER.includes(stage);

const isKnownDataProgress = (
  value: string | null | undefined
): value is DataProgress =>
  !!value && Object.hasOwn(DATA_PROGRESS_LABELS, value);

export const getStageMeta = (
  stage: BudgetProgressStage | null | undefined
): ProgressMeta => {
  if (!isKnownStage(stage)) {
    return {
      stage,
      index: -1,
      percentage: 0,
      label: "未知階段",
      isValid: false,
    };
  }

  const index = PROGRESS_STAGE_ORDER.indexOf(stage);
  const totalStages = PROGRESS_STAGE_ORDER.length;
  const percentage = totalStages
    ? Math.round(((index + 1) / totalStages) * 100)
    : 0;

  return {
    stage,
    index,
    percentage,
    label: PROGRESS_STAGE_LABELS[stage],
    isValid: true,
  };
};

export const buildProgressDisplay = (
  year: number | null | undefined,
  stage: BudgetProgressStage | null | undefined,
  dataProgress: string | null | undefined
) => {
  const meta = getStageMeta(stage);

  const progressLabel = isKnownDataProgress(dataProgress)
    ? DATA_PROGRESS_LABELS[dataProgress]
    : "進行中";

  const text = year
    ? `${year} 年度中央政府總預算${progressLabel}`
    : "載入中...";

  return {
    text,
    percentage: meta.percentage,
    stageLabel: meta.label,
    stageMeta: meta,
  };
};

export function calculateProgressPercentage(
  currentStage: BudgetProgressStage | null | undefined
): number {
  return getStageMeta(currentStage).percentage;
}

export function formatProgressText(
  year: number | null | undefined,
  dataProgress: string | null | undefined
): string {
  return buildProgressDisplay(year, null, dataProgress).text;
}

export function getProgressStageLabel(
  stage: BudgetProgressStage | null | undefined
): string {
  return getStageMeta(stage).label;
}
