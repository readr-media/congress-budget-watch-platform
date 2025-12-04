import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BUDGET_BY_DEPARTMENT_URL } from "~/config/budget-endpoints";
import { budgetByDepartmentSchema } from "~/types/budget-by-department.schema";
import type { VisualizationTab } from "~/types/visualization";
import type { SummaryPanelSummary } from "~/visualization/components/SummaryPanel";
import { formatAmountWithUnit } from "~/visualization/helpers";

type UseFetchDepartmentBudgetProps = {
  activeTab: VisualizationTab;
};
const useFetchDepartmentBudget = ({
  activeTab,
}: UseFetchDepartmentBudgetProps) => {
  const fetchDepartmentBudget = async () => {
    const response = await fetch(BUDGET_BY_DEPARTMENT_URL);
    if (!response.ok) {
      throw new Error("無法載入部會預算資料");
    }
    return budgetByDepartmentSchema.parse(await response.json());
  };
  const departmentBudgetQueryKey = ["budget", "departments"];
  const {
    data: departmentBudgetSummaryData,
    isLoading: isDepartmentBudgetLoading,
    isError: isDepartmentBudgetError,
  } = useQuery({
    queryKey: departmentBudgetQueryKey,
    queryFn: fetchDepartmentBudget,
    enabled: activeTab === "department",
  });

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

  return {
    departmentBudgetSummaryData,
    departmentSummary,
    isDepartmentBudgetLoading,
    isDepartmentBudgetError,
  };
};
export default useFetchDepartmentBudget;
