import Select, { type SingleValue } from "react-select";
import { VisualizationSelector } from "~/components/visualization-selector";
import { VisualizationTab, type SelectOption } from "~/types/visualization";

type DesktopControlsProps = {
  activeTab: VisualizationTab;
  onTabChange: (tab: VisualizationTab) => void;
  yearOptions: SelectOption[];
  selectedYear: SelectOption;
  onYearChange: (option: SelectOption) => void;
};

export const DesktopControls = ({
  activeTab,
  onTabChange,
  yearOptions,
  selectedYear,
  onYearChange,
}: DesktopControlsProps) => {
  return (
    <div className="hidden flex-col gap-y-2 md:flex md:flex-row md:items-center md:justify-center md:gap-x-6">
      <div className="flex items-center justify-center gap-x-1.5 md:gap-x-6">
        <button
          onClick={() => onTabChange(VisualizationTab.Legislator)}
          className={`rounded px-2.5 transition-colors ${
            activeTab === "legislator"
              ? "bg-brand-primary text-white"
              : "border border-gray-300 bg-white text-gray-800"
          }`}
        >
          依立委
        </button>
        <button
          onClick={() => onTabChange(VisualizationTab.Department)}
          className={`rounded px-2.5 transition-colors ${
            activeTab === "department"
              ? "bg-brand-primary text-white"
              : "border border-gray-300 bg-white text-gray-800"
          }`}
        >
          依部會
        </button>
      </div>
      <div className="flex items-center justify-center">
        <VisualizationSelector
          options={yearOptions}
          value={selectedYear}
          onChange={(option) => {
            if (option) {
              onYearChange(option as SelectOption);
            }
          }}
          aria-label="選擇年度"
          inputId="visualization-year-desktop"
          variant="budget-desktop"
          wrapperClassName="w-fit"
        />
      </div>
    </div>
  );
};

type MobileControlsProps = {
  activeTab: VisualizationTab;
  onTabChange: (tab: VisualizationTab) => void;
  yearOptions: SelectOption[];
  selectedYear: SelectOption;
  onYearChange: (option: SelectOption) => void;
  isShowingAll: boolean;
  onToggleShowAll: () => void;
  legislatorOptions: SelectOption[];
  selectedLegislator: SelectOption | null;
  onLegislatorChange: (option: SelectOption | null) => void;
  departmentOptions: SelectOption[];
  selectedDepartment: SelectOption | null;
  onDepartmentChange: (option: SelectOption | null) => void;
};

export const MobileControls = ({
  activeTab,
  onTabChange,
  yearOptions,
  selectedYear,
  onYearChange,
  isShowingAll,
  onToggleShowAll,
  legislatorOptions,
  selectedLegislator,
  onLegislatorChange,
  departmentOptions,
  selectedDepartment,
  onDepartmentChange,
}: MobileControlsProps) => {
  return (
    <div className="flex flex-col gap-y-2 md:hidden">
      <div className="flex items-center justify-center gap-x-1.5">
        <button
          onClick={onToggleShowAll}
          className={`rounded px-2.5 transition-colors ${
            isShowingAll
              ? "bg-brand-primary text-white"
              : "border border-gray-300 bg-white text-gray-800"
          }`}
        >
          看全部
        </button>
        <button
          onClick={() => onTabChange(VisualizationTab.Legislator)}
          className={`rounded px-2.5 transition-colors ${
            activeTab === "legislator"
              ? "bg-brand-primary text-white"
              : "border border-gray-300 bg-white text-gray-800"
          }`}
        >
          依立委
        </button>
        <button
          onClick={() => onTabChange(VisualizationTab.Department)}
          className={`rounded px-2.5 transition-colors ${
            activeTab === "department"
              ? "bg-brand-primary text-white"
              : "border border-gray-300 bg-white text-gray-800"
          }`}
        >
          依部會
        </button>
      </div>
      <div className="flex items-center justify-center">
        <VisualizationSelector
          options={yearOptions}
          value={selectedYear}
          onChange={(option) => {
            if (option) {
              onYearChange(option as SelectOption);
            }
          }}
          aria-label="選擇年度"
          inputId="visualization-year-mobile"
        />
      </div>
      {!isShowingAll &&
        activeTab === "legislator" &&
        (legislatorOptions.length > 0 ? (
          <Select
            className="w-full"
            value={selectedLegislator}
            options={legislatorOptions}
            onChange={(option) => {
              const singleValue = option as SingleValue<SelectOption>;
              onLegislatorChange(singleValue ?? null);
            }}
            placeholder="選擇立委"
            isSearchable
            aria-label="選擇立委"
            inputId="visualization-legislator"
          />
        ) : (
          <p className="text-center text-sm text-gray-500">目前沒有立委資料</p>
        ))}
      {!isShowingAll &&
        activeTab === "department" &&
        (departmentOptions.length > 0 ? (
          <Select
            className="w-full"
            value={selectedDepartment}
            options={departmentOptions}
            onChange={(option) => {
              const singleValue = option as SingleValue<SelectOption>;
              onDepartmentChange(singleValue ?? null);
            }}
            placeholder="選擇部會"
            isSearchable
            aria-label="選擇部會"
            inputId="visualization-department"
          />
        ) : (
          <p className="text-center text-sm text-gray-500">目前沒有部會資料</p>
        ))}
    </div>
  );
};
