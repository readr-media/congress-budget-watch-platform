import {
  ProposalProposalTypeType,
  type People,
  type Proposal,
  type GetPaginatedProposalsQuery,
} from "~/graphql/graphql";

import { flow, pick, values, sum, defaultTo, prop, get } from "lodash/fp";
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
  return proposalTypes
    .filter((proposalType) => proposalType !== null)
    .map((proposalType) => proposalType![0] ?? "")
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

const stageLabelMap: Record<string, string> = {
  budget_review: "預算審議",
  budget_unfreeze: "預算解凍",
};

type StageCommittee = {
  endDate?: string | Date | null;
};

type MeetingForStage = {
  type?: string | null;
  committee?: (StageCommittee | null)[] | null;
};

type PaginatedProposal = NonNullable<
  GetPaginatedProposalsQuery["proposals"]
>[number];

type ProposalInput = Proposal | PaginatedProposal;

function toStageLabel(type?: string | null, fallbackStage = "階段"): string {
  if (!type) return fallbackStage;
  return stageLabelMap[type] ?? fallbackStage;
}

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
    return toStageLabel(validMeetings[0].type, fallbackStage);
  }

  const meetingWithOpenCommittee = validMeetings.find((meeting) =>
    hasMissingCommitteeEndDate(meeting)
  );

  if (meetingWithOpenCommittee) {
    return toStageLabel(meetingWithOpenCommittee.type, fallbackStage);
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
    return toStageLabel(meetingWithLatestEndDate.meeting.type, fallbackStage);
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
    date: () => "無審議日期",
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
  };

  return Object.keys(spec).reduce((acc, key) => {
    acc[key as keyof BudgetTableData] =
      spec[key as keyof typeof spec](proposal);
    return acc;
  }, {} as Partial<BudgetTableData>) as BudgetTableData;
}
