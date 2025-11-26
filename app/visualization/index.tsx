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
import { formatAmountWithUnit, type NodeDatum } from "./helpers";
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

const Visualization = () => {
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
    <div>
      <div className="flex flex-col gap-y-3 p-4">
        <DesktopControls
          activeTab={activeTab}
          onTabChange={handleTabChange}
          yearOptions={yearOptions}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
        />
        <MobileControls
          activeTab={activeTab}
          onTabChange={handleTabChange}
          yearOptions={yearOptions}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          isShowingAll={isShowingAll}
          onToggleShowAll={handleToggleShowAll}
          legislatorOptions={legislatorOptions}
          selectedLegislator={selectedLegislatorOption}
          onLegislatorChange={handleLegislatorChange}
          departmentOptions={departmentOptions}
          selectedDepartment={selectedDepartmentOption}
          onDepartmentChange={handleDepartmentChange}
        />

        <div>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-x-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="amount"
                checked={mode === "amount"}
                onChange={() => setMode("amount")}
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
                onChange={() => setMode("count")}
                className="accent-brand-primary h-4 w-4"
              />
              <span>依數量（凍結案/刪減案/建議案）</span>
            </label>
          </div>
        </div>

        <SummaryPanel
          summary={
            activeTab === "legislator" ? legislatorSummary : departmentSummary
          }
        />

        <BudgetTypeLegend items={BUDGET_TYPE_LEGEND_ITEMS} />

        {isLoading && <BudgetDetailSkeleton isDesktop={isDesktop} />}

        <div ref={chartContainerRef} className="chart-container">
          {activeTab === "legislator" && legislatorVisualizationData && (
            <DepartmentVisualization
              data={visualizationData}
              transformedData={legislatorVisualizationData}
              padding={legislatorPadding}
              onNodeClick={handleNodeClick}
              width={chartWidth}
              height={chartHeight}
              mode={mode}
            />
          )}
          {activeTab === "department" && (
            // Tailwind CSS: full-width visual with responsive aspect ratio
            <div className="w-full">
              <div className="aspect-video md:aspect-video lg:aspect-video">
                <DepartmentVisualization
                  data={visualizationData}
                  onNodeClick={handleNodeClick}
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

export default Visualization;
