import { useQuery } from "@tanstack/react-query";
import { execute } from "~/graphql/execute";
import { GET_LATEST_BUDGET_YEAR_QUERY, budgetYearQueryKeys } from "~/queries";
import type { DataProgress } from "~/types/progress";

const IN_PROGRESS_MESSAGE =
  "資料尚未建置完成或立法院尚在審議中，此處預算視覺化非最終通過狀態";

const DataProgressNotice = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: budgetYearQueryKeys.latest(),
    queryFn: () =>
      execute(GET_LATEST_BUDGET_YEAR_QUERY, {
        skip: 0,
        take: 1,
      }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || isError) {
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
    <div className="w-full pt-9">
      <div className="hidden justify-center md:flex">
        <div className="bg-budget-accent w-[488px] rounded-[11px] px-5 py-4">
          <p className="text-center text-[14px] font-medium text-black">
            {IN_PROGRESS_MESSAGE}
          </p>
        </div>
      </div>
      <div className="marquee-container bg-budget-accent max-w-screen py-[6px] md:hidden">
        <p className="animate-marquee px-[10px] text-[14px] font-normal text-black">
          {IN_PROGRESS_MESSAGE}
        </p>
      </div>
    </div>
  );
};

export default DataProgressNotice;
