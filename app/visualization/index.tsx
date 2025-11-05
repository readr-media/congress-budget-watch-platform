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
import { type NodeDatum } from "./helpers";
import type { CirclePackPadding } from "./circle-pack-chart";
import BudgetDetailSkeleton from "~/components/skeleton/budget-detail-skeleton";
import VisualizationSkeleton from "~/components/skeleton/visualization-skeleton";

const useChartDimensions = () => {
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
        }
      };

      const animationFrameId = requestAnimationFrame(measure);

      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setWidth(entry.contentRect.width);
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

const Visualization = () => {
  const { ref: chartContainerRef, width: chartWidth } = useChartDimensions();
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
    handleClearMobileFilters,
    isShowingAll,
    isDesktop,
    isLoading,
    isError,
    visualizationData,
    legislatorVisualizationData,
    summaryStats,
    formattedReductionAmount,
    formattedFreezeAmount,
  } = useVisualizationState();

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
    [navigate],
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
          onClearFilters={handleClearMobileFilters}
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
                className="h-4 w-4 accent-brand-primary"
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
                className="h-4 w-4 accent-brand-primary"
              />
              <span>依數量（凍結案/刪減案/建議案）</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg border-2 bg-surface-notice p-2.5 md:mx-auto md:max-w-visualization-card">
          <div>
            <p>
              總共刪減{" "}
              <span className="text-brand-accent">
                {formattedReductionAmount}
              </span>
              （
              <span className="text-brand-accent">
                {summaryStats.reductionCount}
              </span>
              個提案）
            </p>
            <p>
              凍結{" "}
              <span className="text-brand-accent">
                {formattedFreezeAmount}
              </span>
              （
              <span className="text-brand-accent">{summaryStats.freezeCount}</span>
              個提案）
            </p>
            <p>
              主決議提案數：
              <span className="text-brand-accent">
                {summaryStats.mainResolutionCount}
              </span>
              個
            </p>
          </div>
        </div>

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
              mode={mode}
            />
          )}
          {activeTab === "department" && (
            <DepartmentVisualization
              data={visualizationData}
              onNodeClick={handleNodeClick}
              width={chartWidth}
              mode={mode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualization;
