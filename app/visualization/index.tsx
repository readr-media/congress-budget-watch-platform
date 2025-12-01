import {
  useMemo,
  useRef,
  useState,
  useCallback,
  type RefCallback,
} from "react";
import { useNavigate } from "react-router";
import { DesktopControls, MobileControls } from "./controls";
import { DepartmentVisualization } from "./department";
import BudgetTypeLegend from "~/components/budget-type-legend";
import { BUDGET_TYPE_LEGEND_ITEMS } from "~/constants/legends";
import { useVisualizationState } from "./use-visualization-state";
import {
  formatAmountWithUnit,
  type NodeDatum,
  type VisualizationGroupedData,
} from "./helpers";
import type { CirclePackPadding } from "./circle-pack-chart";
import BudgetDetailSkeleton from "~/components/skeleton/budget-detail-skeleton";
import VisualizationSkeleton from "~/components/skeleton/visualization-skeleton";
import SummaryPanel, {
  type SummaryPanelSummary,
} from "./components/SummaryPanel";
import { useQuery } from "@tanstack/react-query";
import {
  BUDGET_BY_DEPARTMENT_URL,
  BUDGET_BY_LEGISLATOR_URL,
} from "~/config/budget-endpoints";
import { budgetByDepartmentSchema } from "~/types/budget-by-department.schema";
import { budgetByLegislatorSchema } from "~/types/budget-by-legislator.schema";
import type { GetVisualizationProposalsQuery } from "~/graphql/graphql";
import type {
  SelectOption,
  VisualizationMode,
  VisualizationTab,
} from "~/types/visualization";

const useChartDimensions = () => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState(300);
  const observerRef = useRef<ResizeObserver | null>(null);
  const ref: RefCallback<HTMLDivElement> = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      const measure = () => {
        const newWidth = node.getBoundingClientRect().width;
        if (newWidth > 0) {
          setWidth(newWidth);
          // derive a height using a 16:9 aspect ratio
          setHeight(Math.round((newWidth * 9) / 16));
        }
      };

      const animationFrameId = requestAnimationFrame(measure);

      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const w = entry.contentRect.width;
          setWidth(w);
          setHeight(Math.round((w * 9) / 16));
        }
      });

      observerRef.current.observe(node);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, []);

  return { ref, width, height };
};

type VisualizationViewProps = {
  activeTab: VisualizationTab;
  onTabChange: (tab: VisualizationTab) => void;
  yearOptions: SelectOption[];
  selectedYear: SelectOption;
  onYearChange: (option: SelectOption) => void;
  mode: VisualizationMode;
  onModeChange: (mode: VisualizationMode) => void;
  isShowingAll: boolean;
  onToggleShowAll: () => void;
  legislatorOptions: SelectOption[];
  selectedLegislatorOption: SelectOption | null;
  onLegislatorChange: (option: SelectOption | null) => void;
  departmentOptions: SelectOption[];
  selectedDepartmentOption: SelectOption | null;
  onDepartmentChange: (option: SelectOption | null) => void;
  isDesktop: boolean;
  isLoading: boolean;
  chartContainerRef: RefCallback<HTMLDivElement>;
  chartWidth: number;
  chartHeight: number;
  visualizationData: GetVisualizationProposalsQuery;
  legislatorVisualizationData: VisualizationGroupedData | null;
  legislatorSummary: SummaryPanelSummary;
  departmentSummary: SummaryPanelSummary;
  legislatorPadding?: CirclePackPadding;
  onNodeClick: (node: NodeDatum) => void;
};

