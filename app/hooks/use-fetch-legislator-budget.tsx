import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BUDGET_BY_LEGISLATOR_URL } from "~/config/budget-endpoints";
import { budgetByLegislatorSchema } from "~/types/budget-by-legislator.schema";
import { VisualizationTab, type SelectOption } from "~/types/visualization";
import type { SummaryPanelSummary } from "~/visualization/components/SummaryPanel";
import { formatAmountWithUnit } from "~/visualization/helpers";

type UseFetchLegislatorBudgetProps = {
  selectedLegislatorOption: SelectOption | null;
  activeTab: VisualizationTab;
  isShowingAll: boolean;
};

const useFetchLegislatorBudget = ({
  selectedLegislatorOption,
  activeTab,
  isShowingAll,
}: UseFetchLegislatorBudgetProps) => {
  const legislatorBudgetQueryKey = ["budget", "legislators"];
  const fetchLegislatorBudget = async () => {
    const response = await fetch(BUDGET_BY_LEGISLATOR_URL);
    if (!response.ok) {
      throw new Error("無法載入立委預算資料");
    }
    const payload = await response.json();
    const result = budgetByLegislatorSchema.safeParse(payload);
    if (!result.success) {
      throw new Error("立委預算資料格式不符合預期");
    }
    return result.data;
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
    const record = legislatorBudgetSummaryData?.[0];
    const overall = record?.overall;

    const buildSummary = (source?: typeof overall): SummaryPanelSummary => {
      const reductionAmount = source?.reductionAmount ?? 0;
      const freezeAmount = source?.freezeAmount ?? 0;
      return {
        formattedReductionAmount: formatAmountWithUnit(reductionAmount),
        formattedFreezeAmount: formatAmountWithUnit(freezeAmount),
        reductionCount: source?.reductionCount ?? 0,
        freezeCount: source?.freezeCount ?? 0,
        mainResolutionCount: source?.otherCount ?? 0,
      };
    };

    if (
      activeTab === VisualizationTab.Legislator &&
      !isShowingAll &&
      selectedLegislatorOption &&
      record?.legislators?.length
    ) {
      const match =
        record.legislators.find(
          (legislator) => legislator.peopleId === selectedLegislatorOption.value
        ) ??
        record.legislators.find(
          (legislator) => legislator.name === selectedLegislatorOption.label
        );

      if (match) {
        const summarySource = match.allInvolved ?? match.proposerOnly;
        return buildSummary(summarySource);
      }
    }

    return buildSummary(overall);
  }, [
    activeTab,
    isShowingAll,
    legislatorBudgetSummaryData,
    selectedLegislatorOption,
  ]);
  return {
    legislatorBudgetSummaryData,
    legislatorSummary,
    isLegislatorBudgetLoading,
    isLegislatorBudgetError,
  };
};
export default useFetchLegislatorBudget;
