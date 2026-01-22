import { useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { sumBy, filter } from "lodash";
import SessionChart, { type YearCommitteeInfo } from "./session-chart";
import BudgetTypeLegend from "~/components/budget-type-legend";
import { BUDGET_TYPE_LEGEND_ITEMS } from "~/constants/legends";
import SummaryPanel, {
  type SummaryPanelSummary,
} from "../components/SummaryPanel";
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
  PASSED_PROPOSAL_RESULTS,
  type NodeDatum,
} from "../helpers";
import { YEAR_OPTIONS } from "~/constants/options";
import {
  GET_PERSON_BY_ID_QUERY,
  peopleQueryKeys,
} from "~/queries/people.queries";
import { BUDGET_BY_LEGISLATOR_URL } from "~/config/budget-endpoints";
import {
  budgetByLegislatorSchema,
  type BudgetByLegislatorPayload,
} from "~/types/budget-by-legislator.schema";
import VisualizationLegislatorSkeleton from "~/components/skeleton/visualization-legislator-skeleton";
import { useMediaQuery } from "usehooks-ts";
import { VisualizationSelector } from "~/components/visualization-selector";
import type { SelectOption } from "~/types/visualization";

type ProposalKind = "proposal" | "proposal-cosign";
type VisualizationModeType = "amount" | "count";

type TermNumbers = number[];

type SummaryStats = {
  formattedReductionAmount: string;
  formattedFreezeAmount: string;
  reductionProposalsCount: number;
  freezeProposalsCount: number;
  mainResolutionCount: number;
};

type TermEntry = {
  termNumber?: number | null;
};

type Committee = {
  name?: string | null;
  session?: string | null;
  term?: {
    startDate?: string | null;
    termNumber?: number | null;
  } | null;
};

