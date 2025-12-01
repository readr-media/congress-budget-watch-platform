import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { redirect, useSearchParams } from "react-router";
import type { SingleValue } from "react-select";
import { ERROR_REDIRECT_ROUTE } from "~/constants/endpoints";
import { execute } from "~/graphql/execute";
import {
  GET_PAGINATED_PROPOSALS_QUERY,
  GET_PROPOSAL_YEARS_QUERY,
  proposalQueryKeys,
} from "~/queries";
import content from "./page-content";
import {
  useSelectedSort,
  useSetSelectedSort,
  useDepartmentId,
  usePersonId,
  useSearchedValue,
  useSelectedYear,
  useSetSelectedYear,
} from "~/stores/budget-selector";
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
import { usePagination, usePaginationActions } from "~/stores/paginationStore";
import { proposalToBudgetTableData } from "./helpers";
import useDebounce from "~/hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "~/constants/config";
import { sortOptions } from "~/constants/options";
import { find } from "lodash";
import AllBudgetsView, { type YearOption } from "./AllBudgetsView";


export function meta() {
  return [
    { title: "歷年預算列表 - 國會預算監督平台" },
    {
      name: "description",
      content:
        "檢視中央政府歷年預算提案與審議結果，依部會、立委、金額與年份快速篩選，掌握刪減與凍結決議。",
    },
  ];
}

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

  const [yearsQueryEnabled, setYearsQueryEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const rafId = window.requestAnimationFrame(() => {
      setYearsQueryEnabled(true);
    });
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const { data: yearsData } = useQuery({
    queryKey: proposalQueryKeys.years(),
    queryFn: () => execute(GET_PROPOSAL_YEARS_QUERY),
    enabled: yearsQueryEnabled,
  });

  const yearOptions: YearOption[] = useMemo(() => {
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

  const selectedOption: SingleValue<YearOption> = useMemo(
    () => yearOptions.find((option) => option.value === selectedYear) ?? null,
    [yearOptions, selectedYear]
  );

  const handleYearChange = useCallback(
    (option: SingleValue<YearOption>) => {
      setSelectedYear(option?.value ?? null);
    },
    [setSelectedYear]
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
    <AllBudgetsView
      title={content.title}
      progressLabels={content.progressLabels}
      yearOptions={yearOptions}
      selectedYearOption={selectedOption}
      onYearChange={handleYearChange}
      selectedSort={selectedSort}
      onSortChange={setSelectedSort}
      tableData={tableData}
      isDesktop={isDesktop}
      isPlaceholderData={Boolean(isPlaceholderData)}
    />
  );
};

export default AllBudgets;
