import { forwardRef } from "react";
import Select, {
  components,
  type DropdownIndicatorProps,
} from "react-select";
import type {
  Props as SelectProps,
  GroupBase,
  SelectInstance,
  StylesConfig,
} from "react-select";

type Option = { value: string; label: string };
type Variant = "budget-desktop" | "year-dropdown";

type VisualizationSelectorProps = SelectProps<Option, false, GroupBase<Option>> & {
  variant?: Variant;
  wrapperClassName?: string;
};

const options: Option[] = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const budgetDesktopStyles: StylesConfig<Option, false> = {
  container: (base) => ({
    ...base,
    width: "auto",
  }),
  control: (base) => ({
    ...base,
    backgroundColor: "#e9808e",
    borderColor: "#000",
    borderRadius: 8,
    borderWidth: 2,
    boxShadow: "none",
    minHeight: 28,
    height: 28,
    minWidth: 140,
    position: "relative",
    ":hover": {
      borderColor: "#000",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    justifyContent: "center",
    flex: "1 1 auto",
    padding: "0 28px 0 10px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#f6f6f6",
    fontSize: 16,
    fontWeight: 700,
    margin: 0,
    textAlign: "center",
    width: "100%",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#f6f6f6",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#f6f6f6",
    padding: 0,
    position: "absolute",
    right: 8,
    ":hover": {
      color: "#f6f6f6",
    },
  }),
  indicatorsContainer: (base) => ({
    ...base,
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 20,
  }),
};

const YearDropdownIndicator = (
  props: DropdownIndicatorProps<Option, false>
) => (
  <components.DropdownIndicator {...props}>
    <div className="flex items-center justify-center">
      <div
        className={`flex-none transition-transform duration-200 ${
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
              <path d="M0.5 2.5L4.4656 6.5L8.4312 2.5H0.5Z" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </components.DropdownIndicator>
);

const yearDropdownStyles: StylesConfig<Option, false> = {
  control: (base) => ({
    ...base,
    backgroundColor: "#e9808e",
    border: "2px solid black",
    borderRadius: "8px",
    minHeight: "28px",
    height: "28px",
    cursor: "pointer",
    boxShadow: "none",
    "&:hover": {
      border: "2px solid black",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
    height: "24px",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: "#f6f6f6",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#f6f6f6",
    fontSize: "16px",
    fontFamily: "'Noto Sans TC', sans-serif",
    fontWeight: "bold",
    margin: 0,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 4px",
    color: "white",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "white",
    border: "2px solid black",
    borderRadius: "0 0 12px 12px",
    marginTop: "-2px",
    overflow: "hidden",
    paddingTop: "10px",
    paddingBottom: "10px",
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#e9808e"
      : state.isFocused
        ? "#e9808e"
        : "transparent",
    color: "black",
    fontSize: "16px",
    fontFamily: "'Noto Sans TC', sans-serif",
    fontWeight: "bold",
    cursor: "pointer",
    padding: "0 12px",
    marginBottom: "4px",
    "&:last-child": {
      marginBottom: 0,
    },
    "&:active": {
      backgroundColor: "#e9808e",
    },
  }),
};

const resolveComponents = (
  variant: Variant | undefined
):
  | Partial<
      import("react-select").SelectComponentsConfig<Option, false, GroupBase<Option>>
    >
  | undefined => {
  if (variant === "year-dropdown") {
    return { DropdownIndicator: YearDropdownIndicator };
  }
  return undefined;
};

const resolveStyles = (
  variant: Variant | undefined,
  styles: StylesConfig<Option, false> | undefined
): StylesConfig<Option, false> | undefined => {
  if (!variant) return styles;
  if (variant === "year-dropdown") {
    return styles ? { ...yearDropdownStyles, ...styles } : yearDropdownStyles;
  }
  if (!styles) return budgetDesktopStyles;

  return {
    ...budgetDesktopStyles,
    ...styles,
  };
};

export const VisualizationSelector = forwardRef<
  SelectInstance<Option, false, GroupBase<Option>>,
  VisualizationSelectorProps
>(({ variant, wrapperClassName, styles, ...props }, ref) => {
  const resolvedStyles = resolveStyles(variant, styles);
  const resolvedComponents = resolveComponents(variant);

  return (
    <div className={wrapperClassName ?? "w-60"}>
      <Select
        ref={ref}
        options={options}
        styles={resolvedStyles}
        components={resolvedComponents}
        {...props}
      />
    </div>
  );
});

VisualizationSelector.displayName = "VisualizationSelector";
