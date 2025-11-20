import { useMemo } from "react";
import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { execute } from "~/graphql/execute";
import { GET_LATEST_BUDGET_YEAR_QUERY, budgetYearQueryKeys } from "~/queries";
import type { DataProgress } from "~/types/progress";

const IN_PROGRESS_MESSAGE =
  "資料尚未建置完成或立法院尚在審議中，此處預算視覺化非最終通過狀態";

const isVisualizationRoute = (pathname: string) => {
  if (pathname === "/visualization") return true;
  return pathname.startsWith("/visualization/legislator/");
};

export const DataProgressMarquee = () => {
  const location = useLocation();

  const shouldFetch = useMemo(
    () => isVisualizationRoute(location.pathname),
    [location.pathname]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: budgetYearQueryKeys.latest(),
    queryFn: () =>
      execute(GET_LATEST_BUDGET_YEAR_QUERY, {
        skip: 0,
        take: 1,
      }),
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
  });

  if (!shouldFetch || isLoading || isError) {
    return null;
  }

  const latestBudgetYear = data?.budgetYears?.[0] ?? null;
  const dataProgress = latestBudgetYear?.dataProgress as
    | DataProgress
    | null
    | undefined;

  if (dataProgress !== "in-progress") {
    return null;
  }

  return (
    <div className="marquee-container bg-surface-banner py-2">
      <p className="animate-marquee text-budget-accent px-4 text-sm font-medium md:text-base">
        {IN_PROGRESS_MESSAGE}
      </p>
    </div>
  );
};

export default DataProgressMarquee;
