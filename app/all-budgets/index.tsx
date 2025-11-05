import { useMemo, useEffect, useRef } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { redirect, useSearchParams } from "react-router";
import Select, { type StylesConfig, type SingleValue } from "react-select";
import { ERROR_REDIRECT_ROUTE } from "~/constants/endpoints";
import { execute } from "~/graphql/execute";
import {
  GET_PAGINATED_PROPOSALS_QUERY,
  GET_PROPOSAL_YEARS_QUERY,
  proposalQueryKeys,
} from "~/queries";
import content from "./page-content";
import ProgressBar from "~/components/progress-bar";
import BudgetsSelector from "~/components/budgets-selector";
import SortToolbar from "~/components/sort-toolbar";
import BudgetTable from "~/components/budget-table";
import {
  useSelectedSort,
  useSetSelectedSort,
  useDepartmentId,
  usePersonId,
  useSearchedValue,
  useSelectedYear,
  useSetSelectedYear,
} from "~/stores/budget-selector";
import Image from "~/components/image";
import { useMediaQuery } from "usehooks-ts";
import type {
  ProposalOrderByInput,
  ProposalWhereInput,
  GetPaginatedProposalsQuery,
  GetProposalYearsQuery,
} from "~/graphql/graphql";
import { OrderDirection } from "~/graphql/graphql";
import { SortDirection } from "~/constants/enums";
import AllBudgetsSkeleton from "~/components/skeleton/all-budgets-skeleton";
import Pagination from "~/components/pagination";
import { usePagination, usePaginationActions } from "~/stores/paginationStore";
import { proposalToBudgetTableData } from "./helpers";
import useDebounce from "~/hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "~/constants/config";
import { sortOptions } from "~/constants/options";
import { find } from "lodash";
import {
  BRAND_ACCENT,
  SURFACE_BASE,
  SURFACE_ROSE_SOFT,
} from "~/constants/colors";

type YearOptionType = { value: number | null; label: string };

