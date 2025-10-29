import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Image from "~/components/image";
import { execute } from "~/graphql/execute";
import {
  GET_LATEST_BUDGET_YEAR_QUERY,
  budgetYearQueryKeys,
} from "~/queries";
import {
  calculateProgressPercentage,
  formatProgressText,
} from "~/utils/progress";
import type { BudgetProgressStage } from "~/constants/progress-stages";

export function meta() {
  return [
    { title: "中央政府總預算案審查監督平台" },
    {
      name: "description",
      content:
        "收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。",
    },
  ];
}

type NavigationButton = {
  label: string;
  href: string;
  isExternal?: boolean;
};

export default function Home() {
  const currentYear = new Date().getFullYear();
  const republicYear = currentYear - 1911;
  const {
    data: budgetYearData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: budgetYearQueryKeys.latest(),
    queryFn: () =>
      execute(GET_LATEST_BUDGET_YEAR_QUERY, {
        skip: 0,
        take: 1,
      }),
  });

  const latestBudgetYear = budgetYearData?.budgetYears?.[0] ?? null;
  const progressStage = latestBudgetYear?.budgetProgress as
    | BudgetProgressStage
    | null
    | undefined;
  const progressPercentage = calculateProgressPercentage(progressStage);
  const progressText = formatProgressText(
    latestBudgetYear?.year ?? null,
    latestBudgetYear?.dataProgress ?? null
  );

  const navigationButtons: NavigationButton[] = [
    { label: "歷年預算", href: "/all-budgets" },
    { label: "最新年度預算", href: `/all-budgets?year=${republicYear}` },
    { label: "視覺化專區", href: "/visualization" },
    { label: "協作區", href: "/collaboration" },
  ];

  return (
    <div className="bg-background flex h-full flex-col justify-between p-5 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Title Section */}
        <header className="mb-8 text-center md:mb-12">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
            中央政府總預算案審查監督平台
          </h1>

          {/* Banner Image */}
          <div className="mb-8 flex flex-col items-center justify-center">
            <Image
              src="/image/homepage-banner.svg"
              alt="國會預算監督平台 Banner"
              className="h-auto w-full max-w-xl"
            />
            {isLoading ? (
              <div className="-mt-1 flex w-full max-w-[600px] items-center justify-center rounded-lg bg-gray-300 p-2 text-gray-600">
                載入審議進度中...
              </div>
            ) : isError ? (
              <div className="-mt-1 flex w-full max-w-[600px] items-center justify-center rounded-lg bg-red-100 p-2 text-red-600">
                審議進度載入失敗，請稍後再試
              </div>
            ) : latestBudgetYear ? (
              <div className="-mt-1 flex w-full max-w-[600px] items-center justify-start rounded-lg bg-[#3E51FF] pl-1 text-white">
                <p className="mr-2 hidden w-[160px] rounded-lg bg-white px-3.5 text-[#3E51FF] md:flex">
                  最新審議進度
                </p>
                <div className="flex w-full items-center justify-between">
                  <p className="flex grow justify-center border-r border-white py-1">
                    {progressText}
                  </p>
                  <p className="flex px-2">{progressPercentage}%</p>
                </div>
              </div>
            ) : (
              <div className="-mt-1 flex w-full max-w-[600px] items-center justify-center rounded-lg bg-gray-300 p-2 text-gray-600">
                暫無審議進度資料
              </div>
            )}
          </div>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。還可透過視覺化方式瀏覽，一目暸然。除了已數位化的資料，此平台也透過群眾協力（crowdsourcing）辨識提案掃描檔，歡迎至協作區加入合作行列。
          </p>
        </header>

        {/* Navigation Buttons */}
        <nav
          className="flex flex-col md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4"
          aria-label="主要導航"
        >
          {navigationButtons.map((button, index) => (
            <NavLink
              key={button.label}
              to={button.href}
              className={({ isActive }) =>
                `rounded-lg border-[3px] border-[#E9808E] px-6 py-4 text-center text-lg font-medium transition-colors ${
                  index > 0 ? "-mt-[10px] md:mt-0" : ""
                } ${
                  isActive
                    ? "bg-[#E9808E] text-white"
                    : "bg-white text-[#E9808E] hover:bg-[#E9808E] hover:text-white"
                } focus:ring-2 focus:ring-[#E9808E] focus:ring-offset-2 focus:outline-none`
              }
            >
              {button.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-15 flex items-center justify-center gap-x-2 md:mt-25 md:gap-x-3">
        <Image
          src="/image/Friedrich-Naumann-Foundation-logo.svg"
          alt="Friedrich-Naumann-Foundation-logo"
          className="h-auto w-[130px] md:w-50"
        />
        <Image src="/image/CCW-logo.svg" alt="Citizen-Watch-logo" />
        <Image src="/image/donate-CCW-logo.svg" alt="donate-CCW-logo" />
      </div>
    </div>
  );
}
