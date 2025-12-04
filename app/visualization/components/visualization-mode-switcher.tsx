import type { VisualizationMode } from "~/types/visualization";

const VisualizationModeSwitcher = ({
  mode,
  onModeChange,
}: {
  mode: VisualizationMode;
  onModeChange: (mode: VisualizationMode) => void;
}) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-x-6">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="viz-mode"
            value="amount"
            checked={mode === "amount"}
            onChange={() => onModeChange("amount")}
            className="accent-brand-primary h-4 w-4"
          />
          <span>依金額（刪減/凍結）</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="viz-mode"
            value="count"
            checked={mode === "count"}
            onChange={() => onModeChange("count")}
            className="accent-brand-primary h-4 w-4"
          />
          <span>依數量（凍結案/刪減案/建議案）</span>
        </label>
      </div>
    </div>
  );
};

export default VisualizationModeSwitcher;
