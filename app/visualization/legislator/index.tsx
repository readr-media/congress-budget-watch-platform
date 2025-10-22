import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { sumBy, filter } from "lodash";
import SessionChart from "./session-chart";
import BudgetTypeLegend from "~/components/budget-type-legend";
import { BUDGET_TYPE_LEGEND_ITEMS } from "~/constants/legends";
import {
  GET_PAGINATED_PROPOSALS_QUERY,
  proposalQueryKeys,
} from "~/queries/proposal.queries";
import { execute } from "~/graphql/execute";
import { OrderDirection, type ProposalWhereInput } from "~/graphql/graphql";
import { transformToGroupedSessionData } from "../helpers";
import {
  GET_PERSON_BY_ID_QUERY,
  peopleQueryKeys,
} from "~/queries/people.queries";
import { formatTermRange } from "~/utils/format";

const VisualizationLegislator = () => {
  const { id: proposerId } = useParams();
  const [selectedType, setSelectedType] = useState<
    "proposal" | "proposal-cosign"
  >("proposal");
  const [mode, setMode] = useState<"amount" | "count">("amount");

  const whereFilter = useMemo((): ProposalWhereInput => {
    return {
      AND: [
        {
          proposers: {
            some: {
              id: {
                equals: proposerId,
              },
            },
          },
        },
      ],
    };
  }, [proposerId]);

  const {
    data: proposalsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: proposalQueryKeys.list({ whereFilter }),
    queryFn: () =>
      execute(GET_PAGINATED_PROPOSALS_QUERY, {
        skip: 0,
        take: 1000, // Assuming we want to fetch all proposals for this view
        orderBy: [{ id: OrderDirection.Desc }],
        where: whereFilter,
      }),
  });
  console.log("proposalsData", proposalsData);
  // 轉換資料供 SessionChart 使用
  const sessionData = useMemo(() => {
    if (!proposalsData) return [];
    return transformToGroupedSessionData(proposalsData, mode);
  }, [proposalsData, mode]);

  const {
    data: peopleData,
    isLoading: isPeopleLoading,
    isError: isPeopleError,
  } = useQuery({
    queryKey: peopleQueryKeys.detail(proposerId ?? ""),
    queryFn: () =>
      execute(GET_PERSON_BY_ID_QUERY, {
        where: { id: proposerId },
      }),
    enabled: !!proposerId,
  });

  const yearToCommitteeMap = useMemo(() => {
    if (!peopleData?.people?.committees) return new Map<string, string>();

    const map = new Map<string, string>();
    peopleData.people.committees.forEach((committee) => {
      if (committee.term?.startDate) {
        // Assuming the term start year corresponds to the budget year.
        // This logic might need adjustment based on fiscal year definitions.
        const year = new Date(committee.term.startDate).getFullYear();
        // Convert ROC year if necessary, e.g., year - 1911 for Minguo calendar.
        // For simplicity, using Gregorian year directly.
        // Example: 2024 -> "113年度"
        const budgetYear = year - 1911 + 1;
        map.set(`${budgetYear}年度`, committee.name ?? "委員會");
      }
    });
    return map;
  }, [peopleData]);

  const termRange = useMemo(() => {
    if (!peopleData?.people?.committees) return { first: null, last: null };
    const termNumbers = peopleData.people.committees
      .map((c) => c.term?.termNumber)
      .filter((t): t is number => t !== null && t !== undefined);
    if (termNumbers.length === 0) return { first: null, last: null };

    const uniqueSortedTerms = [...new Set(termNumbers)].sort((a, b) => a - b);
    return {
      first: uniqueSortedTerms[0],
      last: uniqueSortedTerms[uniqueSortedTerms.length - 1],
    };
  }, [peopleData]);

  if (isLoading || isPeopleLoading) {
    return <div>Loading...</div>;
  }

  if (isError || isPeopleError) {
    return <div>Error fetching data</div>;
  }

  const person = peopleData?.people;
  const proposals = proposalsData?.proposals || [];
  const totalReductionAmount = sumBy(proposals, (p) => p.reductionAmount || 0);
  const totalFreezeAmount = sumBy(proposals, (p) => p.freezeAmount || 0);
  const reductionProposalsCount = filter(
    proposals,
    (p) => p.reductionAmount
  ).length;
  const freezeProposalsCount = filter(proposals, (p) => p.freezeAmount).length;
  const mainResolutionCount = filter(proposals, (p) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p.proposalTypes?.includes("other" as any)
  ).length;

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-3 md:mx-auto md:max-w-[800px]">
        <Link to="/visualization">{"<"} 回到視覺化主頁</Link>
        <div className="mt-4 flex flex-col items-center justify-center gap-y-2">
          <p>{person?.name}</p>
          <p>{person?.party?.name}</p>
          <p>第{formatTermRange(termRange)}屆立法委員</p>
        </div>
        {/* buttons for selected type */}
        <div className="mt-6 flex items-center gap-x-4">
          <button
            className={`rounded border-2 border-black px-2.5 ${
              selectedType === "proposal" ? "bg-[#3E51FF] text-white" : ""
            }`}
            onClick={() => setSelectedType("proposal")}
          >
            提案
          </button>
          <button
            className={`rounded border-2 border-black px-2.5 ${
              selectedType === "proposal-cosign"
                ? "bg-[#3E51FF] text-white"
                : ""
            }`}
            onClick={() => setSelectedType("proposal-cosign")}
          >
            提案＋連署
          </button>
        </div>
        {/* radio buttons for sort by */}
        <div>
          <div className="flex flex-col items-center justify-center gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="amount"
                checked={mode === "amount"}
                onChange={() => setMode("amount")}
                className="h-4 w-4 accent-[#3E51FF]"
              />
              <span>依金額（刪減/凍結）</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="count"
                checked={mode === "count"}
                onChange={() => setMode("count")}
                className="h-4 w-4 accent-[#3E51FF]"
              />
              <span>依數量（凍結案/刪減案/建議案）</span>
            </label>
          </div>
        </div>
        {/* statistics */}
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 p-2.5">
          <p>
            總共刪減
            <span className="text-[#E9808E]">
              {totalReductionAmount.toLocaleString()}
            </span>
            元（
            <span className="text-[#E9808E]">{reductionProposalsCount}</span>
            個提案）
          </p>
          <p>
            凍結
            <span className="text-[#E9808E]">
              {totalFreezeAmount.toLocaleString()}
            </span>
            元（
            <span className="text-[#E9808E]">{freezeProposalsCount}</span>
            個提案）
          </p>
          <p>
            主決議提案數：
            <span className="text-[#E9808E]">{mainResolutionCount}</span>個
          </p>
        </div>
        <div className="mt-6">
          <BudgetTypeLegend items={BUDGET_TYPE_LEGEND_ITEMS} />
        </div>
        {/* session chart */}
        <SessionChart
          data={sessionData}
          yearToCommitteeMap={yearToCommitteeMap}
        />
      </div>
    </div>
  );
};

export default VisualizationLegislator;
