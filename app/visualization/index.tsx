import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { VisualizationSelector } from "~/components/visualization-selector";
import Select, { type SingleValue } from "react-select";

import { DepartmentVisualization } from "./department";
import BudgetTypeLegend from "~/components/budget-type-legend";
import { BUDGET_TYPE_LEGEND_ITEMS } from "~/constants/legends";
import {
  GET_VISUALIZATION_PROPOSALS_QUERY,
  proposalQueryKeys,
} from "~/queries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { execute } from "~/graphql/execute";
import { useFragment } from "~/graphql";
import {
  OrderDirection,
  ProposalProposalTypeType,
  VisualizationProposalBaseFragmentDoc,
  VisualizationProposalWithContextFragmentDoc,
  type ProposalOrderByInput,
  type ProposalWhereInput,
} from "~/graphql/graphql";
import { sortOptions } from "~/constants/options";
import {
  transformToGroupedByLegislatorData,
  formatAmountWithUnit,
  mapVisualizationProposals,
  type VisualizationGroupedData,
  type NodeDatum,
} from "./helpers";
import type { CirclePackPadding } from "./circle-pack-chart";
import { find, sumBy, filter } from "lodash";
import BudgetDetailSkeleton from "~/components/skeleton/budget-detail-skeleton";
import { useMediaQuery } from "usehooks-ts";
import VisualizationSkeleton from "~/components/skeleton/visualization-skeleton";

const useChartDimensions = () => {
  const [width, setWidth] = useState(300); // Start with a non-zero default
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      const measure = () => {
        const newWidth = node.getBoundingClientRect().width;
        if (newWidth > 0) {
          setWidth(newWidth);
        }
      };

      // Perform an initial measurement in the next frame to ensure layout is stable
      const animationFrameId = requestAnimationFrame(measure);

      observerRef.current = new ResizeObserver((entries) => {
        if (entries.length > 0 && entries[0]) {
          setWidth(entries[0].contentRect.width);
        }
      });

      observerRef.current.observe(node);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, []);

  return { ref, width };
};

type OptionType = {
  value: string;
  label: string;
};

const yearOptions: OptionType[] = [
  { value: "114", label: "114年度 (2025)" },
  { value: "113", label: "113年度 (2024)" },
];

