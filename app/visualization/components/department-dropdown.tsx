import Select, { type SingleValue } from "react-select";
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
      />
    </div>
  );
};

export default DepartmentDropdown;
