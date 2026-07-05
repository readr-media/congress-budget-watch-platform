import { NavLink } from "react-router";
import type { LinksFunction } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "~/components/image";
import { execute } from "~/graphql/execute";
import { GET_LATEST_BUDGET_YEAR_QUERY, budgetYearQueryKeys } from "~/queries";
import {
  calculateProgressPercentage,
  formatProgressText,
} from "~/utils/progress";
import type { BudgetProgressStage } from "~/constants/progress-stages";
import { STATIC_ASSETS_PREFIX } from "~/constants/config";
import ProgressBadge, {
  type ProgressBadgeProps,
} from "~/components/progress-badge";
import ProgressBadgeMobile from "~/components/progress-badge-mobile";
import { getUnfreezeProgressDisplay } from "~/utils/unfreeze-progress";

const OG_DESCRIPTION =
  "收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。還可透過視覺化方式瀏覽，一目暸然。除了已數位化的資料，此平台也透過群眾協力（crowdsourcing）辨識提案掃描檔，歡迎至協作區加入合作行列。";
const OG_TITLE = "【持續更新】中央政府總預算案審查監督平台";
const CANONICAL_URL =
  "https://readr-media.github.io/congress-budget-watch-platform/";
const OG_IMAGE_URL = `${CANONICAL_URL}image/og.png`;

