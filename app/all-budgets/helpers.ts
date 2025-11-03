import {
  ProposalProposalTypeType,
  type People,
  type Proposal,
} from "~/graphql/graphql";

import { flow, pick, values, sum, defaultTo, prop, get } from "lodash/fp";
import {
  formatNumber,
  formatReducedAndFrozenAmount,
} from "~/budget-detail/helpers";
import type { BudgetTableData } from "~/components/budget-table";

const PROPOSAL_TYPE_LABEL_MAP: Record<ProposalProposalTypeType, string> = {
  freeze: "凍結",
  reduce: "刪減",
  other: "主提案",
};

function getProposalTypeDisplay(
  proposalTypes?: (ProposalProposalTypeType | null)[] | null
): string {
  if (!proposalTypes || proposalTypes.length === 0) {
    return "無";
  }
  return proposalTypes
    .filter((proposalType) => proposalType !== null)
    .map((proposalType) => {
      if (!proposalType) return "";
      return PROPOSAL_TYPE_LABEL_MAP[proposalType] ?? proposalType;
    })
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

const transformProposalResult = (result?: string | null): string => {
  const resultMap: Record<string, string> = {
    passed: "通過",
    rejected: "不通過",
  };
  return (result && resultMap[result]) || "待審議";
};

export function proposalToBudgetTableData(proposal: Proposal): BudgetTableData {
  const spec = {
    id: prop("id"),
    sequence: () => 0,
    department: flow(get("government.name"), defaultTo("部會")),
    date: () => "無審議日期",
    stage: () => "階段",
    proposer: flow(prop("proposers"), formatProposers),
    proposalType: flow(prop("proposalTypes"), getProposalTypeDisplay),
    proposalResult: flow(prop("result"), transformProposalResult),
    proposalContent: flow(prop("reason"), defaultTo("無提案內容")),
    originalAmount: flow(get("budget.budgetAmount"), formatNumber),
    reducedAmount: (p: Proposal) =>
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
