import { NavLink } from "react-router";
import type { LinksFunction } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Image from "~/components/image";
import { execute } from "~/graphql/execute";
import { GET_LATEST_BUDGET_YEAR_QUERY, budgetYearQueryKeys } from "~/queries";
import {
  calculateProgressPercentage,
  formatProgressText,
} from "~/utils/progress";
import type { BudgetProgressStage } from "~/constants/progress-stages";
import { STATIC_ASSETS_PREFIX } from "~/constants/config";

export function meta() {
  const ogImageUrl = `${STATIC_ASSETS_PREFIX}/image/og.png`;
  return [
    { title: "【持續更新】中央政府總預算案審查監督平台" },
    {
      property: "og:title",
      content: "【持續更新】中央政府總預算案審查監督平台",
    },
    {
      name: "description",
      content:
        "收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。還可透過視覺化方式瀏覽，一目暸然。除了已數位化的資料，此平台也透過群眾協力（crowdsourcing）辨識提案掃描檔，歡迎至協作區加入合作行列。",
    },
    {
      property: "og:description",
      content:
        "收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。還可透過視覺化方式瀏覽，一目暸然。除了已數位化的資料，此平台也透過群眾協力（crowdsourcing）辨識提案掃描檔，歡迎至協作區加入合作行列。",
    },
    {
      property: "og:image",
      content: ogImageUrl,
    },
    {
      name: "twitter:image",
      content: ogImageUrl,
    },
  ];
}

export const links: LinksFunction = () => [
  {
    rel: "preload",
    as: "image",
    href: `${STATIC_ASSETS_PREFIX}/image/homepage-banner.svg`,
    fetchpriority: "high",
  },
];

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
          <div className="relative mb-8 flex flex-col items-center justify-center">
            <Image
              src="/image/homepage-banner.svg"
              alt="國會預算監督平台 Banner"
              width={380}
              height={189}
              loading="eager"
              fetchPriority="high"
              className="h-auto w-full max-w-xl"
            />
            {isLoading ? (
              <div className="max-w-banner -mt-1 flex min-h-[60px] w-full items-center justify-center rounded-lg bg-gray-300 p-2 text-gray-600">
                載入審議進度中...
              </div>
            ) : isError ? (
              <div className="max-w-banner -mt-1 flex min-h-[60px] w-full items-center justify-center rounded-lg bg-red-100 p-2 text-red-600">
                審議進度載入失敗，請稍後再試
              </div>
            ) : latestBudgetYear ? (
              <div className="max-w-banner bg-brand-primary relative -mt-1 flex min-h-[48px] w-full items-center justify-start rounded-lg pl-1 text-white">
                <div className="border-brand-primary text-brand-primary absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-5/6 items-center justify-center rounded-lg border-2 bg-white px-1.5 py-2 text-center text-base font-bold shadow-lg md:hidden">
                  最新審議進度
                </div>
                <p className="text-brand-primary mr-2 hidden w-[160px] rounded-lg bg-white px-3.5 py-2 md:flex">
                  最新審議進度
                </p>
                <div className="flex w-full items-center justify-between">
                  <p className="flex grow justify-center border-r border-white py-2">
                    {progressText}
                  </p>
                  <p className="flex px-2">{progressPercentage}%</p>
                </div>
              </div>
            ) : (
              <div className="max-w-banner -mt-1 flex min-h-[60px] w-full items-center justify-center rounded-lg bg-gray-300 p-2 text-gray-600">
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
          className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-4"
          aria-label="main navigate"
        >
          {navigationButtons.map((button) => (
            <NavLink
              key={button.label}
              to={button.href}
              className={({ isActive }) =>
                `border-brand-accent flex min-h-[72px] w-full items-center justify-center rounded-lg border-3 px-6 py-4 text-center text-lg font-medium transition-colors ${
                  isActive
                    ? "bg-brand-accent"
                    : "hover:bg-brand-accent bg-white hover:text-black"
                } focus:ring-brand-accent text-budget-accent focus:ring-2 focus:ring-offset-2 focus:outline-none`
              }
            >
              {button.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-15 flex items-center justify-center gap-x-2 md:mt-25 md:gap-x-3">
        <NavLink
          to="https://www.readr.tw/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Readr"
        >
          <Image
            src="/image/readr-logo.svg"
            alt="Readr logo"
            width={110}
            height={48}
          />
        </NavLink>
        <NavLink
          to="https://www.freiheit.org/zh/taiwan"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Friedrich Naumann Foundation"
        >
          <Image
            src="/image/Friedrich-Naumann-Foundation-logo.svg"
            alt="Friedrich-Naumann-Foundation-logo"
            width={130}
            height={48}
            className="h-auto w-[130px] md:w-50"
          />
        </NavLink>
        <NavLink
          to="https://ccw.org.tw/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Citizen Congress Watch"
        >
          <Image
            src="/image/CCW-logo.svg"
            alt="Citizen-Watch-logo"
            width={90}
            height={48}
          />
        </NavLink>
        <Image
          src="/image/donate-CCW-logo.svg"
          alt="donate-CCW-logo"
          width={120}
          height={48}
        />
      </div>
    </div>
  );
}
