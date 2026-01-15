import BudgetTypeLegend from "~/components/budget-type-legend";
import BudgetDetailSkeleton from "~/components/skeleton/budget-detail-skeleton";
import { BUDGET_TYPE_LEGEND_ITEMS } from "~/constants/legends";
import SummaryPanel from "./components/SummaryPanel";
import { DesktopControls, MobileControls } from "./controls";
import { DepartmentVisualization } from "./department";
import type { VisualizationViewProps } from "./types";
import VisualizationModeSwitcher from "./components/visualization-mode-switcher";
import DepartmentDropdown from "./components/department-dropdown";
import DataProgressNotice from "~/components/data-progress-notice";

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
  legislatorChartContainerRef,
  legislatorChartWidth,
  legislatorChartHeight,
  departmentChartContainerRef,
  departmentChartWidth,
  departmentChartHeight,
  visualizationData,
  legislatorVisualizationData,
  legislatorSummary,
  departmentSummary,
  legislatorPadding,
  selectedDepartmentCategorizedData,
  selectedDepartmentTitle,
  showSelectedDepartmentChart,
  onNodeClick,
}: VisualizationViewProps) => {
  const showDesktopDepartmentDropdown = isDesktop && activeTab === "department";
  const showDepartmentVisualization =
    activeTab === "department" && visualizationData;
  const showLegislatorVisualization =
    activeTab === "legislator" && legislatorVisualizationData;
  if (isLoading) return <BudgetDetailSkeleton isDesktop={isDesktop} />;
  return (
    <div>
      <DataProgressNotice />
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
        <VisualizationModeSwitcher mode={mode} onModeChange={onModeChange} />

        <SummaryPanel
          summary={
            activeTab === "legislator" ? legislatorSummary : departmentSummary
          }
        />
        {showDesktopDepartmentDropdown && (
          <DepartmentDropdown
            departmentOptions={departmentOptions}
            selectedDepartmentOption={selectedDepartmentOption}
            onDepartmentChange={onDepartmentChange}
          />
        )}
        <BudgetTypeLegend items={BUDGET_TYPE_LEGEND_ITEMS} />
        {showLegislatorVisualization && (
          <div ref={legislatorChartContainerRef} className="chart-container">
            <DepartmentVisualization
              key="legislator-chart"
              data={visualizationData}
              transformedData={legislatorVisualizationData}
              padding={legislatorPadding}
              onNodeClick={onNodeClick}
              width={legislatorChartWidth}
              height={legislatorChartHeight}
              mode={mode}
            />
          </div>
        )}
        {showDepartmentVisualization && (
          <div ref={departmentChartContainerRef} className="chart-container">
            <DepartmentVisualization
              key="department-chart"
              data={visualizationData}
              onNodeClick={onNodeClick}
              width={departmentChartWidth}
              height={departmentChartHeight}
              mode={mode}
              selectedDepartmentCategorizedData={
                selectedDepartmentCategorizedData
              }
              selectedDepartmentTitle={selectedDepartmentTitle ?? null}
              showSelectedDepartmentChart={showSelectedDepartmentChart}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationView;
