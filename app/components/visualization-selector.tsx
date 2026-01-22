import { forwardRef } from "react";
import Select from "react-select";
import type {
  Props as SelectProps,
  GroupBase,
  SelectInstance,
  StylesConfig,
} from "react-select";

type Option = { value: string; label: string };
type Variant = "budget-desktop";

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

const resolveStyles = (
  variant: Variant | undefined,
  styles: StylesConfig<Option, false> | undefined
): StylesConfig<Option, false> | undefined => {
  if (!variant) return styles;
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

  return (
    <div className={wrapperClassName ?? "w-60"}>
      <Select ref={ref} options={options} styles={resolvedStyles} {...props} />
    </div>
  );
});

VisualizationSelector.displayName = "VisualizationSelector";