const buildWhereFilter = (
  selectedType: ProposalKind,
  proposerId: string | undefined,
  selectedYearValue: number
): ProposalWhereInput => {
  const baseFilter: ProposalWhereInput = {
    mergedParentProposals: null,
    historicalParentProposals: null,
    result: {
      in: [...PASSED_PROPOSAL_RESULTS],
    },
    year: {
      year: { equals: selectedYearValue },
    },
  };

  if (selectedType === "proposal-cosign") {
    return {
      ...baseFilter,
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
    ...baseFilter,
    proposers: {
      some: {
        id: { equals: proposerId },
      },
    },
  };
};

const SESSION_YEAR_REGEX = /(\d+)\s*年度/;
const SESSION_TERM_REGEX = /第(\d+)屆/;

const deriveBudgetYearKey = (committee: Committee): string | undefined => {
  if (committee.term?.startDate) {
    const year = new Date(committee.term.startDate).getFullYear();
    const budgetYear = year - 1911 + 1;
    return `${budgetYear}年度`;
  }

  const sessionYearMatch = committee.session?.match(SESSION_YEAR_REGEX);
  if (sessionYearMatch?.[1]) {
    return `${sessionYearMatch[1]}年度`;
  }

  return undefined;
};

const deriveTermNumberValue = (committee: Committee): number | undefined => {
  if (typeof committee.term?.termNumber === "number") {
    return committee.term.termNumber;
  }

  const sessionTermMatch = committee.session?.match(SESSION_TERM_REGEX);
  if (sessionTermMatch?.[1]) {
    const parsed = Number(sessionTermMatch[1]);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

const deriveYearToCommitteeMap = (
  committees?: Committee[] | null
): Map<string, YearCommitteeInfo> => {
  if (!committees) return new Map<string, YearCommitteeInfo>();

  const map = new Map<string, YearCommitteeInfo>();
  committees.forEach((committee) => {
    const key = deriveBudgetYearKey(committee);
    if (!key) return;

    map.set(key, {
      committeeName: committee.name ?? "委員會",
      termNumber: deriveTermNumberValue(committee),
    });
  });
  return map;
};

const extractTermNumbers = (
  entries?: Array<TermEntry | null | undefined> | null
): number[] => {
  if (!entries) return [];

  return entries
    .map((entry) => entry?.termNumber)
    .filter(
      (termNumber): termNumber is number =>
        termNumber !== null && termNumber !== undefined
    );
};

const deriveTermNumbers = (
  committees?: Committee[] | null,
  personTerms?: Array<TermEntry | null> | null
): TermNumbers => {
  const personTermNumbers = extractTermNumbers(personTerms);

  // If person has term data, use it as the primary source
  if (personTermNumbers.length > 0) {
    return [...new Set(personTermNumbers)].sort((a, b) => a - b);
  }

  // Fallback to committee terms if person terms are missing
  const committeeTermNumbers = extractTermNumbers(
    committees?.map((c) => c.term) ?? []
  );

  return [...new Set(committeeTermNumbers)].sort((a, b) => a - b);
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
  termNumbers: TermNumbers;
};

const LegislatorHeader = ({
  personName,
  partyName,
  termNumbers,
}: HeaderProps) => {
  const termLabel = termNumbers.length ? `第${termNumbers.join("、")}屆` : "";

  return (
    <div className="mt-4 flex min-w-[254px] flex-col items-center justify-center gap-y-2 border-b-2 border-black pb-3 lg:flex-row lg:items-end lg:gap-x-5">
      <p className="text-[36px] md:text-[32px]">{personName}</p>
      <p>{partyName}</p>
      {termLabel ? (
        <p className="flex flex-wrap justify-center gap-x-2">
          <span className="whitespace-nowrap">{termLabel}</span>
          <span>立法委員</span>
        </p>
      ) : (
        <p>立法委員</p>
      )}
    </div>
  );
};

type TypeToggleProps = {
  selectedType: ProposalKind;
  onChange: (type: ProposalKind) => void;
  className?: string;
};

type ModeSelectorProps = {
  mode: VisualizationModeType;
  onChange: (mode: VisualizationModeType) => void;
};

const ProposalTypeToggle = ({
  selectedType,
  onChange,
  className,
}: TypeToggleProps) => (
  <div className={`flex items-center gap-x-4 ${className ?? ""}`.trim()}>
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
    <div className="mt-4 flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-6 lg:text-left">
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

const VisualizationLegislator = () => {
  const { id: proposerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<ProposalKind>("proposal");
  const [mode, setMode] = useState<VisualizationModeType>("amount");
  const selectedYearValue = useMemo(() => {
    const paramValue = searchParams.get("year");
    const parsed = paramValue ? parseInt(paramValue, 10) : NaN;
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
    const defaultYear = YEAR_OPTIONS[0]?.value;
    const fallback = defaultYear ? parseInt(defaultYear, 10) : 0;
    return Number.isNaN(fallback) ? 0 : fallback;
  }, [searchParams]);
  const selectedYearOption = useMemo<SelectOption | null>(() => {
    if (!YEAR_OPTIONS.length) return null;
    return (
      YEAR_OPTIONS.find(
        (option) => option.value === String(selectedYearValue)
      ) ?? YEAR_OPTIONS[0]
    );
  }, [selectedYearValue]);
  const handleYearChange = useCallback(
    (option: SelectOption | null) => {
      if (!option) return;
      setSearchParams({ year: option.value });
    },
    [setSearchParams]
  );

  const whereFilter = useMemo(
    () => buildWhereFilter(selectedType, proposerId, selectedYearValue),
    [selectedType, proposerId, selectedYearValue]
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

  const person = peopleData?.people;
  const committees = person?.committees;

  const yearToCommitteeMap = useMemo(
    () => deriveYearToCommitteeMap(committees),
    [committees]
  );

  const termNumbers = useMemo(
    () => deriveTermNumbers(committees, person?.term),
    [committees, person?.term]
  );
  const proposals = mapVisualizationProposals(proposalsData);
  const summary = useMemo(() => computeSummaryStats(proposals), [proposals]);

  const { data: legislatorBudgetSummaryData } = useQuery({
    queryKey: ["budget", "legislators", proposerId ?? "all", selectedYearValue],
    queryFn: async (): Promise<BudgetByLegislatorPayload> => {
      const response = await fetch(BUDGET_BY_LEGISLATOR_URL);
      if (!response.ok) {
        throw new Error("無法載入立委預算資料");
      }
      const payload = await response.json();
      const result = budgetByLegislatorSchema.safeParse(payload);
      if (!result.success) {
        throw new Error("立委預算資料格式不符合預期");
      }
      return result.data;
    },
    enabled: !!proposerId,
  });

  const budgetSummaryForPanel = useMemo<SummaryPanelSummary | undefined>(() => {
    if (!legislatorBudgetSummaryData) return undefined;
    const record = legislatorBudgetSummaryData.find(
      (entry) => entry.yearInfo.year === selectedYearValue
    );
    if (!record) return undefined;

    const legislatorEntry =
      record.legislators?.find(
        (legislator) => legislator.peopleId === proposerId
      ) ?? record.legislators?.[0];

    const summarySource =
      selectedType === "proposal-cosign"
        ? (legislatorEntry?.allInvolved ??
          legislatorEntry?.proposerOnly ??
          record.overall)
        : (legislatorEntry?.proposerOnly ??
          legislatorEntry?.allInvolved ??
          record.overall);

    if (!summarySource) return undefined;

    const reductionAmount = summarySource.reductionAmount ?? 0;
    const freezeAmount = summarySource.freezeAmount ?? 0;

    return {
      formattedReductionAmount: formatAmountWithUnit(reductionAmount),
      formattedFreezeAmount: formatAmountWithUnit(freezeAmount),
      reductionCount: summarySource.reductionCount ?? 0,
      freezeCount: summarySource.freezeCount ?? 0,
      mainResolutionCount: summarySource.otherCount ?? 0,
    };
  }, [
    legislatorBudgetSummaryData,
    proposerId,
    selectedType,
    selectedYearValue,
  ]);

  const summaryForPanel = useMemo<SummaryPanelSummary>(
    () =>
      budgetSummaryForPanel ?? {
        formattedReductionAmount: summary.formattedReductionAmount,
        formattedFreezeAmount: summary.formattedFreezeAmount,
        reductionCount: summary.reductionProposalsCount,
        freezeCount: summary.freezeProposalsCount,
        mainResolutionCount: summary.mainResolutionCount,
      },
    [budgetSummaryForPanel, summary]
  );

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
          termNumbers={termNumbers}
        />
        <div className="mt-4 flex flex-col items-center gap-3 md:flex-row md:gap-4">
          <ProposalTypeToggle
            selectedType={selectedType}
            onChange={setSelectedType}
            className="mt-1 md:mt-0"
          />
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <VisualizationSelector
              options={YEAR_OPTIONS}
              value={selectedYearOption}
              onChange={(option) => {
                handleYearChange(option as SelectOption);
              }}
              aria-label="選擇年度"
              inputId="visualization-legislator-year"
              variant={isDesktop ? "budget-desktop" : undefined}
              wrapperClassName={isDesktop ? "w-fit" : undefined}
            />
          </div>
        </div>
        <ModeSelector mode={mode} onChange={setMode} />
        <SummaryPanel summary={summaryForPanel} />
        <div className="mt-6">
          <BudgetTypeLegend items={BUDGET_TYPE_LEGEND_ITEMS} />
        </div>
        {/* session chart */}
        <SessionChart
          data={sessionData}
          presenterDescription={person?.description}
          yearToCommitteeMap={yearToCommitteeMap}
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
};

export default VisualizationLegislator;
