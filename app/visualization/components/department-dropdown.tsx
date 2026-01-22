import { useMemo } from "react";
import Select, {
  components,
  type DropdownIndicatorProps,
  type SingleValue,
  type StylesConfig,
} from "react-select";
import { useMediaQuery } from "usehooks-ts";
import type { SelectOption } from "~/types/visualization";

type DepartmentDropdownProps = {
  departmentOptions: SelectOption[];
  selectedDepartmentOption: SelectOption | null;
  onDepartmentChange: (option: SelectOption | null) => void;
};

const DesktopDropdownIndicator = (
  props: DropdownIndicatorProps<SelectOption, false>
) => (
  <components.DropdownIndicator {...props}>
    <div className="flex items-center justify-center">
      <div
        className={`flex-none transition-transform ${
          props.selectProps.menuIsOpen ? "rotate-180" : ""
        }`}
      >
        <div className="relative size-[12px]">
          <div className="absolute bottom-1/4 left-[12.79%] right-[12.79%] top-[8.33%]">
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

const DepartmentDropdown = ({
  departmentOptions,
  selectedDepartmentOption,
  onDepartmentChange,
}: DepartmentDropdownProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const styles = useMemo<StylesConfig<SelectOption, false>>(
    () => ({
      container: (base) => ({
        ...base,
        width: "100%",
      }),
      control: (base) => ({
        ...base,
        backgroundColor: "#fff",
        border: "0.5px solid black",
        borderRadius: "4px",
        minHeight: "auto",
        padding: "6px 12px",
        boxShadow: "none",
        cursor: "pointer",
        "&:hover": {
          border: "0.5px solid black",
        },
      }),
      valueContainer: (base) => ({
        ...base,
        padding: 0,
        gap: "12px",
      }),
      input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
      }),
      singleValue: (base) => ({
        ...base,
        color: "black",
        margin: 0,
        fontFamily: "'Noto Serif Display Medium', sans-serif",
        fontSize: "15px",
        fontWeight: 500,
        lineHeight: "normal",
      }),
      placeholder: (base) => ({
        ...base,
        color: "black",
        margin: 0,
        fontFamily: "'Noto Serif Display Medium', sans-serif",
        fontSize: "15px",
        fontWeight: 500,
        lineHeight: "normal",
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      indicatorsContainer: (base) => ({
        ...base,
        padding: 0,
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: 0,
      }),
      menu: (base) => ({
        ...base,
        marginTop: "4px",
        border: "0.5px solid black",
        borderRadius: "4px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 20,
      }),
      menuList: (base) => ({
        ...base,
        padding: 0,
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? "#f3f4f6"
          : state.isFocused
            ? "#f9fafb"
            : "white",
        color: "black",
        padding: "12px",
        cursor: "pointer",
        fontFamily: "'Noto Serif Display Medium', sans-serif",
        fontSize: "15px",
        fontWeight: 500,
        "&:active": {
          backgroundColor: "#e5e7eb",
        },
      }),
    }),
    []
  );

  if (departmentOptions.length === 0)
    return (
      <div className="mt-4 flex w-full justify-center">
        <p className="text-center text-sm text-gray-500">目前沒有部會資料</p>
      </div>
    );

  return (
    <div className="mt-4 flex w-full justify-center">
      <Select
        className="w-full md:max-w-md"
        value={selectedDepartmentOption}
        options={departmentOptions}
        onChange={(option) => {
          const singleValue = option as SingleValue<SelectOption>;
          onDepartmentChange(singleValue ?? null);
        }}
        placeholder="選擇部會"
        isSearchable
        aria-label="選擇部會"
        inputId="visualization-department-desktop"
        styles={isDesktop ? styles : undefined}
        components={isDesktop ? { DropdownIndicator: DesktopDropdownIndicator } : undefined}
      />
    </div>
  );
};

export default DepartmentDropdown;