const VisualizationView = ({
  activeTab,
  onTabChange,
  yearOptions,
  selectedYear,
  onYearChange,
  mode,
  onModeChange,
  isShowingAll,
  onToggleShowAll,
  legislatorOptions,
  selectedLegislatorOption,
  onLegislatorChange,
  departmentOptions,
  selectedDepartmentOption,
  onDepartmentChange,
  isDesktop,
  isLoading,
  chartContainerRef,
  chartWidth,
  chartHeight,
  visualizationData,
  legislatorVisualizationData,
  legislatorSummary,
  departmentSummary,
  legislatorPadding,
  onNodeClick,
}: VisualizationViewProps) => {
  return (
    <div>
      <div className="flex flex-col gap-y-3 p-4">
        <DesktopControls
          activeTab={activeTab}
          onTabChange={onTabChange}
          yearOptions={yearOptions}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
        />
        <MobileControls
          activeTab={activeTab}
          onTabChange={onTabChange}
          yearOptions={yearOptions}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
          isShowingAll={isShowingAll}
          onToggleShowAll={onToggleShowAll}
          legislatorOptions={legislatorOptions}
          selectedLegislator={selectedLegislatorOption}
          onLegislatorChange={onLegislatorChange}
          departmentOptions={departmentOptions}
          selectedDepartment={selectedDepartmentOption}
          onDepartmentChange={onDepartmentChange}
        />

        <div>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-x-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="amount"
                checked={mode === "amount"}
                onChange={() => onModeChange("amount")}
                className="accent-brand-primary h-4 w-4"
              />
              <span>依金額（刪減/凍結）</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="count"
                checked={mode === "count"}
                onChange={() => onModeChange("count")}
                className="accent-brand-primary h-4 w-4"
              />
              <span>依數量（凍結案/刪減案/建議案）</span>
            </label>
          </div>
        </div>

        <SummaryPanel
          summary={activeTab === "legislator" ? legislatorSummary : departmentSummary}
        />

        <BudgetTypeLegend items={BUDGET_TYPE_LEGEND_ITEMS} />

        {isLoading && <BudgetDetailSkeleton isDesktop={isDesktop} />}

        <div ref={chartContainerRef} className="chart-container">
          {activeTab === "legislator" && legislatorVisualizationData && (
            <DepartmentVisualization
              data={visualizationData}
              transformedData={legislatorVisualizationData}
              padding={legislatorPadding}
              onNodeClick={onNodeClick}
              width={chartWidth}
              height={chartHeight}
              mode={mode}
            />
          )}
          {activeTab === "department" && (
            <div className="w-full">
              <div className="aspect-video md:aspect-video lg:aspect-video">
                <DepartmentVisualization
                  data={visualizationData}
                  onNodeClick={onNodeClick}
                  width={chartWidth}
                  height={chartHeight}
                  mode={mode}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VisualizationContainer = () => {
  const {
    ref: chartContainerRef,
    width: chartWidth,
    height: chartHeight,
  } = useChartDimensions();
  const navigate = useNavigate();

  const {
    activeTab,
    handleTabChange,
    mode,
    setMode,
    selectedYear,
    handleYearChange,
    yearOptions,
    legislatorOptions,
    selectedLegislatorOption,
    handleLegislatorChange,
    departmentOptions,
    selectedDepartmentOption,
    handleDepartmentChange,
    handleToggleShowAll,
    isShowingAll,
    isDesktop,
    isLoading,
    isError,
    visualizationData,
    legislatorVisualizationData,
  } = useVisualizationState();

  const legislatorBudgetQueryKey = [
    "budget",
    "legislators",
    selectedLegislatorOption?.value ?? "all",
  ];
  const fetchLegislatorBudget = async () => {
    const response = await fetch(BUDGET_BY_LEGISLATOR_URL);
    if (!response.ok) {
      throw new Error("無法載入立委預算資料");
    }
    return budgetByLegislatorSchema.parse(await response.json());
  };

  const fetchDepartmentBudget = async () => {
    const response = await fetch(BUDGET_BY_DEPARTMENT_URL);
    if (!response.ok) {
      throw new Error("無法載入部會預算資料");
    }
    return budgetByDepartmentSchema.parse(await response.json());
  };
  const { data: legislatorBudgetSummaryData } = useQuery({
    queryKey: legislatorBudgetQueryKey,
    queryFn: fetchLegislatorBudget,
    enabled: activeTab === "legislator",
  });
  const departmentBudgetQueryKey = ["budget", "departments"];
  const { data: departmentBudgetSummaryData } = useQuery({
    queryKey: departmentBudgetQueryKey,
    queryFn: fetchDepartmentBudget,
    enabled: activeTab === "department",
  });
  const legislatorSummary = useMemo<SummaryPanelSummary>(() => {
    const overall = legislatorBudgetSummaryData?.[0]?.overall;
    const reductionAmount = overall?.reductionAmount ?? 0;
    const freezeAmount = overall?.freezeAmount ?? 0;
    return {
      formattedReductionAmount: formatAmountWithUnit(reductionAmount),
      formattedFreezeAmount: formatAmountWithUnit(freezeAmount),
      reductionCount: overall?.reductionCount ?? 0,
      freezeCount: overall?.freezeCount ?? 0,
      mainResolutionCount: overall?.otherCount ?? 0,
    };
  }, [legislatorBudgetSummaryData]);

  const departmentSummary = useMemo<SummaryPanelSummary>(() => {
    const overall = departmentBudgetSummaryData?.[0]?.overall;
    const reductionAmount = overall?.reductionAmount ?? 0;
    const freezeAmount = overall?.freezeAmount ?? 0;
    return {
      formattedReductionAmount: formatAmountWithUnit(reductionAmount),
      formattedFreezeAmount: formatAmountWithUnit(freezeAmount),
      reductionCount: overall?.reductionCount ?? 0,
      freezeCount: overall?.freezeCount ?? 0,
      mainResolutionCount: overall?.otherCount ?? 0,
    };
  }, [departmentBudgetSummaryData]);

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

  const handleNodeClick = useCallback(
    (node: NodeDatum) => {
      if (node.proposalId) {
        navigate(`/budget/${node.proposalId}`);
        return true;
      }
      if (node.proposerId && !node.children?.length) {
        navigate(`/visualization/legislator/${node.proposerId}`);
        return true;
      }
      return false;
    },
    [navigate]
  );

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

  if (!visualizationData) {
    return null;
  }

  return (
    <VisualizationView
      activeTab={activeTab}
      onTabChange={handleTabChange}
      yearOptions={yearOptions}
      selectedYear={selectedYear}
      onYearChange={handleYearChange}
      mode={mode}
      onModeChange={setMode}
      isShowingAll={isShowingAll}
      onToggleShowAll={handleToggleShowAll}
      legislatorOptions={legislatorOptions}
      selectedLegislatorOption={selectedLegislatorOption}
      onLegislatorChange={handleLegislatorChange}
      departmentOptions={departmentOptions}
      selectedDepartmentOption={selectedDepartmentOption}
      onDepartmentChange={handleDepartmentChange}
      isDesktop={isDesktop}
      isLoading={isLoading}
      chartContainerRef={chartContainerRef}
      chartWidth={chartWidth}
      chartHeight={chartHeight}
      visualizationData={visualizationData}
      legislatorVisualizationData={legislatorVisualizationData}
      legislatorSummary={legislatorSummary}
      departmentSummary={departmentSummary}
      legislatorPadding={legislatorPadding}
      onNodeClick={handleNodeClick}
    />
  );
};

export default VisualizationContainer;
