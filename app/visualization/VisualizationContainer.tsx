import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import VisualizationSkeleton from "~/components/skeleton/visualization-skeleton";
import useChartDimensions from "~/hooks/useChartDimensions";
import type { CirclePackPadding } from "./circle-pack-types";
import { type NodeDatum } from "./helpers";
import { useVisualizationState } from "./use-visualization-state";
import type { VisualizationViewProps } from "./types";
import useFetchLegislatorBudget from "~/hooks/use-fetch-legislator-budget";
import useFetchDepartmentBudget from "~/hooks/use-fetch-department-budget";

const VisualizationContainer = ({
  children,
}: {
  children: (props: VisualizationViewProps) => React.ReactNode;
}) => {
  const {
    ref: legislatorChartContainerRef,
    width: legislatorChartWidth,
    height: legislatorChartHeight,
  } = useChartDimensions();
  const {
    ref: departmentChartContainerRef,
    width: departmentChartWidth,
    height: departmentChartHeight,
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
    selectedDepartmentCategorizedData,
  } = useVisualizationState();
  const selectedYearValue = Number.parseInt(selectedYear.value, 10);
  const resolvedYear = Number.isNaN(selectedYearValue) ? 0 : selectedYearValue;

  const {
    legislatorSummary,
    isLegislatorBudgetLoading,
    isLegislatorBudgetError,
  } = useFetchLegislatorBudget({
    selectedLegislatorOption,
    activeTab,
    isShowingAll,
    year: resolvedYear,
  });
  const {
    departmentSummary,
    isDepartmentBudgetLoading,
    isDepartmentBudgetError,
  } = useFetchDepartmentBudget({
    activeTab,
    year: resolvedYear,
  });

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
        const yearParam = selectedYear.value;
        const query = new URLSearchParams({ year: yearParam }).toString();
        navigate(`/visualization/legislator/${node.proposerId}?${query}`);
        return true;
      }
      return false;
    },
    [navigate, selectedYear.value]
  );

  if (isLoading || isLegislatorBudgetLoading || isDepartmentBudgetLoading) {
    return <VisualizationSkeleton isDesktop={isDesktop} />;
  }

  if (isError || isLegislatorBudgetError || isDepartmentBudgetError) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-red-600">資料載入失敗，請稍後再試。</p>
      </div>
    );
  }

  if (!visualizationData) {
    return null;
  }

  return children({
    activeTab: activeTab,
    onTabChange: handleTabChange,
    yearOptions: yearOptions,
    selectedYear: selectedYear,
    onYearChange: handleYearChange,
    mode: mode,
    onModeChange: setMode,
    isShowingAll: isShowingAll,
    onToggleShowAll: handleToggleShowAll,
    legislatorOptions: legislatorOptions,
    selectedLegislatorOption: selectedLegislatorOption,
    onLegislatorChange: handleLegislatorChange,
    departmentOptions: departmentOptions,
    selectedDepartmentOption: selectedDepartmentOption,
    onDepartmentChange: handleDepartmentChange,
    isDesktop: isDesktop,
    isLoading: isLoading,
    legislatorChartContainerRef: legislatorChartContainerRef,
    legislatorChartWidth: legislatorChartWidth,
    legislatorChartHeight: legislatorChartHeight,
    departmentChartContainerRef: departmentChartContainerRef,
    departmentChartWidth: departmentChartWidth,
    departmentChartHeight: departmentChartHeight,
    visualizationData: visualizationData,
    legislatorVisualizationData: legislatorVisualizationData,
    legislatorSummary: legislatorSummary,
    departmentSummary: departmentSummary,
    legislatorPadding: legislatorPadding,
    selectedDepartmentCategorizedData: selectedDepartmentCategorizedData,
    selectedDepartmentTitle: selectedDepartmentOption?.label ?? null,
    showSelectedDepartmentChart: Boolean(selectedDepartmentCategorizedData),
    onNodeClick: handleNodeClick,
  });
};

export default VisualizationContainer;
