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
    <div className="w-full">
      <div className="md:flex hidden justify-center">
        <div className="bg-budget-accent w-[488px] rounded-[11px] px-[27px] py-[16px]">
          <p className="text-[14px] font-medium text-black text-center">
            {IN_PROGRESS_MESSAGE}
          </p>
        </div>
      </div>
      <div className="md:hidden marquee-container bg-budget-accent py-[6px]">
        <p className="animate-marquee px-[10px] text-[14px] font-normal text-black">
          {IN_PROGRESS_MESSAGE}
        </p>
      </div>
    </div>
  );
};

export default DataProgressNotice;
