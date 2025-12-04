import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BUDGET_BY_LEGISLATOR_URL } from "~/config/budget-endpoints";
import { budgetByLegislatorSchema } from "~/types/budget-by-legislator.schema";
import type { SelectOption, VisualizationTab } from "~/types/visualization";
import type { SummaryPanelSummary } from "~/visualization/components/SummaryPanel";
import { formatAmountWithUnit } from "~/visualization/helpers";

type UseFetchLegislatorBudgetProps = {
  selectedLegislatorOption: SelectOption | null;
  activeTab: VisualizationTab;
};

const useFetchLegislatorBudget = ({
  selectedLegislatorOption,
  activeTab,
}: UseFetchLegislatorBudgetProps) => {
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
  const {
    data: legislatorBudgetSummaryData,
    isLoading: isLegislatorBudgetLoading,
    isError: isLegislatorBudgetError,
  } = useQuery({
    queryKey: legislatorBudgetQueryKey,
    queryFn: fetchLegislatorBudget,
    enabled: activeTab === "legislator",
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
  return {
    legislatorBudgetSummaryData,
    legislatorSummary,
    isLegislatorBudgetLoading,
    isLegislatorBudgetError,
  };
};
export default useFetchLegislatorBudget;
