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
import Image from "~/components/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

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

        <div className="bg-surface-notice md:max-w-visualization-card flex flex-col items-center justify-center rounded-lg border-2 p-2.5 md:mx-auto">
          <div>
            <p>
              總共刪減{" "}
              <span className="text-budget-accent">
                {formattedReductionAmount}
              </span>
              （
              <span className="text-budget-accent">
                {summaryStats.reductionCount}
              </span>
              個提案）
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 inline-flex">
                    <Image
                      src="/icon/icon-explain.svg"
                      alt="說明"
                      className="h-4 w-4"
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white">
                  刪減案相關說明
                </TooltipContent>
              </Tooltip>
            </p>
            <p>
              凍結{" "}
              <span className="text-budget-accent">
                {formattedFreezeAmount}
              </span>
              （
              <span className="text-budget-accent">
                {summaryStats.freezeCount}
              </span>
              個提案）
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 inline-flex">
                    <Image
                      src="/icon/icon-explain.svg"
                      alt="說明"
                      className="h-4 w-4"
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white">
                  凍結案相關說明
                </TooltipContent>
              </Tooltip>
            </p>
            <p>
              主決議提案數：
              <span className="text-budget-accent">
                {summaryStats.mainResolutionCount}
              </span>
              個
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 inline-flex">
                    <Image
                      src="/icon/icon-explain.svg"
                      alt="說明"
                      className="h-4 w-4"
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white">
                  主決議提案相關說明
                </TooltipContent>
              </Tooltip>
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
