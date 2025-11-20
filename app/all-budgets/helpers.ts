import {
  ProposalProposalTypeType,
  type People,
  type Proposal,
  type GetPaginatedProposalsQuery,
} from "~/graphql/graphql";
import { mapStageLabel } from "~/utils/stage";

import {
  flow,
  pick,
  values,
  sum,
  defaultTo,
  prop,
  get,
  flatMap,
  compact,
} from "lodash/fp";
import {
  formatNumber,
  formatReducedAndFrozenAmount,
} from "~/budget-detail/helpers";
import type { BudgetTableData } from "~/components/budget-table";

function getProposalTypeDisplay(
  proposalTypes?: (ProposalProposalTypeType | null)[] | null
): string {
  if (!proposalTypes || proposalTypes.length === 0) {
    return "無";
  }
  const proposalTypeMap = new Map([
    ["other", "主決議"],
    ["freeze", "凍結案"],
    ["reduction", "刪減案"],
  ]);
  return proposalTypes
    .filter((proposalType) => proposalType !== null)
    .map((proposalType) => proposalTypeMap.get(proposalType ?? "") ?? "")
    .join("、");
}

function formatLegislator(legislator: People | null): string {
  return legislator?.name || "";
}

const calculateTotalReacts = flow(
  pick(["react_angry", "react_disappoint", "react_good", "react_whatever"]),
  values,
  (nums) => nums.map((n) => n || 0),
  sum
);

const formatProposers = (proposers?: (People | null)[] | null): string =>
  proposers && proposers.length > 0
    ? proposers.map(formatLegislator).join(" ")
    : "未知提案人";

type StageCommittee = {
  endDate?: string | Date | null;
};

type MeetingForStage = {
  type?: string | null;
  committee?: (StageCommittee | null)[] | null;
  meetingDate?: string | Date | null; // 重新加入 meetingDate
};

type PaginatedProposal = NonNullable<
  GetPaginatedProposalsQuery["proposals"]
>[number];

type ProposalInput = Proposal | PaginatedProposal;

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getLatestCommitteeEndDate(meeting: MeetingForStage): Date | null {
  const endDates = (meeting.committee ?? [])
    .map((committee) => committee?.endDate)
    .map((value) => toDate(value))
    .filter((value): value is Date => Boolean(value));

  if (endDates.length === 0) return null;

  return endDates.reduce((latest, current) =>
    current.getTime() > latest.getTime() ? current : latest
  );
}

function getLatestMeetingDate(
  meetings?: (MeetingForStage | null)[] | null
): string {
  const validMeetings = (meetings ?? []).filter(
    (meeting): meeting is MeetingForStage => Boolean(meeting)
  );

  const allDates = flatMap((meeting: MeetingForStage) => {
    return compact([
      toDate(meeting.meetingDate),
      getLatestCommitteeEndDate(meeting),
    ]);
  })(validMeetings);

  if (allDates.length === 0) return "無審議日期";

  const latestDate = allDates.reduce((latest, current) =>
    current.getTime() > latest.getTime() ? current : latest
  );

  const formattedDate = latestDate.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  return formattedDate;
}

function hasMissingCommitteeEndDate(meeting: MeetingForStage): boolean {
  const committees = meeting.committee ?? [];
  if (committees.length === 0) return true;
  return committees.some((committee) => !committee?.endDate);
}

function meetingsToStage(
  meetings?: (MeetingForStage | null)[] | null,
  fallbackStage = "階段"
): string {
  const validMeetings = (meetings ?? []).filter(
    (meeting): meeting is MeetingForStage => Boolean(meeting)
  );

  if (validMeetings.length === 0) return fallbackStage;
  if (validMeetings.length === 1) {
    return mapStageLabel(validMeetings[0].type, fallbackStage);
  }

  const meetingWithOpenCommittee = validMeetings.find((meeting) =>
    hasMissingCommitteeEndDate(meeting)
  );

  if (meetingWithOpenCommittee) {
    return mapStageLabel(meetingWithOpenCommittee.type, fallbackStage);
  }

  const meetingWithLatestEndDate = validMeetings
    .map((meeting) => ({
      meeting,
      latestEndDate: getLatestCommitteeEndDate(meeting),
    }))
    .filter(
      (
        entry
      ): entry is {
        meeting: MeetingForStage;
        latestEndDate: Date;
      } => Boolean(entry.latestEndDate)
    )
    .reduce<{
      meeting: MeetingForStage;
      latestEndDate: Date;
    } | null>((selected, current) => {
      if (!selected) return current;
      return current.latestEndDate.getTime() > selected.latestEndDate.getTime()
        ? current
        : selected;
    }, null);

  if (meetingWithLatestEndDate) {
    return mapStageLabel(meetingWithLatestEndDate.meeting.type, fallbackStage);
  }

  return fallbackStage;
}

const transformProposalResult = (result?: string | null): string => {
  const resultMap: Record<string, string> = {
    passed: "通過",
    rejected: "不通過",
  };
  return (result && resultMap[result]) || "待審議";
};

export function proposalToBudgetTableData(
  proposal: ProposalInput
): BudgetTableData {
  const spec = {
    id: prop("id"),
    sequence: () => 0,
    department: flow(get("government.name"), defaultTo("部會")),
    date: (p: ProposalInput) => getLatestMeetingDate(p.meetings), // 重新使用 getLatestMeetingDate
    stage: (proposal: ProposalInput) => meetingsToStage(proposal.meetings),
    proposer: flow(prop("proposers"), formatProposers),
    proposalType: flow(prop("proposalTypes"), getProposalTypeDisplay),
    proposalResult: flow(prop("result"), transformProposalResult),
    proposalContent: flow(prop("reason"), defaultTo("無提案內容")),
    originalAmount: flow(get("budget.budgetAmount"), formatNumber),
    reducedAmount: (p: ProposalInput) =>
      formatReducedAndFrozenAmount(p.reductionAmount, p.freezeAmount),
    tags: () => undefined,
    status: () => "committeed",
    committeedDate: () => undefined,
    totalReacts: calculateTotalReacts,
    react_angry: flow(prop("react_angry"), defaultTo(0)),
    react_disappoint: flow(prop("react_disappoint"), defaultTo(0)),
    react_good: flow(prop("react_good"), defaultTo(0)),
    react_whatever: flow(prop("react_whatever"), defaultTo(0)),
  };
  return Object.keys(spec).reduce((acc, key) => {
    acc[key as keyof BudgetTableData] =
      spec[key as keyof typeof spec](proposal);
    return acc;
  }, {} as Partial<BudgetTableData>) as BudgetTableData;
}
