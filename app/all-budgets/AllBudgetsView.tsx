import { Suspense, lazy } from "react";
import Select, {
  type SingleValue,
  type StylesConfig,
} from "react-select";
import ProgressBar from "~/components/progress-bar";
import Image from "~/components/image";
import type { BudgetTableData } from "~/components/budget-table";
import {
  BRAND_ACCENT,
  SURFACE_BASE,
  SURFACE_ROSE_SOFT,
} from "~/constants/colors";

const BudgetsSelector = lazy(() => import("~/components/budgets-selector"));
const SortToolbar = lazy(() => import("~/components/sort-toolbar"));
const BudgetTable = lazy(() => import("~/components/budget-table"));
const Pagination = lazy(() => import("~/components/pagination"));

export type YearOption = { value: number | null; label: string };

const customSelectStyles: StylesConfig<YearOption> = {
  control: (provided) => ({
    ...provided,
    backgroundColor: BRAND_ACCENT,
    border: "2px solid black",
    borderBottom: "0",
    borderRadius: "0.375rem 0.375rem 0 0",
    boxShadow: "none",
    cursor: "pointer",
    minHeight: "38px",
    height: "38px",
    "&:hover": {
      borderColor: "black",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "38px",
    padding: "0 8px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: SURFACE_BASE,
    padding: "8px",
    "&:hover": {
      color: SURFACE_BASE,
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: SURFACE_BASE,
    fontWeight: "bold",
    fontSize: "16px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: SURFACE_BASE,
    fontWeight: "bold",
    fontSize: "16px",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "white",
    border: "2px solid black",
    borderRadius: "0",
    boxShadow: "none",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? BRAND_ACCENT
      : state.isFocused
        ? SURFACE_ROSE_SOFT
        : "white",
    color: state.isSelected ? "white" : "black",
    fontWeight: "bold",
    cursor: "pointer",
  }),
};

const BudgetsSelectorFallback = () => (
  <div className="flex justify-center py-4">
    <div className="h-[92px] w-full max-w-[640px] animate-pulse rounded border-2 border-dashed border-neutral-300 bg-white" />
  </div>
);

const SortToolbarFallback = () => (
  <div className="flex items-center justify-end pt-3">
    <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
  </div>
);

const TableFallback = ({ isDesktop }: { isDesktop: boolean }) => (
  <div
    className={`mt-4 w-full animate-pulse rounded border-2 border-dashed border-neutral-300 bg-white ${
      isDesktop ? "min-h-[620px]" : "min-h-[680px]"
    }`}
  />
);

const PaginationFallback = ({ className = "" }: { className?: string }) => (
  <div className={`flex justify-center ${className}`}>
    <div className="h-10 w-64 animate-pulse rounded-full border border-dashed border-neutral-300" />
  </div>
);

export type AllBudgetsViewProps = {
  title: string;
  progressLabels: string[];
  yearOptions: YearOption[];
  selectedYearOption: SingleValue<YearOption>;
  onYearChange: (option: SingleValue<YearOption>) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
  tableData: BudgetTableData[];
  isDesktop: boolean;
  isPlaceholderData: boolean;
};

const AllBudgetsView = ({
  title,
  progressLabels,
  yearOptions,
  selectedYearOption,
  onYearChange,
  selectedSort,
  onSortChange,
  tableData,
  isDesktop,
  isPlaceholderData,
}: AllBudgetsViewProps) => (
  <div className="p-5 md:mx-auto md:max-w-[720px] md:p-0 md:pt-8 lg:max-w-[960px]">
    <p className="mb-3 w-full text-center text-xl font-bold">{title}</p>

    <div className="mb-5 hidden h-fit w-full items-center justify-center md:flex">
      <ProgressBar
        isDesktop={isDesktop}
        className="w-[165px]"
        labels={progressLabels}
      />
    </div>
    <div className="relative mb-5 hidden items-center justify-start border-b-[2px] border-black md:flex">
      <Select
        styles={customSelectStyles}
        value={selectedYearOption}
        onChange={(option) =>
          onYearChange(option as SingleValue<YearOption>)
        }
        options={yearOptions}
        placeholder="選擇年份"
      />
      <img
        src={`${import.meta.env.BASE_URL}image/eye.svg`}
        alt="eye icon"
        className="absolute top-[14px] right-16 z-99"
      />
    </div>

    <div className="relative mb-3 h-0.5 w-full bg-black md:hidden">
      <Image
        src="/image/magnifier-eye.svg"
        alt="magnifier eye logo"
        className="bg-red absolute -top-[31.5px] z-10 h-[63px] w-[55px]"
      />
      <div className="bg-surface-base absolute -top-[31.5px] h-[63px] w-[55px]" />
    </div>

    <div className="mb-5 flex items-center justify-center border-b-[2px] border-black md:hidden">
      <Select
        styles={customSelectStyles}
        value={selectedYearOption}
        onChange={(option) =>
          onYearChange(option as SingleValue<YearOption>)
        }
        options={yearOptions}
        placeholder="選擇年份"
      />
    </div>
    <section className="text-brand-primary mb-2 flex w-full justify-center text-lg font-bold md:hidden">
      <p>最新進度</p>
    </section>
    <div className="mb-5 flex h-fit w-full items-center justify-center md:hidden">
      <ProgressBar className="w-[165px]" labels={progressLabels} />
    </div>

    <div className="h-0.5 w-full bg-black md:hidden" />
    <Suspense fallback={<BudgetsSelectorFallback />}>
      <BudgetsSelector />
    </Suspense>
    <div className="h-0.5 w-full bg-black md:hidden" />

    <Suspense fallback={<PaginationFallback className="mt-4" />}>
      <Pagination className="mt-4" />
    </Suspense>

    <Suspense fallback={<SortToolbarFallback />}>
      <SortToolbar selectedValue={selectedSort} onChange={onSortChange} />
    </Suspense>

    <Suspense fallback={<TableFallback isDesktop={isDesktop} />}>
      <BudgetTable isDesktop={isDesktop} data={tableData} className="mt-4" />
    </Suspense>

    <Suspense fallback={<PaginationFallback className="mt-4 mb-8" />}>
      <Pagination className="mt-4 mb-8" />
    </Suspense>

    {isPlaceholderData && (
      <div className="fixed right-4 bottom-4 rounded bg-blue-100 px-4 py-2 text-sm text-blue-800 shadow-lg">
        正在載入新頁面...
      </div>
    )}
  </div>
);

export default AllBudgetsView;