export const AllBudgets = () => {
  const [searchParams] = useSearchParams();

  // 分頁狀態
  const { currentPage, pageSize } = usePagination();
  const { setTotalCount, setPage } = usePaginationActions();

  // 排序狀態（現有）
  const selectedSort = useSelectedSort();
  const setSelectedSort = useSetSelectedSort();
  const departmentId = useDepartmentId();
  const personId = usePersonId();
  const searchedValue = useSearchedValue();
  const debouncedSearchedValue = useDebounce(
    searchedValue,
    SEARCH_DEBOUNCE_DELAY
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selectedYear = useSelectedYear();
  const setSelectedYear = useSetSelectedYear();

  useEffect(() => {
    const yearFromParams = searchParams.get("year");
    if (yearFromParams) {
      const yearNumber = parseInt(yearFromParams, 10);
      if (!isNaN(yearNumber)) {
        setSelectedYear(yearNumber);
      }
    }
  }, [searchParams, setSelectedYear]);

  // 重複資料檢測 Map
  const seenProposalIds = useRef<Map<string, boolean>>(new Map());

  const { data: yearsData } = useQuery({
    queryKey: proposalQueryKeys.years(),
    queryFn: () => execute(GET_PROPOSAL_YEARS_QUERY),
  });

  const yearOptions: YearOptionType[] = useMemo(() => {
    const typedYearsData = yearsData as GetProposalYearsQuery | undefined;
    if (!typedYearsData?.budgetYears) return [];
    const years = typedYearsData.budgetYears
      .map((entry) => entry.year)
      .filter((y): y is number => y != null);
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    return [
      { value: null, label: "全部年份" },
      ...uniqueYears.map((year) => ({ value: year, label: `${year}年` })),
    ];
  }, [yearsData]);

  const selectedOption: SingleValue<YearOptionType> = useMemo(
    () => yearOptions.find((option) => option.value === selectedYear) ?? null,
    [yearOptions, selectedYear]
  );

  const customSelectStyles: StylesConfig<YearOptionType> = useMemo(
    () => ({
      control: (provided) => ({
        ...provided,
        backgroundColor: BRAND_ACCENT,
        border: "2px solid black",
        borderBottom: "0",
        borderRadius: "0.375rem 0.375rem 0 0", // rounded-t-md
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
    }),
    []
  );

  // 計算 GraphQL 參數
  const skip = (currentPage - 1) * pageSize;
  const orderBy = useMemo((): ProposalOrderByInput[] => {
    // 將 sortOptions 的 value 轉換為 GraphQL orderBy 格式
    const sortOption = find(sortOptions, (o) => o.value === selectedSort);
    if (!sortOption) return [{ id: OrderDirection.Desc }];

    const direction =
      sortOption.direction === SortDirection.ASC
        ? OrderDirection.Asc
        : OrderDirection.Desc;

    return [
      {
        [sortOption.field]: direction,
      },
    ];
  }, [selectedSort]);

  const whereFilter = useMemo((): ProposalWhereInput => {
    const filters: ProposalWhereInput = {};

    console.log("departmentId", departmentId);
    console.log("personId", personId);
    console.log("debouncedSearchedValue", debouncedSearchedValue);
    // Department 過濾
    if (departmentId) {
      filters.government = {
        id: { equals: departmentId },
      };
    }

    // People (Legislator) 過濾
    if (personId) {
      filters.proposers = {
        some: {
          id: { equals: personId },
        },
      };
    }

    if (debouncedSearchedValue) {
      filters.OR = [
        { reason: { contains: debouncedSearchedValue } },
        { description: { contains: debouncedSearchedValue } },
        { government: { name: { contains: debouncedSearchedValue } } },
        { proposers: { some: { name: { contains: debouncedSearchedValue } } } },
      ];
    }
    if (selectedYear) {
      filters.year = { year: { equals: selectedYear } };
    }

    return filters;
  }, [departmentId, personId, debouncedSearchedValue, selectedYear]);

  // 修改後的 React Query（支援分頁）
  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: proposalQueryKeys.paginated(
      currentPage,
      pageSize,
      selectedSort,
      whereFilter,
      selectedYear
    ),
    queryFn: () =>
      execute(GET_PAGINATED_PROPOSALS_QUERY, {
        skip,
        take: pageSize,
        orderBy,
        where: whereFilter,
      }),
    placeholderData: keepPreviousData, // 避免切頁時閃爍
  });
  console.log("data", data);
  // 更新總數到 store（用於計算總頁數）
  useEffect(() => {
    if (data?.proposalsCount != null) {
      setTotalCount(data.proposalsCount);
    }
  }, [data?.proposalsCount, setTotalCount]);

  // 排序或篩選變更時重置到第 1 頁
  useEffect(() => {
    setPage(1);
  }, [
    selectedSort,
    departmentId,
    personId,
    debouncedSearchedValue,
    selectedYear,
    setPage,
  ]);

  // 重複資料檢測
  useEffect(() => {
    if (!data?.proposals) return;

    // 切換頁碼或排序時清除 Map
    seenProposalIds.current.clear();

    // 檢測重複
    data.proposals.forEach(
      (
        proposal: NonNullable<GetPaginatedProposalsQuery["proposals"]>[number]
      ) => {
        if (seenProposalIds.current.has(proposal.id)) {
          if (import.meta.env.DEV) {
            console.warn(
              `[Pagination] 檢測到重複的 proposal ID: ${proposal.id}`,
              {
                currentPage,
                selectedSort,
                proposal,
              }
            );
          }
        } else {
          seenProposalIds.current.set(proposal.id, true);
        }
      }
    );
  }, [data?.proposals, currentPage, selectedSort]);

  // tableData 邏輯保持不變（但不再需要排序，因為已在 GQL 處理）
  const tableData = useMemo(() => {
    if (!data?.proposals) return [];

    // 直接轉換為 BudgetTableData（排序已由 GraphQL orderBy 處理）
    return data.proposals.map(proposalToBudgetTableData);
  }, [data?.proposals]);

  if (isLoading) return <AllBudgetsSkeleton isDesktop={isDesktop} />;
  if (isError) return redirect(ERROR_REDIRECT_ROUTE);

  return (
    <>
      <div className="p-5 md:mx-auto md:max-w-[720px] md:p-0 md:pt-8 lg:max-w-[960px]">
        {/* title start */}
        <p className="mb-3 w-full text-center text-xl font-bold">
          {content.title}
        </p>
        {/* desktop progress start */}
        <div className="mb-5 hidden h-fit w-full items-center justify-center md:flex">
          <ProgressBar
            isDesktop={isDesktop}
            className="w-[165px]"
            labels={content.progressLabels}
          />
        </div>
        <div className="relative mb-5 hidden items-center justify-start border-b-[2px] border-black md:flex">
          <Select
            styles={customSelectStyles}
            value={selectedOption}
            onChange={(option) =>
              setSelectedYear((option as SingleValue<YearOptionType>)?.value ?? null)
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
        {/* desktop progress end */}
        <div className="relative mb-3 h-0.5 w-full bg-black md:hidden">
          <Image
            src="/image/magnifier-eye.svg"
            alt="magnifier eye logo"
            className="bg-red absolute -top-[31.5px] z-10 h-[63px] w-[55px]"
          />
          <div className="absolute -top-[31.5px] h-[63px] w-[55px] bg-surface-base" />
        </div>
        {/* title end */}

        {/* mobile progress start */}
        <div className="mb-5 flex items-center justify-center border-b-[2px] border-black md:hidden">
          <Select
            styles={customSelectStyles}
            value={selectedOption}
            onChange={(option) =>
              setSelectedYear((option as SingleValue<YearOptionType>)?.value ?? null)
            }
            options={yearOptions}
            placeholder="選擇年份"
          />
        </div>
        <section className="mb-2 flex w-full justify-center text-lg font-bold text-brand-primary md:hidden">
          <p>最新進度</p>
        </section>
        <div className="mb-5 flex h-fit w-full items-center justify-center md:hidden">
          <ProgressBar className="w-[165px]" labels={content.progressLabels} />
        </div>
        {/* mobile progress end */}

        {/* budgets selector start */}
        <div className="h-0.5 w-full bg-black md:hidden" />
        <BudgetsSelector />
        <div className="h-0.5 w-full bg-black md:hidden" />

        {/* 上方分頁元件（新增）*/}
        <Pagination className="mt-4" />
        {/* 排序下拉（react-select） */}
        <SortToolbar selectedValue={selectedSort} onChange={setSelectedSort} />

        {/* 使用新的表格組件渲染清單 */}
        <BudgetTable isDesktop={isDesktop} data={tableData} className="mt-4" />

        {/* 下方分頁元件（新增，複用同一元件）*/}
        <Pagination className="mt-4 mb-8" />

        {/* Placeholder data 載入提示（可選）*/}
        {isPlaceholderData && (
          <div className="fixed right-4 bottom-4 rounded bg-blue-100 px-4 py-2 text-sm text-blue-800 shadow-lg">
            正在載入新頁面...
          </div>
        )}
      </div>
    </>
  );
};

export default AllBudgets;
