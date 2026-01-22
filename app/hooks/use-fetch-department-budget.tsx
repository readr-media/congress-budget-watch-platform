import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BUDGET_BY_DEPARTMENT_URL } from "~/config/budget-endpoints";
import { budgetByDepartmentSchema } from "~/types/budget-by-department.schema";
import type { VisualizationTab } from "~/types/visualization";
import type { SummaryPanelSummary } from "~/visualization/components/SummaryPanel";
import { formatAmountWithUnit } from "~/visualization/helpers";

type UseFetchDepartmentBudgetProps = {
  activeTab: VisualizationTab;
  year: number;
};
const useFetchDepartmentBudget = ({
  activeTab,
  year,
}: UseFetchDepartmentBudgetProps) => {
  const fetchDepartmentBudget = async () => {
    const response = await fetch(BUDGET_BY_DEPARTMENT_URL);
    if (!response.ok) {
      throw new Error("無法載入部會預算資料");
    }
    const payload = await response.json();
    const result = budgetByDepartmentSchema.safeParse(payload);
    if (!result.success) {
      throw new Error("部會預算資料格式不符合預期");
    }
    return result.data;
  };
  const departmentBudgetQueryKey = ["budget", "departments", year];
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
    const record = departmentBudgetSummaryData?.find(
      (entry) => entry.yearInfo.year === year
    );
    const overall = record?.overall;
    const reductionAmount = overall?.reductionAmount ?? 0;
    const freezeAmount = overall?.freezeAmount ?? 0;
    return {
      formattedReductionAmount: formatAmountWithUnit(reductionAmount),
      formattedFreezeAmount: formatAmountWithUnit(freezeAmount),
      reductionCount: overall?.reductionCount ?? 0,
      freezeCount: overall?.freezeCount ?? 0,
      mainResolutionCount: overall?.otherCount ?? 0,
    };
  }, [departmentBudgetSummaryData, year]);

  return {
    departmentBudgetSummaryData,
    departmentSummary,
    isDepartmentBudgetLoading,
    isDepartmentBudgetError,
  };
};
export default useFetchDepartmentBudget;
