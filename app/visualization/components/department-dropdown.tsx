import { useMemo } from "react";
import Select, { type SingleValue, type StylesConfig } from "react-select";
import { useMediaQuery } from "usehooks-ts";
import type { SelectOption } from "~/types/visualization";

type DepartmentDropdownProps = {
  departmentOptions: SelectOption[];
  selectedDepartmentOption: SelectOption | null;
  onDepartmentChange: (option: SelectOption | null) => void;
};

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
        borderColor: "#000",
        borderRadius: 4,
        borderWidth: 0.5,
        boxShadow: "none",
        minHeight: 20,
        height: 20,
        ":hover": {
          borderColor: "#000",
        },
      }),
      valueContainer: (base) => ({
        ...base,
        padding: "0 12px",
      }),
      singleValue: (base) => ({
        ...base,
        fontSize: 15,
        fontWeight: 500,
        textAlign: "center",
        width: "100%",
      }),
      placeholder: (base) => ({
        ...base,
        fontSize: 15,
        fontWeight: 500,
        textAlign: "center",
        width: "100%",
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      dropdownIndicator: (base) => ({
        ...base,
        color: "#000",
        padding: "0 8px 0 0",
        ":hover": {
          color: "#000",
        },
      }),
      menu: (base) => ({
        ...base,
        zIndex: 20,
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
        className="w-full md:max-w-xl"
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
      />
    </div>
  );
};

export default DepartmentDropdown;
