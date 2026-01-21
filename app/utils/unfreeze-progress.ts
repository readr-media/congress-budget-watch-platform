import {
  UNFREEZE_PROGRESS_LABELS,
  UNFREEZE_PROGRESS_ORDER,
  UNFREEZE_PROGRESS_PERCENTAGES,
  type UnfreezeProgressStage,
} from "~/constants/unfreeze-progress";

const UNFREEZE_STAGE_SET = new Set<UnfreezeProgressStage>(
  UNFREEZE_PROGRESS_ORDER
);

export const DEFAULT_UNFREEZE_LABELS = UNFREEZE_PROGRESS_ORDER.map(
  (stage) => UNFREEZE_PROGRESS_LABELS[stage]
);

export function getUnfreezeProgressDisplay(
  year: number | null | undefined,
  stage: string | null | undefined
) {
  const isValidStage =
    !!stage && UNFREEZE_STAGE_SET.has(stage as UnfreezeProgressStage);

  if (!isValidStage) {
    const baseText = year
      ? `${year} 年度中央政府總預算尚無解凍進度`
      : "暫無解凍進度資料";
    return {
      text: baseText,
      percentage: 0,
      label: "尚無解凍進度",
      isValid: false,
    };
  }

  const normalizedStage = stage as UnfreezeProgressStage;
  const stageLabel = UNFREEZE_PROGRESS_LABELS[normalizedStage];
  const prefix = year ? `${year} 年度中央政府總預算` : "";

  return {
    text: prefix ? `${prefix}${stageLabel}` : stageLabel,
    percentage: UNFREEZE_PROGRESS_PERCENTAGES[normalizedStage],
    label: stageLabel,
    isValid: true,
  };
}
