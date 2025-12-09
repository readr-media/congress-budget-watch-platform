import type { RefCallback } from "react";
import type {
  SelectOption,
  VisualizationMode,
  VisualizationTab,
} from "~/types/visualization";
import type { SummaryPanelSummary } from "../components/SummaryPanel";
import type { CirclePackPadding } from "../circle-pack-chart";
import type { GetVisualizationProposalsQuery } from "~/graphql/graphql";
import type { NodeDatum, VisualizationGroupedData } from "../helpers";

export type VisualizationViewProps = {
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
  legislatorChartContainerRef: RefCallback<HTMLDivElement>;
  legislatorChartWidth: number;
  legislatorChartHeight: number;
  departmentChartContainerRef: RefCallback<HTMLDivElement>;
  departmentChartWidth: number;
  departmentChartHeight: number;
  visualizationData: GetVisualizationProposalsQuery;
  legislatorVisualizationData: VisualizationGroupedData | null;
  legislatorSummary: SummaryPanelSummary;
  departmentSummary: SummaryPanelSummary;
  legislatorPadding?: CirclePackPadding;
  selectedDepartmentCategorizedData: Record<string, NodeDatum> | null;
  selectedDepartmentTitle?: string | null;
  showSelectedDepartmentChart: boolean;
  onNodeClick: (node: NodeDatum) => void;
};

export type UseVisualizationStateResult = {
  activeTab: VisualizationTab;
  handleTabChange: (tab: VisualizationTab) => void;
  mode: VisualizationMode;
  setMode: (mode: VisualizationMode) => void;
  selectedYear: SelectOption;
  handleYearChange: (option: SelectOption) => void;
  yearOptions: SelectOption[];
  legislatorOptions: SelectOption[];
  selectedLegislatorOption: SelectOption | null;
  handleLegislatorChange: (option: SelectOption | null) => void;
  departmentOptions: SelectOption[];
  selectedDepartmentOption: SelectOption | null;
  handleDepartmentChange: (option: SelectOption | null) => void;
  handleToggleShowAll: () => void;
  isShowingAll: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  isLoading: boolean;
  isError: boolean;
  rawData: GetVisualizationProposalsQuery | undefined;
  visualizationData: GetVisualizationProposalsQuery | null;
  legislatorVisualizationData: VisualizationGroupedData | null;
  selectedDepartmentCategorizedData: Record<string, NodeDatum> | null;
};
