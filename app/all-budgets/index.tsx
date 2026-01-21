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
  proposalQueryKeysWithOrderAndSkip,
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
  useFreezeOnly,
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
import AllBudgetsView, {
  type YearOption,
  type ProgressMode,
  type ProgressTab,
  type ProgressDisplayData,
} from "./AllBudgetsView";
import {
  DEFAULT_UNFREEZE_LABELS,
  getUnfreezeProgressDisplay,
} from "~/utils/unfreeze-progress";
import {
  calculateProgressPercentage,
  formatProgressText,
  getProgressStageLabel,
} from "~/utils/progress";
import type { BudgetProgressStage } from "~/types/progress";

const NON_NULL_BUDGET_CONDITION: ProposalWhereInput = {
  OR: [
    { budgetAmount: { gt: 0 } },
    { budgetAmount: { lt: 0 } },
    { budgetAmount: { equals: 0 } },
  ],
};

const PROGRESS_TABS: ProgressTab[] = [
  { key: "latest", label: "最新進度" },
  { key: "unfreeze", label: "解凍進度" },
];

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

type PaginatedProposalsResult = Pick<
  GetPaginatedProposalsQuery,
  "proposals" | "proposalsCount"
>;

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
  const freezeOnly = useFreezeOnly();
  const [progressMode, setProgressMode] = useState<ProgressMode>("latest");

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
  const typedYearsData = yearsData as GetProposalYearsQuery | undefined;
  const availableBudgetYears = useMemo(
    () =>
      (typedYearsData?.budgetYears ?? []).filter(
        (
          entry
        ): entry is NonNullable<
          NonNullable<GetProposalYearsQuery["budgetYears"]>[number]
        > => Boolean(entry)
      ),
    [typedYearsData]
  );

  const yearOptions: YearOption[] = useMemo(() => {
    if (!availableBudgetYears.length) return [];
    const years = availableBudgetYears
      .map((entry) => entry.year)
      .filter((y): y is number => y != null);
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    return [
      { value: null, label: "全部年份" },
      ...uniqueYears.map((year) => ({ value: year, label: `${year}年` })),
    ];
  }, [availableBudgetYears]);

  const selectedOption: SingleValue<YearOption> = useMemo(
    () => yearOptions.find((option) => option.value === selectedYear) ?? null,
    [yearOptions, selectedYear]
  );

  const { resolvedYear, resolvedEntry } = useMemo(() => {
    if (!availableBudgetYears.length) {
      return { resolvedYear: selectedYear ?? null, resolvedEntry: null };
    }

    if (selectedYear == null) {
      const entry = availableBudgetYears[0] ?? null;
      return {
        resolvedYear: entry?.year ?? null,
        resolvedEntry: entry ?? null,
      };
    }

    const entry =
      availableBudgetYears.find((year) => year.year === selectedYear) ?? null;
    return {
      resolvedYear: selectedYear,
      resolvedEntry: entry ?? null,
    };
  }, [availableBudgetYears, selectedYear]);

  const latestProgressData = useMemo<ProgressDisplayData>(() => {
    const description = formatProgressText(
      resolvedYear ?? null,
      resolvedEntry?.dataProgress ?? null
    );
    const percentage = calculateProgressPercentage(
      resolvedEntry?.budgetProgress as BudgetProgressStage | null | undefined
    );
    const stageLabel = getProgressStageLabel(
      resolvedEntry?.budgetProgress as BudgetProgressStage | null | undefined
    );

    return {
      labels: content.progressLabels,
      description,
      percentage,
      stageLabel,
    };
  }, [
    resolvedYear,
    resolvedEntry?.budgetProgress,
    resolvedEntry?.dataProgress,
  ]);

  const unfreezeProgressData = useMemo<ProgressDisplayData>(() => {
    const display = getUnfreezeProgressDisplay(
      resolvedYear ?? null,
      resolvedEntry?.unfreezeProgress ?? null
    );

    return {
      labels: DEFAULT_UNFREEZE_LABELS,
      description: display.text,
      percentage: display.percentage,
      stageLabel: display.label,
    };
  }, [resolvedYear, resolvedEntry?.unfreezeProgress]);

  const activeProgressData =
    progressMode === "latest" ? latestProgressData : unfreezeProgressData;

  const handleYearChange = useCallback(
    (option: SingleValue<YearOption>) => {
      setSelectedYear(option?.value ?? null);
    },
    [setSelectedYear]
  );

  // 計算 GraphQL 參數
  const skip = (currentPage - 1) * pageSize;
  const { orderBy, isBudgetAmountSort } = useMemo(() => {
    // 預設以預算金額由大到小排序，確保結果穩定
    const budgetAmountDesc: ProposalOrderByInput = {
      budgetAmount: OrderDirection.Desc,
    };

    // 將 sortOptions 的 value 轉換為 GraphQL orderBy 格式
    const sortOption = find(sortOptions, (o) => o.value === selectedSort);
    if (!sortOption)
      return {
        orderBy: [budgetAmountDesc],
        isBudgetAmountSort: true,
      };

    const direction =
      sortOption.direction === SortDirection.ASC
        ? OrderDirection.Asc
        : OrderDirection.Desc;

    const primaryOrder: ProposalOrderByInput = {
      [sortOption.field]: direction,
    };

    // 若主要排序即為 budgetAmount，避免重複條目
    if (sortOption.field === "budgetAmount") {
      if (direction === OrderDirection.Desc) {
        return {
          orderBy: [budgetAmountDesc],
          isBudgetAmountSort: true,
        };
      }
      return {
        orderBy: [primaryOrder],
        isBudgetAmountSort: true,
      };
    }

    return {
      orderBy: [primaryOrder, budgetAmountDesc],
      isBudgetAmountSort: false,
    };
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
    if (freezeOnly) {
      // TODO: backend schema目前沒有對proposalTypes的has/contains filter，暫時以freezeAmount>0近似篩出凍結案；待schema支援後改用proposalTypes判斷。
      filters.freezeAmount = { gt: 0 };
    }

    return filters;
  }, [departmentId, personId, debouncedSearchedValue, selectedYear, freezeOnly]);

  // 修改後的 React Query（支援分頁）
  const fetchBudgetAmountSorted = useCallback(async () => {
    const combineWithBaseFilters = (
      extra: ProposalWhereInput
    ): ProposalWhereInput => ({
      AND: [whereFilter, extra],
    });

    const nonNullWhere = combineWithBaseFilters(NON_NULL_BUDGET_CONDITION);
    const nullWhere = combineWithBaseFilters({
      NOT: [NON_NULL_BUDGET_CONDITION],
    });

    const [nonNullMeta, nullMeta] = await Promise.all([
      execute(GET_PAGINATED_PROPOSALS_QUERY, {
        skip: 0,
        take: 0,
        orderBy,
        where: nonNullWhere,
      }),
      execute(GET_PAGINATED_PROPOSALS_QUERY, {
        skip: 0,
        take: 0,
        orderBy,
        where: nullWhere,
      }),
    ]);

    const nonNullCount = nonNullMeta?.proposalsCount ?? 0;
    const nullCount = nullMeta?.proposalsCount ?? 0;
    const totalCount = nonNullCount + nullCount;

    const nonNullSkip = Math.min(skip, nonNullCount);
    const remainingNonNull = Math.max(
      Math.min(pageSize, nonNullCount - nonNullSkip),
      0
    );

    const needsNull = pageSize > remainingNonNull;
    const nullSkip = needsNull ? Math.max(skip - nonNullCount, 0) : 0;
    const nullTake = needsNull ? pageSize - remainingNonNull : 0;

    const [nonNullData, nullData] = await Promise.all([
      remainingNonNull > 0
        ? execute(GET_PAGINATED_PROPOSALS_QUERY, {
            skip: nonNullSkip,
            take: remainingNonNull,
            orderBy,
            where: nonNullWhere,
          })
        : Promise.resolve(null),
      nullTake > 0
        ? execute(GET_PAGINATED_PROPOSALS_QUERY, {
            skip: nullSkip,
            take: nullTake,
            orderBy,
            where: nullWhere,
          })
        : Promise.resolve(null),
    ]);

    return {
      proposals: [
        ...(nonNullData?.proposals ?? []),
        ...(nullData?.proposals ?? []),
      ],
      proposalsCount: totalCount,
    } satisfies PaginatedProposalsResult;
  }, [whereFilter, skip, pageSize, orderBy]);

  const { data, isLoading, isError, isPlaceholderData } =
    useQuery<PaginatedProposalsResult>({
      queryKey: proposalQueryKeysWithOrderAndSkip.paginated(
        currentPage,
        pageSize,
        selectedSort,
        whereFilter,
        selectedYear
      ),
      queryFn: () =>
        isBudgetAmountSort
          ? fetchBudgetAmountSorted()
          : execute(GET_PAGINATED_PROPOSALS_QUERY, {
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
    freezeOnly,
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

  const pageTitle = resolvedYear
    ? `${resolvedYear} 年中央政府總預算`
    : content.title;

  if (isLoading) return <AllBudgetsSkeleton isDesktop={isDesktop} />;
  if (isError) return redirect(ERROR_REDIRECT_ROUTE);

  return (
    <AllBudgetsView
      title={pageTitle}
      progressTabs={PROGRESS_TABS}
      progressMode={progressMode}
      onProgressModeChange={setProgressMode}
      progressData={activeProgressData}
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