export function meta() {
  return [
    { title: OG_TITLE },
    {
      property: "og:title",
      content: OG_TITLE,
    },
    {
      name: "description",
      content: OG_DESCRIPTION,
    },
    {
      property: "og:description",
      content: OG_DESCRIPTION,
    },
    {
      property: "og:url",
      content: CANONICAL_URL,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:image",
      content: OG_IMAGE_URL,
    },
    {
      property: "og:image:width",
      content: "2400",
    },
    {
      property: "og:image:height",
      content: "1260",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      property: "twitter:domain",
      content: "readr-media.github.io",
    },
    {
      property: "twitter:url",
      content: CANONICAL_URL,
    },
    {
      name: "twitter:title",
      content: OG_TITLE,
    },
    {
      name: "twitter:description",
      content: OG_DESCRIPTION,
    },
    {
      name: "twitter:image",
      content: OG_IMAGE_URL,
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

type UpdateStatusItem = {
  date?: string;
  author?: string;
  text: string;
};

type UpdateStatusData = {
  updates?: UpdateStatusItem[];
};

export default function Home() {
  const [updateStatusIndex, setUpdateStatusIndex] = useState(0);
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
  const { data: updateStatusData } = useQuery({
    queryKey: ["home-update-status"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.BASE_URL}data/update-status.json`
      );
      if (!response.ok) {
        throw new Error("Failed to load update status");
      }
      return (await response.json()) as UpdateStatusData;
    },
  });

  const latestBudgetYear = budgetYearData?.budgetYears?.[0] ?? null;
  const latestBudgetYearValue = latestBudgetYear?.year ?? null;
  const latestBudgetLink = latestBudgetYearValue
    ? `/all-budgets?year=${latestBudgetYearValue}`
    : "/all-budgets";
  const progressStage = latestBudgetYear?.budgetProgress as
    | BudgetProgressStage
    | null
    | undefined;
  const progressPercentage = calculateProgressPercentage(progressStage);
  const progressText = formatProgressText(
    latestBudgetYear?.year ?? null,
    latestBudgetYear?.dataProgress ?? null
  );
  const unfreezeProgressDisplay = getUnfreezeProgressDisplay(
    latestBudgetYear?.year ?? null,
    latestBudgetYear?.unfreezeProgress ?? null
  );

  const latestProgressBadge: ProgressBadgeProps = {
    label: "最新審議進度",
    description: progressText,
    percentage: progressPercentage,
    color: "pink",
  };

  const unfreezeProgressBadge: ProgressBadgeProps = {
    label: "解凍進度",
    description: unfreezeProgressDisplay.text,
    percentage: unfreezeProgressDisplay.percentage,
    color: "blue",
  };

  const progressBadges: ProgressBadgeProps[] = [
    latestProgressBadge,
    unfreezeProgressBadge,
  ];
  const updateStatuses = updateStatusData?.updates ?? [];
  const currentUpdateStatus = updateStatuses[updateStatusIndex] ?? null;
  const canShowPreviousUpdate = updateStatusIndex > 0;
  const canShowNextUpdate = updateStatusIndex < updateStatuses.length - 1;

  useEffect(() => {
    if (
      updateStatuses.length > 0 &&
      updateStatusIndex >= updateStatuses.length
    ) {
      setUpdateStatusIndex(0);
    }
  }, [updateStatusIndex, updateStatuses.length]);

  const renderStatusBoxes = (
    boxes: { key: string; text: string; className: string }[]
  ) => (
    <div className="max-w-banner -mt-1 flex w-full flex-col gap-3">
      {boxes.map((box) => (
        <div
          key={box.key}
          className={`flex w-full items-center justify-center rounded-lg p-2 text-center text-sm font-medium ${box.className}`}
        >
          {box.text}
        </div>
      ))}
    </div>
  );

  const loadingBoxes = renderStatusBoxes([
    {
      key: "progress-loading",
      text: "載入審議進度中...",
      className: "min-h-[60px] bg-gray-300 text-gray-600",
    },
    {
      key: "unfreeze-loading",
      text: "載入解凍進度中...",
      className: "min-h-[48px] bg-gray-300 text-gray-600",
    },
  ]);

  const errorBoxes = renderStatusBoxes([
    {
      key: "progress-error",
      text: "審議進度載入失敗，請稍後再試",
      className: "min-h-[60px] bg-red-100 text-red-600",
    },
    {
      key: "unfreeze-error",
      text: "解凍進度載入失敗，請稍後再試",
      className: "min-h-[48px] bg-red-100 text-red-600",
    },
  ]);

  const emptyBoxes = renderStatusBoxes([
    {
      key: "progress-empty",
      text: "暫無審議進度資料",
      className: "min-h-[60px] bg-gray-300 text-gray-600",
    },
    {
      key: "unfreeze-empty",
      text: "暫無解凍進度資料",
      className: "min-h-[48px] bg-gray-300 text-gray-600",
    },
  ]);

  const renderProgressBadges = () => {
    if (isLoading) return loadingBoxes;
    if (isError) return errorBoxes;
    if (!latestBudgetYear) return emptyBoxes;
    return (
      <div className="max-w-banner -mt-1 w-full">
        <div className="hidden flex-col gap-3 md:flex">
          {progressBadges.map((badge) => (
            <ProgressBadge key={badge.label} {...badge} />
          ))}
        </div>
        <div className="flex w-full justify-center md:hidden">
          <ProgressBadgeMobile
            headerLabel={progressBadges[0].label}
            headerColor="blue"
            badges={progressBadges}
          />
        </div>
      </div>
    );
  };

  const navigationButtons: NavigationButton[] = [
    { label: "歷年預算", href: "/all-budgets" },
    { label: "最新年度預算", href: latestBudgetLink },
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
            {renderProgressBadges()}
          </div>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。還可透過視覺化方式瀏覽，一目暸然。除了已數位化的資料，此平台也透過群眾協力（crowdsourcing）辨識提案掃描檔，歡迎至協作區加入合作行列。
          </p>
        </header>

        {currentUpdateStatus && (
          <section
            className="mx-auto mb-8 max-w-2xl border-2 border-black bg-white p-4 text-left"
            aria-labelledby="update-status-title"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2
                  id="update-status-title"
                  className="text-base font-bold text-black"
                >
                  更新狀況
                </h2>
                {currentUpdateStatus.date && (
                  <time className="text-sm text-gray-500">
                    {currentUpdateStatus.date}
                  </time>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setUpdateStatusIndex((current) => Math.max(current - 1, 0))
                  }
                  disabled={!canShowPreviousUpdate}
                  className="flex size-8 items-center justify-center border-2 border-black bg-white text-lg font-bold disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                  aria-label="上一則更新"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setUpdateStatusIndex((current) =>
                      Math.min(current + 1, updateStatuses.length - 1)
                    )
                  }
                  disabled={!canShowNextUpdate}
                  className="flex size-8 items-center justify-center border-2 border-black bg-white text-lg font-bold disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                  aria-label="下一則更新"
                >
                  →
                </button>
              </div>
            </div>
            <div
              className="h-20 touch-pan-y overflow-y-scroll overscroll-contain pr-2 md:h-24"
              style={{ WebkitOverflowScrolling: "touch" }}
              tabIndex={0}
              aria-label="更新狀況內容"
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700 md:text-base">
                {currentUpdateStatus.text}
              </p>
            </div>
            {currentUpdateStatus.author && (
              <p className="mt-3 text-right text-xs font-medium text-gray-500">
                By {currentUpdateStatus.author}
              </p>
            )}
          </section>
        )}

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
