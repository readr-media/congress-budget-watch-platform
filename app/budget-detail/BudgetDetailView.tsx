import { NavLink } from "react-router";
import { Timeline } from "../components/timeline/Timeline";
import Image from "~/components/image";
import { VoteButtons } from "~/components/VoteButtons";
import { formatNumber } from "./helpers";
import type { Proposal } from "~/graphql/graphql";
import type { TimelineItem, MergedProposalInfo } from "./helpers";

interface BudgetDetailViewProps {
  isDesktop: boolean;
  proposal: Proposal;
  timelineData: TimelineItem[];
  mergedProposalsData: MergedProposalInfo[];
  hasMerged: boolean;
  hasImage: boolean;
  proposerName: string;
  cosignersText: string;
  proposalType: string;
  resultText: string;
  parentProposalId?: string | null;
  hasHistoricalProposals: boolean;
  budgetCategoryDisplay: string;
  projectDescriptionDisplay: string;
  lastYearSettlementDisplay: string;
  lastYearLegalBudgetDisplay: string;
  lastYearComparisonDisplay: string;
  showLastYearSection: boolean;
  shouldShowBudgetInfo: boolean;
  proposalKey: string;
}

const BudgetDetailView = ({
  isDesktop,
  proposal,
  timelineData,
  mergedProposalsData,
  hasMerged,
  hasImage,
  proposerName,
  cosignersText,
  proposalType,
  resultText,
  parentProposalId,
  hasHistoricalProposals,
  budgetCategoryDisplay,
  projectDescriptionDisplay,
  lastYearSettlementDisplay,
  lastYearLegalBudgetDisplay,
  lastYearComparisonDisplay,
  showLastYearSection,
  shouldShowBudgetInfo,
  proposalKey,
}: BudgetDetailViewProps) => {
  const renderResultStatus = (
    fallbackClassName: string,
    navLinkClassName: string,
    wrapperClassName = "flex"
  ) => {
    if (!hasHistoricalProposals && !parentProposalId) {
      return <p className={fallbackClassName}>{resultText}</p>;
    }

    if (parentProposalId)
      return (
        <p className={wrapperClassName}>
          請至
          <NavLink
            to={`/budget/${parentProposalId}`}
            className={navLinkClassName}
          >
            主提案單
          </NavLink>
          確認結果
        </p>
      );
    return <p className={wrapperClassName}>請至主提案單確認結果</p>;
  };

  if (isDesktop)
    return (
      <div className="pb-8 text-sm">
        <div className="mx-2.5 flex flex-col md:mx-8">
          <NavLink to="/all-budgets" className="underline">
            {"<回到列表頁"}
          </NavLink>
          <div className="relative mt-6">
            <div className="absolute h-full w-full translate-x-3 -translate-y-3 rounded-lg border-2 bg-neutral-200" />
            <div className="bg-surface-base relative flex flex-col rounded-lg border-2 p-5 pb-30">
              <div className="mb-4 flex gap-5 border-b-2 p-3 text-xl font-bold">
                <p>編號</p>
                <p className="text-budget-warning">{proposal.id}</p>
              </div>
              <div className="flex flex-col gap-y-10">
                {/* row 1 */}
                <section className="flex">
                  <div>
                    <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                      分類
                    </p>
                    <p className="flex w-fit border-t pt-4 md:pr-8 lg:pr-12">
                      {proposal.government?.category || "分類"}
                    </p>
                  </div>
                  <div>
                    <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                      部會
                    </p>
                    <p className="flex w-fit border-t pt-4 md:pr-8 lg:pr-12">
                      {proposal.government?.name || "部會名稱"}
                    </p>
                  </div>
                  <div>
                    <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                      提案人（連署）
                    </p>
                    <p className="flex w-fit border-t pt-4 md:pr-18 lg:pr-32">
                      {proposerName}
                      <br />（{cosignersText}）
                    </p>
                  </div>
                  <div>
                    <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                      提案
                    </p>
                    <p className="flex w-fit border-t pt-4 md:pr-12">
                      {proposalType}
                    </p>
                  </div>
                  <div className="grow">
                    <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                      審議結果
                    </p>
                    {renderResultStatus(
                      "flex border-t pt-4 pr-12 ",
                      "text-brand-primary flex underline",
                      "flex pt-4 border-t"
                    )}
                  </div>
                </section>
                {/* row 2 */}
                <section className="flex">
                  <div className="min-w-fit">
                    <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                      審議階段
                    </p>
                    <div className="flex w-fit border-t pt-4 pr-13 md:pr-24">
                      {timelineData.length > 0 ? (
                        <Timeline items={timelineData} />
                      ) : (
                        <p className="text-gray-500">暫無審議資料</p>
                      )}
                    </div>
                  </div>
                  <div className="grow">
                    <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                      是否併案
                    </p>
                    <div className="flex flex-col gap-y-4 border-t pt-4">
                      <p>{hasMerged ? "是" : "否"}</p>
                      {hasMerged && mergedProposalsData.length > 0 && (
                        <div className="grid-rows-auto grid grid-cols-3 gap-4.5">
                          {mergedProposalsData.map((merged) => (
                            <NavLink
                              key={merged.id}
                              to={`/budget/${merged.id}`}
                              className="hover:text-brand-primary flex gap-x-2 text-neutral-500"
                            >
                              <div
                                className={`mt-2 flex items-center justify-center rounded-full ${
                                  merged.isParent
                                    ? "bg-brand-primary size-5 min-w-5"
                                    : "size-2 bg-black"
                                }`}
                              >
                                <span
                                  className={`${merged.isParent ? "text-white" : "hidden"}`}
                                >
                                  主
                                </span>
                              </div>
                              <div>
                                <p className="underline">{merged.date}</p>
                                <p>{merged.proposers}</p>
                              </div>
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                {/* row 3 */}
                <section className="flex">
                  <div className="grow">
                    <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                      提案內容
                    </p>
                    <div className="flex flex-col gap-y-4 border-t pt-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {proposal.reason ||
                          proposal.description ||
                          "無提案內容"}
                      </p>
                    </div>
                  </div>
                </section>
                {/* row 4 without image */}
                {!hasImage && (
                  <section className="flex">
                    <div>
                      <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                        預算金額
                      </p>
                      <p className="text-brand-accent flex w-fit border-t border-black pt-4 pr-32 font-bold">
                        {formatNumber(proposal.budget?.budgetAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                        減列金額
                      </p>
                      <p className="text-brand-accent flex w-fit border-t border-black pt-4 pr-[136px] font-bold">
                        {formatNumber(proposal.reductionAmount)}
                      </p>
                    </div>
                    <div className="grow">
                      <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                        凍結金額
                      </p>
                      <p className="text-brand-accent flex border-t border-black pt-4 font-bold">
                        {formatNumber(proposal.freezeAmount)}
                      </p>
                    </div>
                  </section>
                )}
                {/* row 4 with image */}
                {hasImage && (
                  <section className="flex">
                    <div id="left" className="flex w-6/11 flex-col">
                      <div className="flex">
                        <div>
                          <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                            預算金額
                          </p>
                          <p className="text-brand-accent flex w-fit border-t border-black pt-4 font-bold md:pr-8 lg:pr-16 xl:pr-32">
                            {formatNumber(proposal.budget?.budgetAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                            減列金額
                          </p>
                          <p className="text-brand-accent flex w-fit border-t border-black pt-4 font-bold md:pr-8 lg:pr-24 xl:pr-32">
                            {formatNumber(proposal.reductionAmount)}
                          </p>
                        </div>
                        <div className="grow">
                          <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                            凍結金額
                          </p>
                          <p className="text-brand-accent flex border-t border-black pt-4 pr-[93px] font-bold">
                            {formatNumber(proposal.freezeAmount)}
                          </p>
                        </div>
                      </div>
                      {shouldShowBudgetInfo && (
                        <div className="mt-9 flex max-w-5/6 flex-col gap-y-9">
                          <div className="grow">
                            <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                              科目/計畫
                            </p>
                            <p className="flex border-t border-black pt-4 pr-9">
                              {budgetCategoryDisplay}
                            </p>
                          </div>
                          <div>
                            <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                              計畫說明
                            </p>
                            <p className="flex border-t border-black pt-4 whitespace-pre-wrap">
                              {projectDescriptionDisplay}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {hasImage && (
                      <div id="right" className="w-5/11">
                        <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                          提案單圖檔
                        </p>
                        <div className="flex border-t border-black pt-4 font-bold">
                          <Image
                            src={
                              proposal.budgetImageUrl ||
                              "/icon/default-image.svg"
                            }
                            alt="proposal-image"
                            className="w-full shadow-md"
                          />
                        </div>
                      </div>
                    )}
                  </section>
                )}
                {/* row 5 without image */}
                {!hasImage && shouldShowBudgetInfo && (
                  <section className="flex">
                    <div className="grow">
                      <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                        科目/計畫
                      </p>
                      <p className="flex border-t border-black pt-4 pr-9">
                        {budgetCategoryDisplay}
                      </p>
                    </div>

                    <div className="w-[478px] max-w-[478px]">
                      <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                        計畫說明
                      </p>
                      <p className="flex border-t border-black pt-4 whitespace-pre-wrap">
                        {projectDescriptionDisplay}
                      </p>
                    </div>
                  </section>
                )}
                {/* row 6 */}
                {showLastYearSection && (
                  <section className="flex">
                    <div>
                      <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                        上年度決算
                      </p>
                      <p className="flex w-fit border-t border-black pt-4 pr-[136px] font-bold">
                        {lastYearSettlementDisplay}
                      </p>
                    </div>
                    <div>
                      <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                        上年度法定預算
                      </p>
                      <p className="flex w-fit border-t border-black pt-4 pr-[136px] font-bold">
                        {lastYearLegalBudgetDisplay}
                      </p>
                    </div>
                    <div className="grow">
                      <p className="bg-brand-accent w-fit rounded-t-lg border-2 border-black px-2.5 py-1 text-white">
                        與上年度比較
                      </p>
                      <p className="text-brand-primary flex border-t border-black pt-4 font-bold">
                        {lastYearComparisonDisplay}
                      </p>
                    </div>
                  </section>
                )}
                {/* row 7 */}
                <section className="mt-25 flex justify-center gap-x-10">
                  <VoteButtons key={proposalKey} proposal={proposal} />
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <>
      <div className="mx-2.5 mb-4 flex flex-col">
        <NavLink to="/all-budgets" className="underline">
          {"<" + "回到列表頁"}
        </NavLink>
        <div className="mt-2 border-2 px-2 py-3">
          <section className="border-neutral-250 flex gap-6 border-b pb-2">
            <p>編號</p>
            <p className="text-budget-warning">{proposal.id}</p>
          </section>
          <section className="border-neutral-250 mt-3 flex gap-10 border-b pb-4">
            <div className="flex flex-col gap-y-4 font-bold">
              <p>分類</p>
              <p>{proposal.government?.category || "暫無分類"}</p>
            </div>
            <div className="flex flex-col gap-y-4 font-bold">
              <p>部會</p>
              <p>{proposal.government?.name || "部會"}</p>
            </div>
          </section>
          <section>
            <p className="mt-3 text-lg font-bold">審議階段</p>
            <div>
              {timelineData.length > 0 ? (
                <Timeline items={timelineData} />
              ) : (
                <p className="text-gray-500">暫無審議資料</p>
              )}
            </div>
          </section>
          <div className="mt-3 flex flex-col gap-y-3">
            <p className="font-bold">是否併案</p>
            <p>{hasMerged ? "是" : "否"}</p>
          </div>
          <ul className="timeline timeline-vertical timeline-compact text-neutral-500">
            {mergedProposalsData.map((merged) => (
              <li key={merged.id}>
                <div className="timeline-middle">
                  {merged.isParent ? (
                    <div className="bg-brand-primary flex size-5 items-center justify-center rounded-full text-xs text-white">
                      主
                    </div>
                  ) : (
                    <div className="size-2 rounded-full bg-black" />
                  )}
                </div>
                <NavLink
                  to={`/budget/${merged.id}`}
                  className="timeline-end hover:text-brand-primary rounded-xl bg-transparent px-6 text-neutral-500"
                >
                  <p>{merged.date}</p>
                  <p>{merged.proposers}</p>
                </NavLink>
              </li>
            ))}
          </ul>
          {/* divider */}
          <div className="my-4 h-px w-full bg-gray-300" />
          <div className="flex flex-col gap-y-3">
            <p className="font-bold">提案人（連署）</p>
            <section>
              <p>{proposerName}</p>
              <p>（{cosignersText}）</p>
            </section>
          </div>
          {/* divider */}
          <div className="my-4 h-px w-full bg-gray-300" />
          <div className="flex justify-between">
            <section className="flex gap-x-12">
              <section className="flex-col">
                <p className="font-bold">提案</p>
                <p>{proposalType}</p>
              </section>
              <section className="flex-col">
                <p className="font-bold">審議結果</p>
                {renderResultStatus(
                  "flex pt-4 pr-12",
                  "text-brand-primary flex underline"
                )}
              </section>
            </section>
            {/* fake link */}
            <a href="#" className="underline" target="_blank">
              資料來源
            </a>
          </div>
          {/* divider */}
          <div className="my-4 h-px w-full bg-gray-300" />
          <div>
            <p className="mb-4 font-bold">提案內容</p>
            <p className="whitespace-pre-wrap">
              {proposal.reason || proposal.description || "無提案內容"}
            </p>
          </div>
          {/* divider */}
          <div className="my-4 h-px w-full bg-gray-300" />
          <div className="flex gap-x-10">
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">預算金額</p>
              <p className="text-budget-warning">
                {formatNumber(proposal.budget?.budgetAmount)}
              </p>
            </section>
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">減列金額</p>
              <p className="text-budget-warning">
                {formatNumber(proposal.reductionAmount)}
              </p>
            </section>
          </div>
          <div className="my-4 h-px w-full bg-gray-300" />
          <div className="flex gap-x-10">
            <section className="flex flex-col gap-y-4">
              <p className="font-bold">凍結金額</p>
              <p className="text-budget-warning">
                {formatNumber(proposal.freezeAmount)}
              </p>
            </section>
          </div>
          {hasImage && <div className="my-4 h-px w-full bg-gray-300" />}
          <div className="flex gap-x-10">
            {hasImage && (
              <section className="flex flex-col gap-y-4 px-3.5">
                <p className="font-bold">預算書圖檔</p>
                <Image
                  src={proposal.budgetImageUrl ?? ""}
                  alt="proposal-image"
                  className="w-full shadow-md"
                />
              </section>
            )}
          </div>
          {shouldShowBudgetInfo && (
            <>
              <div className="my-4 h-px w-full bg-gray-300" />
              <div className="flex flex-col gap-y-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-x-2">
                    <p className="font-bold">科目/計畫</p>
                    <button>
                      <Image
                        src="/icon/explain-term.svg"
                        alt="explain-term"
                        className="size-5"
                      />
                    </button>
                  </div>
                  <a
                    href="#"
                    className="text-brand-primary underline"
                    target="_blank"
                  >
                    預算書連結
                  </a>
                </div>
                <p>{budgetCategoryDisplay}</p>
                <div className="flex items-center gap-x-2">
                  <p className="font-bold">計畫說明</p>
                  <button>
                    <Image
                      src="/icon/explain-term.svg"
                      alt="explain-term"
                      className="size-5"
                    />
                  </button>
                </div>
                <p className="whitespace-pre-wrap">
                  {projectDescriptionDisplay}
                </p>
              </div>
              {/* divider */}
              <div className="my-4 h-px w-full bg-gray-300" />
              <div className="flex">
                <div className="flex flex-col gap-y-4">
                  <p className="font-bold">上年度決算</p>
                  <p>{lastYearSettlementDisplay}</p>
                </div>
                <div className="flex flex-col gap-y-4">
                  <p className="font-bold">上年度法定預算</p>
                  <p>{lastYearLegalBudgetDisplay}</p>
                </div>
                <div className="flex flex-col gap-y-4">
                  <p className="font-bold">與上年度比較</p>
                  <p>{lastYearComparisonDisplay}</p>
                </div>
              </div>
            </>
          )}
          <section className="gird-rows-auto mt-11 grid items-center justify-items-center gap-10">
            <VoteButtons key={proposalKey} proposal={proposal} />
          </section>
        </div>
      </div>
    </>
  );
};

export default BudgetDetailView;
