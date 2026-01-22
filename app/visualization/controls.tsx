import Select, {
  components,
  type DropdownIndicatorProps,
  type SingleValue,
  type StylesConfig,
} from "react-select";
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
          variant="year-dropdown"
          wrapperClassName="w-[200px]"
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

const MobileDropdownIndicator = (
  props: DropdownIndicatorProps<SelectOption, false>
) => (
  <components.DropdownIndicator {...props}>
    <div className="flex items-center justify-center">
      <div
        className={`flex-none transition-transform duration-200 ${
          props.selectProps.menuIsOpen ? "rotate-[180deg]" : ""
        }`}
      >
        <div className="relative size-[12px]">
          <div className="absolute top-[8.33%] right-[12.79%] bottom-1/4 left-[12.79%]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 8.93119 8"
            >
              <path d="M0.5 2.5L4.4656 6.5L8.4312 2.5H0.5Z" fill="black" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </components.DropdownIndicator>
);

const mobileSelectStyles: StylesConfig<SelectOption, false> = {
  control: (base) => ({
    ...base,
    width: "172px",
    minHeight: "28px",
    height: "28px",
    backgroundColor: "white",
    border: "2px solid black",
    borderRadius: "8px",
    boxShadow: "none",
    cursor: "pointer",
    padding: "0 10px",
    "&:hover": {
      border: "2px solid black",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0",
    height: "28px",
  }),
  input: (base) => ({
    ...base,
    margin: "0",
    padding: "0",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "28px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0",
    paddingLeft: "10px",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "16px",
    fontFamily: "'Noto Sans T Chinese:Bold', sans-serif",
    fontWeight: "bold",
    color: "black",
    margin: "0",
  }),
  menu: (base) => ({
    ...base,
    width: "172px",
    marginTop: "4px",
    borderRadius: "8px",
    border: "2px solid black",
    boxShadow: "none",
    overflow: "hidden",
    padding: "4px 0",
  }),
  menuList: (base) => ({
    ...base,
    padding: "0",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "18px",
    fontFamily: "'Noto Sans T Chinese:Medium', sans-serif",
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "white",
    color: state.isSelected ? "#3e51ff" : "black",
    cursor: "pointer",
    padding: "0",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  }),
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
          variant="year-dropdown"
          wrapperClassName="w-[200px]"
        />
      </div>
      {!isShowingAll &&
        activeTab === "legislator" &&
        (legislatorOptions.length > 0 ? (
          <Select
            className="flex w-full items-center justify-center"
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
            styles={mobileSelectStyles}
            components={{ DropdownIndicator: MobileDropdownIndicator }}
          />
        ) : (
          <p className="text-center text-sm text-gray-500">目前沒有立委資料</p>
        ))}
      {!isShowingAll &&
        activeTab === "department" &&
        (departmentOptions.length > 0 ? (
          <Select
            className="flex w-full items-center justify-center"
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
            styles={mobileSelectStyles}
            components={{ DropdownIndicator: MobileDropdownIndicator }}
          />
        ) : (
          <p className="text-center text-sm text-gray-500">目前沒有部會資料</p>
        ))}
    </div>
  );
};
