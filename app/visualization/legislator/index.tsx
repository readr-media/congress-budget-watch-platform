import { useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { sumBy, filter } from "lodash";
import SessionChart from "./session-chart";
import BudgetTypeLegend from "~/components/budget-type-legend";
import { BUDGET_TYPE_LEGEND_ITEMS } from "~/constants/legends";
import {
  GET_VISUALIZATION_PROPOSALS_QUERY,
  proposalQueryKeys,
} from "~/queries";
import { execute } from "~/graphql/execute";
import {
  OrderDirection,
  ProposalProposalTypeType,
  type ProposalWhereInput,
} from "~/graphql/graphql";
import {
  transformToGroupedSessionData,
  formatAmountWithUnit,
  mapVisualizationProposals,
  type NodeDatum,
} from "../helpers";
import {
  GET_PERSON_BY_ID_QUERY,
  peopleQueryKeys,
} from "~/queries/people.queries";
import { formatTermRange } from "~/utils/format";
import VisualizationLegislatorSkeleton from "~/components/skeleton/visualization-legislator-skeleton";
import { useMediaQuery } from "usehooks-ts";

type ProposalKind = "proposal" | "proposal-cosign";
type VisualizationModeType = "amount" | "count";

type TermRange = {
  first: number | null;
  last: number | null;
};

type SummaryStats = {
  formattedReductionAmount: string;
  formattedFreezeAmount: string;
  reductionProposalsCount: number;
  freezeProposalsCount: number;
  mainResolutionCount: number;
};

type Committee = {
  name?: string | null;
  term?: {
    startDate?: string | null;
    termNumber?: number | null;
  } | null;
};

const buildWhereFilter = (
  selectedType: ProposalKind,
  proposerId: string | undefined
): ProposalWhereInput => {
  if (selectedType === "proposal-cosign") {
    return {
      OR: [
        {
          proposers: {
            some: {
              id: { equals: proposerId },
            },
          },
        },
        {
          coSigners: {
            some: {
              id: { equals: proposerId },
            },
          },
        },
      ],
    };
  }

  return {
    proposers: {
      some: {
        id: { equals: proposerId },
      },
    },
  };
};

const deriveYearToCommitteeMap = (committees?: Committee[] | null) => {
  if (!committees) return new Map<string, string>();

  const map = new Map<string, string>();
  committees.forEach((committee) => {
    if (committee.term?.startDate) {
      const year = new Date(committee.term.startDate).getFullYear();
      const budgetYear = year - 1911 + 1;
      map.set(`${budgetYear}年度`, committee.name ?? "委員會");
    }
  });
  return map;
};

const deriveTermRange = (committees?: Committee[] | null): TermRange => {
  if (!committees) return { first: null, last: null };

  const termNumbers = committees
    .map((c) => c.term?.termNumber)
    .filter((t): t is number => t !== null && t !== undefined);

  if (termNumbers.length === 0) return { first: null, last: null };

  const uniqueSortedTerms = [...new Set(termNumbers)].sort((a, b) => a - b);
  return {
    first: uniqueSortedTerms[0],
    last: uniqueSortedTerms[uniqueSortedTerms.length - 1],
  };
};

const computeSummaryStats = (
  proposals: ReturnType<typeof mapVisualizationProposals>
): SummaryStats => {
  const totalReductionAmount = sumBy(proposals, (p) => p.reductionAmount || 0);
  const totalFreezeAmount = sumBy(proposals, (p) => p.freezeAmount || 0);

  const reductionProposalsCount = filter(
    proposals,
    (p) => p.reductionAmount
  ).length;
  const freezeProposalsCount = filter(proposals, (p) => p.freezeAmount).length;
  const mainResolutionCount = filter(proposals, (p) =>
    p.proposalTypes?.includes(ProposalProposalTypeType.Other)
  ).length;

  return {
    formattedReductionAmount: formatAmountWithUnit(totalReductionAmount),
    formattedFreezeAmount: formatAmountWithUnit(totalFreezeAmount),
    reductionProposalsCount,
    freezeProposalsCount,
    mainResolutionCount,
  };
};

type HeaderProps = {
  personName?: string | null;
  partyName?: string | null;
  termRange: TermRange;
};

const LegislatorHeader = ({
  personName,
  partyName,
  termRange,
}: HeaderProps) => (
  <div className="mt-4 flex flex-col items-center justify-center gap-y-2">
    <p>{personName}</p>
    <p>{partyName}</p>
    <p>第{formatTermRange(termRange)}屆立法委員</p>
  </div>
);

type TypeToggleProps = {
  selectedType: ProposalKind;
  onChange: (type: ProposalKind) => void;
};

type ModeSelectorProps = {
  mode: VisualizationModeType;
  onChange: (mode: VisualizationModeType) => void;
};

const ProposalTypeToggle = ({ selectedType, onChange }: TypeToggleProps) => (
  <div className="mt-6 flex items-center gap-x-4">
    <button
      className={`rounded border-2 border-black px-2.5 ${
        selectedType === "proposal" ? "bg-brand-primary text-white" : ""
      }`}
      onClick={() => onChange("proposal")}
    >
      提案
    </button>
    <button
      className={`rounded border-2 border-black px-2.5 ${
        selectedType === "proposal-cosign" ? "bg-brand-primary text-white" : ""
      }`}
      onClick={() => onChange("proposal-cosign")}
    >
      提案＋連署
    </button>
  </div>
);

const ModeSelector = ({ mode, onChange }: ModeSelectorProps) => (
  <div>
    <div className="flex flex-col items-center justify-center gap-4">
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name="viz-mode"
          value="amount"
          checked={mode === "amount"}
          onChange={() => onChange("amount")}
          className="accent-brand-primary h-4 w-4"
        />
        <span>依金額（刪減/凍結）</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name="viz-mode"
          value="count"
          checked={mode === "count"}
          onChange={() => onChange("count")}
          className="accent-brand-primary h-4 w-4"
        />
        <span>依數量（凍結案/刪減案/建議案）</span>
      </label>
    </div>
  </div>
);

const SummaryPanel = ({ summary }: { summary: SummaryStats }) => (
  <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 p-2.5">
    <p>
      總共刪減
      <span className="text-brand-accent">
        {summary.formattedReductionAmount}
      </span>
      （
      <span className="text-brand-accent">
        {summary.reductionProposalsCount}
      </span>
      個提案）
    </p>
    <p>
      凍結
      <span className="text-brand-accent">{summary.formattedFreezeAmount}</span>
      （
      <span className="text-brand-accent">{summary.freezeProposalsCount}</span>
      個提案）
    </p>
    <p>
      主決議提案數：
      <span className="text-brand-accent">{summary.mainResolutionCount}</span>個
    </p>
  </div>
);

const VisualizationLegislator = () => {
  const { id: proposerId } = useParams();
  const [selectedType, setSelectedType] = useState<ProposalKind>("proposal");
  const [mode, setMode] = useState<VisualizationModeType>("amount");

  const whereFilter = useMemo(
    () => buildWhereFilter(selectedType, proposerId),
    [selectedType, proposerId]
  );

  const {
    data: proposalsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: proposalQueryKeys.list({ whereFilter }),
    queryFn: () =>
      execute(GET_VISUALIZATION_PROPOSALS_QUERY, {
        skip: 0,
        take: 1000, // Assuming we want to fetch all proposals for this view
        orderBy: [{ id: OrderDirection.Desc }],
        where: whereFilter,
      }),
  });
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

  const committees = peopleData?.people?.committees;

  const yearToCommitteeMap = useMemo(
    () => deriveYearToCommitteeMap(committees),
    [committees]
  );

  const termRange = useMemo(() => deriveTermRange(committees), [committees]);

  const person = peopleData?.people;
  const proposals = mapVisualizationProposals(proposalsData);
  const summary = useMemo(() => computeSummaryStats(proposals), [proposals]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  const handleNodeClick = useCallback(
    (node: NodeDatum) => {
      if (!node.children?.length && node.id) {
        navigate(`/budget/${node.id}`);
        return true;
      }
      return false;
    },
    [navigate]
  );

  if (isLoading || isPeopleLoading) {
    return <VisualizationLegislatorSkeleton isDesktop={isDesktop} />;
  }

  if (isError || isPeopleError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <div className="md:max-w-visualization-body flex flex-col items-center justify-center px-3 md:mx-auto">
        <Link to="/visualization">{"<"} 回到視覺化主頁</Link>
        <LegislatorHeader
          personName={person?.name}
          partyName={person?.party?.name}
          termRange={termRange}
        />
        <ProposalTypeToggle
          selectedType={selectedType}
          onChange={setSelectedType}
        />
        <ModeSelector mode={mode} onChange={setMode} />
        <SummaryPanel summary={summary} />
        <div className="mt-6">
          <BudgetTypeLegend items={BUDGET_TYPE_LEGEND_ITEMS} />
        </div>
        {/* session chart */}
        <SessionChart
          data={sessionData}
          yearToCommitteeMap={yearToCommitteeMap}
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
};

export default VisualizationLegislator;