// data layer
const Visualization = () => {
  const { ref: chartContainerRef, width: chartWidth } = useChartDimensions();
  const navigate = useNavigate();
  // "department" || "legislator"
  const [activeTab, setActiveTab] = useState("legislator");
  const [mode, setMode] = useState<"amount" | "count">("amount");
  const [selectedYear, setSelectedYear] = useState<OptionType>(yearOptions[0]);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isMobile = !isDesktop;
  const [selectedLegislatorOption, setSelectedLegislatorOption] =
    useState<OptionType | null>(null);
  const [selectedDepartmentOption, setSelectedDepartmentOption] =
    useState<OptionType | null>(null);
  const [shouldAutoSelectLegislator, setShouldAutoSelectLegislator] =
    useState(true);
  const [shouldAutoSelectDepartment, setShouldAutoSelectDepartment] =
    useState(true);
  const handleTabChange = useCallback(
    (tab: "legislator" | "department") => {
      setActiveTab(tab);
      if (!isDesktop) {
        if (tab === "legislator") {
          setShouldAutoSelectLegislator(true);
        } else {
          setShouldAutoSelectDepartment(true);
        }
      }
    },
    [isDesktop]
  );
  useEffect(() => {
    if (isDesktop) {
      setSelectedLegislatorOption(null);
      setSelectedDepartmentOption(null);
      setShouldAutoSelectLegislator(true);
      setShouldAutoSelectDepartment(true);
    }
  }, [isDesktop]);
  const handleClearMobileFilters = useCallback(() => {
    setSelectedLegislatorOption(null);
    setSelectedDepartmentOption(null);
    setShouldAutoSelectLegislator(false);
    setShouldAutoSelectDepartment(false);
  }, []);
  const selectedSort = "id-asc";
  const currentPage = 1;
  const pageSize = 1000;
  const whereFilter = () => {
    const filters: ProposalWhereInput = {
      year: {
        year: { equals: parseInt(selectedYear.value, 10) },
      },
    };

    return filters;
  };
  const orderBy = useMemo((): ProposalOrderByInput[] => {
    // 將 sortOptions 的 value 轉換為 GraphQL orderBy 格式
    const sortOption = find(sortOptions, (o) => o.value === selectedSort);
    if (!sortOption) return [{ id: OrderDirection.Desc }];

    const direction =
      sortOption.direction === "asc" ? OrderDirection.Asc : OrderDirection.Desc;

    return [
      {
        [sortOption.field]: direction,
      },
    ];
  }, [selectedSort]);
  const { data, isLoading, isError } = useQuery({
    queryKey: proposalQueryKeys.paginated(
      currentPage,
      pageSize,
      selectedSort,
      whereFilter(),
      parseInt(selectedYear.value)
    ),
    queryFn: () =>
      execute(GET_VISUALIZATION_PROPOSALS_QUERY, {
        skip: 0,
        take: pageSize,
        orderBy,
        where: whereFilter(),
      }),
    placeholderData: keepPreviousData, // 避免切頁時閃爍
  });
  const allProposals = useMemo(() => mapVisualizationProposals(data), [data]);
  const legislatorOptions = useMemo<OptionType[]>(() => {
    const unique = new Map<string, OptionType>();
    allProposals.forEach((proposal) => {
      const proposer = proposal.proposers?.[0];
      const value = proposer?.id ?? proposer?.name ?? "";
      const label = proposer?.name ?? "未命名立委";
      if (value) {
        unique.set(value, { value, label });
      }
    });
    return Array.from(unique.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "zh-Hant")
    );
  }, [allProposals]);
  const departmentOptions = useMemo<OptionType[]>(() => {
    const unique = new Map<string, OptionType>();
    allProposals.forEach((proposal) => {
      const government = proposal.government;
      if (!government) return;
      const value = government.name ?? government.category ?? "";
      if (!value) return;
      const label = government.name ?? "未命名部會";
      unique.set(value, { value, label });
    });
    return Array.from(unique.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "zh-Hant")
    );
  }, [allProposals]);
  const filteredLegislatorProposalIds = useMemo(() => {
    if (isDesktop) return null;
    if (activeTab !== "legislator" || !selectedLegislatorOption) return null;
    const ids = allProposals
      .filter((proposal) => {
        const proposer = proposal.proposers?.[0];
        const value = proposer?.id ?? proposer?.name ?? "";
        return value === selectedLegislatorOption.value;
      })
      .map((proposal) => proposal.id)
      .filter((id): id is string => Boolean(id));
    return new Set(ids);
  }, [activeTab, allProposals, isDesktop, selectedLegislatorOption]);
  const filteredDepartmentProposalIds = useMemo(() => {
    if (isDesktop) return null;
    if (activeTab !== "department" || !selectedDepartmentOption) return null;
    const ids = allProposals
      .filter((proposal) => {
        const government = proposal.government;
        const value = government?.name ?? government?.category ?? "";
        return value === selectedDepartmentOption.value;
      })
      .map((proposal) => proposal.id)
      .filter((id): id is string => Boolean(id));
    return new Set(ids);
  }, [activeTab, allProposals, isDesktop, selectedDepartmentOption]);
  useEffect(() => {
    if (!isMobile) return;

    if (activeTab === "legislator") {
      const hasSelection =
        selectedLegislatorOption &&
        legislatorOptions.some(
          (option) => option.value === selectedLegislatorOption.value
        );
      if (!hasSelection) {
        if (shouldAutoSelectLegislator && legislatorOptions.length > 0) {
          setSelectedLegislatorOption(legislatorOptions[0]);
        } else if (selectedLegislatorOption) {
          setSelectedLegislatorOption(null);
        }
      }
    } else if (activeTab === "department") {
      const hasSelection =
        selectedDepartmentOption &&
        departmentOptions.some(
          (option) => option.value === selectedDepartmentOption.value
        );
      if (!hasSelection) {
        if (shouldAutoSelectDepartment && departmentOptions.length > 0) {
          setSelectedDepartmentOption(departmentOptions[0]);
        } else if (selectedDepartmentOption) {
          setSelectedDepartmentOption(null);
        }
      }
    }
  }, [
    activeTab,
    departmentOptions,
    isMobile,
    legislatorOptions,
    selectedDepartmentOption,
    selectedLegislatorOption,
    shouldAutoSelectDepartment,
    shouldAutoSelectLegislator,
  ]);
  const effectiveData = useMemo(() => {
    if (!data) return null;
    if (isDesktop) return data;

    let filteredIds: Set<string> | null = null;
    if (activeTab === "legislator" && filteredLegislatorProposalIds) {
      filteredIds = filteredLegislatorProposalIds;
    } else if (activeTab === "department" && filteredDepartmentProposalIds) {
      filteredIds = filteredDepartmentProposalIds;
    }

    if (!filteredIds) {
      return data;
    }

    const ids = filteredIds;
    const filteredProposals =
      data.proposals?.filter((proposal) => {
        if (!proposal) return false;
        const proposalWithContext = useFragment(
          VisualizationProposalWithContextFragmentDoc,
          proposal
        );
        const base = useFragment(
          VisualizationProposalBaseFragmentDoc,
          proposalWithContext
        );
        const proposalId = base.id;
        return proposalId != null && ids.has(proposalId);
      }) ?? [];

    return { ...data, proposals: filteredProposals };
  }, [
    activeTab,
    data,
    filteredDepartmentProposalIds,
    filteredLegislatorProposalIds,
    isDesktop,
  ]);

  const handleNodeClick = useCallback(
    (node: NodeDatum) => {
      if (node.proposerId && !node.children?.length) {
        navigate(`/visualization/legislator/${node.proposerId}`);
      }
    },
    [navigate]
  );

  const summaryStats = useMemo(() => {
    const proposals = mapVisualizationProposals(effectiveData);

    const reductionProposals = filter(
      proposals,
      (p) => p.reductionAmount && p.reductionAmount > 0
    );

    const freezeProposals = filter(
      proposals,
      (p) => p.freezeAmount && p.freezeAmount > 0
    );

    const mainResolutionProposals = filter(proposals, (p) =>
      p.proposalTypes?.includes(ProposalProposalTypeType.Other)
    );

    return {
      totalReductionAmount: sumBy(reductionProposals, "reductionAmount"),
      reductionCount: reductionProposals.length,
      totalFreezeAmount: sumBy(freezeProposals, "freezeAmount"),
      freezeCount: freezeProposals.length,
      mainResolutionCount: mainResolutionProposals.length,
    };
  }, [effectiveData]);

  const formattedReductionAmount = formatAmountWithUnit(
    summaryStats.totalReductionAmount
  );
  const formattedFreezeAmount = formatAmountWithUnit(
    summaryStats.totalFreezeAmount
  );

  const legislatorVisualizationData =
    useMemo<VisualizationGroupedData | null>(() => {
      if (!effectiveData) return null;
      return transformToGroupedByLegislatorData(effectiveData, mode);
    }, [effectiveData, mode]);

  const legislatorPadding = useMemo<CirclePackPadding | undefined>(() => {
    if (mode !== "amount") return undefined;
    return (node) => {
      if (!node.children?.length) {
        return 10;
      }
      if (node.depth === 0) {
        return 20;
      }
      if (node.depth === 1) {
        return 36;
      }
      return 18;
    };
  }, [mode]);

  if (isLoading) {
    return <VisualizationSkeleton isDesktop={isDesktop} />;
  }

  if (isError) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-red-600">資料載入失敗，請稍後再試。</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const visualizationData = effectiveData ?? data;
  const isShowingAll =
    (activeTab === "legislator" && !selectedLegislatorOption) ||
    (activeTab === "department" && !selectedDepartmentOption);

  return (
    <div>
      <div className="flex flex-col gap-y-3 p-4">
        <div className="hidden flex-col gap-y-2 md:flex md:flex-row md:items-center md:justify-center md:gap-x-6">
          <div className="flex items-center justify-center gap-x-1.5 md:gap-x-6">
            <button
              onClick={() => handleTabChange("legislator")}
              className={`rounded px-2.5 transition-colors ${
                activeTab === "legislator"
                  ? "bg-[#3E51FF] text-white"
                  : "border border-gray-300 bg-white text-gray-800"
              }`}
            >
              依立委
            </button>
            <button
              onClick={() => handleTabChange("department")}
              className={`rounded px-2.5 transition-colors ${
                activeTab === "department"
                  ? "bg-[#3E51FF] text-white"
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
                if (option) setSelectedYear(option);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-2 md:hidden">
          <div className="flex items-center justify-center gap-x-1.5">
            <button
              onClick={handleClearMobileFilters}
              className={`rounded px-2.5 transition-colors ${
                isShowingAll
                  ? "bg-[#3E51FF] text-white"
                  : "border border-gray-300 bg-white text-gray-800"
              }`}
            >
              看全部
            </button>
            <button
              onClick={() => handleTabChange("legislator")}
              className={`rounded px-2.5 transition-colors ${
                activeTab === "legislator"
                  ? "bg-[#3E51FF] text-white"
                  : "border border-gray-300 bg-white text-gray-800"
              }`}
            >
              依立委
            </button>
            <button
              onClick={() => handleTabChange("department")}
              className={`rounded px-2.5 transition-colors ${
                activeTab === "department"
                  ? "bg-[#3E51FF] text-white"
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
                if (option) setSelectedYear(option);
              }}
            />
          </div>
          {activeTab === "legislator" &&
            (legislatorOptions.length > 0 ? (
              <div className="flex items-center justify-center">
                <Select
                  className="w-60"
                  value={selectedLegislatorOption}
                  options={legislatorOptions}
                  onChange={(option) => {
                    const singleValue = option as SingleValue<OptionType>;
                    setSelectedLegislatorOption(singleValue ?? null);
                    setShouldAutoSelectLegislator(false);
                  }}
                  placeholder="選擇立委"
                  isSearchable
                />
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">
                目前沒有立委資料
              </p>
            ))}
          {activeTab === "department" &&
            (departmentOptions.length > 0 ? (
              <div className="flex items-center justify-center">
                <Select
                  className="w-60"
                  value={selectedDepartmentOption}
                  options={departmentOptions}
                  onChange={(option) => {
                    const singleValue = option as SingleValue<OptionType>;
                    setSelectedDepartmentOption(singleValue ?? null);
                    setShouldAutoSelectDepartment(false);
                  }}
                  placeholder="選擇部會"
                  isSearchable
                />
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">
                目前沒有部會資料
              </p>
            ))}
        </div>
        <div>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-x-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="amount"
                checked={mode === "amount"}
                onChange={() => setMode("amount")}
                className="h-4 w-4 accent-[#3E51FF]"
              />
              <span>依金額（刪減/凍結）</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="count"
                checked={mode === "count"}
                onChange={() => setMode("count")}
                className="h-4 w-4 accent-[#3E51FF]"
              />
              <span>依數量（凍結案/刪減案/建議案）</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border-2 bg-[#E9E9E9] p-2.5 md:mx-auto md:max-w-[488px]">
          <div>
            <p>
              總共刪減{" "}
              <span className="text-[#E9808E]">{formattedReductionAmount}</span>
              （
              <span className="text-[#E9808E]">
                {summaryStats.reductionCount}
              </span>
              個提案）
            </p>
            <p>
              凍結{" "}
              <span className="text-[#E9808E]">{formattedFreezeAmount}</span>（
              <span className="text-[#E9808E]">{summaryStats.freezeCount}</span>
              個提案）
            </p>
            <p>
              主決議提案數：
              <span className="text-[#E9808E]">
                {summaryStats.mainResolutionCount}
              </span>
              個
            </p>
          </div>
        </div>
        <BudgetTypeLegend items={BUDGET_TYPE_LEGEND_ITEMS} />
        {isLoading && <BudgetDetailSkeleton isDesktop={isDesktop} />}
        {!isLoading && (
          <div ref={chartContainerRef} className="chart-container">
            {activeTab === "legislator" &&
              visualizationData &&
              legislatorVisualizationData && (
                <DepartmentVisualization
                  data={visualizationData}
                  transformedData={legislatorVisualizationData}
                  padding={legislatorPadding}
                  onNodeClick={handleNodeClick}
                  width={chartWidth}
                  mode={mode}
                />
              )}
            {activeTab === "department" && visualizationData && (
              <DepartmentVisualization
                data={visualizationData}
                onNodeClick={handleNodeClick}
                width={chartWidth}
                mode={mode}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualization;
