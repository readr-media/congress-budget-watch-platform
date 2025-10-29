import {
  PROGRESS_STAGE_LABELS,
  PROGRESS_STAGE_ORDER,
} from "~/constants/progress-stages";

const content = {
  title: "114 年中央政府總預算",
  progressToggle: "114年度 (2025)",
  progressLabels: PROGRESS_STAGE_ORDER.map(
    (stage) => PROGRESS_STAGE_LABELS[stage]
  ),
};
export default content;
