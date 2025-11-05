import {
  ProposalProposalTypeType,
  type GetVisualizationProposalsQuery,
  VisualizationProposalWithContextFragmentDoc,
  VisualizationProposalBaseFragmentDoc,
  type VisualizationProposalWithContextFragment,
  type VisualizationProposalBaseFragment,
} from "~/graphql/graphql";
import { groupBy, mapValues, sumBy } from "lodash";
import { formatNumber } from "~/budget-detail/helpers";
import { useFragment } from "~/graphql";

type VisualizationProposal = {
  id: VisualizationProposalBaseFragment["id"];
  freezeAmount: VisualizationProposalBaseFragment["freezeAmount"];
  reductionAmount: VisualizationProposalBaseFragment["reductionAmount"];
  proposalTypes: VisualizationProposalBaseFragment["proposalTypes"];
  proposers: VisualizationProposalBaseFragment["proposers"];
  government: VisualizationProposalWithContextFragment["government"];
  year: VisualizationProposalWithContextFragment["year"];
};

const extractProposals = (
  data: GetVisualizationProposalsQuery,
): VisualizationProposal[] =>
  useFragment(
    VisualizationProposalWithContextFragmentDoc,
    data.proposals ?? [],
  ).map((proposal) => {
    const base = useFragment(VisualizationProposalBaseFragmentDoc, proposal);
    return {
      id: base.id,
      freezeAmount: base.freezeAmount,
      reductionAmount: base.reductionAmount,
      proposalTypes: base.proposalTypes,
      proposers: base.proposers,
      government: proposal.government,
      year: proposal.year,
    };
  });

export const mapVisualizationProposals = (
  data?: GetVisualizationProposalsQuery | null,
): VisualizationProposal[] => {
  if (!data) return [];
  return extractProposals(data);
};

export type ProposalVisualizationType =
  | "freeze"
  | "reduce"
  | "main-resolution";

export type NodeDatum = {
  name: string;
  value?: number;
  color?: string;
  id: string; // 代表提案 ID
  proposerId?: string; // 代表提案人 ID
  isFrozen?: boolean;
  proposalType?: ProposalVisualizationType;
  children?: NodeDatum[];
};

export const PARTY_COLORS = new Map<string, string>([
  ["中國國民黨", "#6B7FFF"],
  ["民主進步黨", "#00CD26"],
  ["親民黨", "#FF852E"],
  ["時代力量", "#F8E112"],
  ["台灣民眾黨", "#4EDEE6"],
  ["台灣基進", "#C45822"],
  ["台灣團結聯盟", "#B39171"],
  ["新黨", "#F3F08C"],
  ["社會民主黨", "#BC4CAB"],
  ["無黨團結聯盟", "#E5AEAF"],
  ["無黨籍", "#D5D5D5"],
]);
export const DEFAULT_COLOR = "#D5D5D5"; // 無黨籍

export const formatAmountWithUnit = (value: number): string => {
  const formatted = formatNumber(value);
  if (formatted === "無預算金額") return formatted;
  return `${formatted.trim()}元`;
};

export const transformToCirclePackData = (
  data: GetVisualizationProposalsQuery,
): NodeDatum => {
  const proposals = extractProposals(data);
  const children = proposals
    .map<NodeDatum | null>((proposal) => {
      const { id, proposers, freezeAmount, reductionAmount } = proposal;
      const proposer = proposers?.[0]; // Assuming the first proposer is the main one
      const party = proposer?.party?.name ?? "無黨籍";
      const originalValue = (freezeAmount ?? 0) + (reductionAmount ?? 0);

      if (originalValue === 0) {
        return null;
      }

      const scaledValue = Math.pow(originalValue, 0.45);
      const name = `${proposer?.name}\n${party}\n${formatAmountWithUnit(
        originalValue,
      )}`;
      const color = PARTY_COLORS.get(party) || DEFAULT_COLOR;

      const node: NodeDatum = {
        name,
        value: scaledValue,
        color: color,
        isFrozen: !!freezeAmount && freezeAmount > 0,
        id: id,
        proposerId: proposer?.id,
      };

      return node;
    })
    .filter((p): p is NodeDatum => p !== null);

  return {
    id: "root",
    name: "root",
    children: children,
  };
};

export type VisualizationGroupedData = Record<string, NodeDatum>;

const GROUP_LABELS = {
  freeze: "凍結",
  reduce: "刪減",
  other: "主決議",
} as const;

const GROUP_DISPLAY_COLORS: Record<
  keyof typeof GROUP_LABELS,
  string
> = {
  freeze: "#4E7AE6",
  reduce: "#E9808E",
  other: "#FFB347",
};

type VisualizationMode = "amount" | "count";

/**
 * 將提案資料依立委與類型群組，回傳 DepartmentVisualization 可迭代的資料格式。
 */
export const transformToGroupedByLegislatorData = (
  data: GetVisualizationProposalsQuery,
  mode: VisualizationMode = "amount",
): VisualizationGroupedData => {
  const proposals = extractProposals(data);

  const groupedByLegislator = groupBy(
    proposals,
    (proposal) => proposal.proposers?.[0]?.id ?? "unknown-proposer",
  );

  const legislatorNodes: NodeDatum[] = [];

  Object.entries(groupedByLegislator).forEach(
    ([proposerId, legislatorProposals]) => {
      const mainProposer = legislatorProposals[0]?.proposers?.[0];
      const legislatorName = mainProposer?.name ?? "未知立委";
      const partyName = mainProposer?.party?.name ?? "無黨籍";
      const partyColor =
        mainProposer?.party?.color ??
        PARTY_COLORS.get(partyName) ??
        DEFAULT_COLOR;

      const freezeProposals = legislatorProposals.filter(
        (proposal) => (proposal.freezeAmount ?? 0) > 0,
      );
      const reductionProposals = legislatorProposals.filter(
        (proposal) => (proposal.reductionAmount ?? 0) > 0,
      );
      const mainResolutionProposals = legislatorProposals.filter((proposal) =>
        proposal.proposalTypes?.includes(ProposalProposalTypeType.Other),
      );

      const pushFinancialNode = (
        key: Extract<ProposalVisualizationType, "freeze" | "reduce">,
        proposalsForKey: typeof legislatorProposals,
        getAmount: (proposal: (typeof legislatorProposals)[number]) => number,
      ) => {
        if (!proposalsForKey.length) return;
        const totalAmount = sumBy(proposalsForKey, getAmount);
        const totalCount = proposalsForKey.length;
        const rawValue = mode === "amount" ? totalAmount : totalCount;

        if (rawValue <= 0) return;

        const displayValue =
          mode === "amount"
            ? formatAmountWithUnit(totalAmount)
            : `${totalCount}案`;

        legislatorNodes.push({
          id: `${proposerId}-${key}`,
          name: `${legislatorName}\n${GROUP_LABELS[key]}\n${displayValue}`,
          value: Math.pow(rawValue, 0.45),
          color: partyColor,
          proposerId: mainProposer?.id,
          proposalType: key,
          isFrozen: key === "freeze",
        });
      };

      pushFinancialNode(
        "freeze",
        freezeProposals,
        (proposal) => proposal.freezeAmount ?? 0,
      );

      pushFinancialNode(
        "reduce",
        reductionProposals,
        (proposal) => proposal.reductionAmount ?? 0,
      );

      if (mode === "count" && mainResolutionProposals.length > 0) {
        const totalCount = mainResolutionProposals.length;
        if (totalCount > 0) {
          legislatorNodes.push({
            id: `${proposerId}-main-resolution`,
            name: `${legislatorName}\n${GROUP_LABELS.other}\n${totalCount}案`,
            value: Math.pow(totalCount, 0.45),
            color: partyColor,
            proposerId: mainProposer?.id,
            proposalType: "main-resolution",
          });
        }
      }
    },
  );

  return {
    立委提案彙整: {
      id: "legislator-summary-root",
      name: "root",
      children: legislatorNodes,
    },
  };
};

/**
 * 將 proposals 按年度和部會分組，轉換為 SessionChart 需要的 NodeDatum[]
 *
 * 資料結構：
 * - 第一層：年度（從 budget.year）
 * - 第二層：政府部門（從 government）
 * - 第三層：各提案（可點擊導航）
 *
 * @param data - GraphQL query 回傳的資料
 * @param mode - 'amount' 或 'count'，決定 value 的計算方式
 * @returns NodeDatum[] - 每個元素代表一個年度的 session
 */
export const transformToGroupedSessionData = (
  data: GetVisualizationProposalsQuery,
  mode: "amount" | "count" = "amount"
): NodeDatum[] => {
  const proposals = extractProposals(data);

  if (proposals.length === 0) {
    return [];
  }

  // 第一步：雙層分組（年度 -> 政府類別）
  const groupedData = mapValues(
    groupBy(proposals, (p) => p.year?.year ?? "未知年度"),
    (yearProposals) =>
      groupBy(yearProposals, (p) => p.government?.category ?? "未知類別")
  );

  // 第二步：轉換為 NodeDatum[]
  const result: NodeDatum[] = [];

  // 遍歷每個年度
  Object.entries(groupedData).forEach(([year, categoryGroups]) => {
    const categoryNodes: NodeDatum[] = [];

    Object.entries(categoryGroups).forEach(([category, categoryProposals]) => {
      if (mode === "amount") {
        const proposalsToProcess = categoryProposals.filter(
          (p) => (p.freezeAmount ?? 0) > 0 || (p.reductionAmount ?? 0) > 0,
        );

        if (proposalsToProcess.length === 0) {
          return;
        }

        const proposalNodes: NodeDatum[] = proposalsToProcess.map(
          (proposal) => {
            const { id, government, freezeAmount, reductionAmount, proposers } =
              proposal;
            const proposer = proposers?.[0];
            const party = proposer?.party?.name ?? "無黨籍";
            const originalValue = (freezeAmount ?? 0) + (reductionAmount ?? 0);
            const scaledValue = Math.pow(originalValue, 0.45);
            const displayValue = formatAmountWithUnit(originalValue);
            const name = `${id}\n${
              government?.name ?? "未知部會"
            }\n${displayValue}`;
            const color = PARTY_COLORS.get(party) || DEFAULT_COLOR;

            return {
              id,
              name,
              value: scaledValue,
              color,
              isFrozen: !!freezeAmount,
              proposerId: proposer?.id,
              children: [],
            };
          },
        );

        const categoryValue = sumBy(proposalNodes, (n) => n.value || 0);
        categoryNodes.push({
          id: `category-${year}-${category}`,
          name: category,
          value: categoryValue,
          color: "#6B7FFF",
          children: proposalNodes,
        });
      } else {
        // mode === 'count'
        const groupedByGov = groupBy(
          categoryProposals,
          (p) => p.government?.name ?? "未知部會",
        );

        const governmentNodes: NodeDatum[] = Object.entries(groupedByGov).map(
          ([govName, govProposals]) => {
            const proposalNodes: NodeDatum[] = govProposals.map((proposal) => {
              const { id, government, proposers } = proposal;
              const proposer = proposers?.[0];
              const party = proposer?.party?.name ?? "無黨籍";
              const name = `${id}\n${
                government?.name ?? "未知部會"
              }\n1案`;
              const color = PARTY_COLORS.get(party) || DEFAULT_COLOR;

              return {
                id,
                name,
                value: 1,
                color,
                children: [],
                proposerId: proposer?.id,
              };
            });

            return {
              id: `gov-${year}-${category}-${govName}`,
              name: govName,
              value: govProposals.length,
              children: proposalNodes,
              color: "#8884d8", // Placeholder color for government nodes
            };
          },
        );

        if (governmentNodes.length === 0) {
          return;
        }

        const categoryValue = sumBy(governmentNodes, (n) => n.value || 0);
        categoryNodes.push({
          id: `category-${year}-${category}`,
          name: category,
          value: categoryValue,
          color: "#6B7FFF",
          children: governmentNodes,
        });
      }
    });

    if (categoryNodes.length === 0) {
      return;
    }

    // 建立年度節點（第一層）
    result.push({
      id: `session-${year}`,
      name: `${year}年度`,
      children: categoryNodes,
    });
  });

  // 按年度排序（降序）
  result.sort((a, b) => {
    const yearA = parseInt(a.id.replace("session-", ""));
    const yearB = parseInt(b.id.replace("session-", ""));
    return yearB - yearA;
  });

  return result;
};

export const transformToCategorizedData = (
  data: GetVisualizationProposalsQuery,
  mode: "amount" | "count",
): Record<string, NodeDatum> => {
  const proposals = extractProposals(data);

  // 依 mode 決定是否過濾提案
  const proposalsToProcess =
    mode === "amount"
      ? proposals.filter(
          (p) => (p.freezeAmount ?? 0) + (p.reductionAmount ?? 0) > 0,
        )
      : proposals;

  // 第一層：按 government.category 分組
  const groupedByCategory = groupBy(
    proposalsToProcess,
    (p) => p.government?.category ?? "未分類",
  );

  return mapValues(groupedByCategory, (categoryProposals, categoryName) => {
    // 第二層：在類別內按 proposer.id 分組
    const groupedByProposer = groupBy(
      categoryProposals,
      (p) => p.proposers?.[0]?.id ?? "unknown-proposer",
    );

    const proposerNodes: NodeDatum[] = [];

    Object.entries(groupedByProposer).forEach(
      ([proposerId, proposerProposals]) => {
        const mainProposer = proposerProposals[0]?.proposers?.[0];
        const proposerName = mainProposer?.name ?? "未知";
        const partyName = mainProposer?.party?.name ?? "無黨籍";
        const partyColor =
          mainProposer?.party?.color ??
          PARTY_COLORS.get(partyName) ??
          DEFAULT_COLOR;

        const freezeProposals = proposerProposals.filter(
          (proposal) => (proposal.freezeAmount ?? 0) > 0,
        );
        const reductionProposals = proposerProposals.filter(
          (proposal) => (proposal.reductionAmount ?? 0) > 0,
        );
        const mainResolutionProposals = proposerProposals.filter((proposal) =>
          proposal.proposalTypes?.includes(ProposalProposalTypeType.Other),
        );

        const pushFinancialNode = (
          key: Extract<ProposalVisualizationType, "freeze" | "reduce">,
          proposalsForKey: typeof proposerProposals,
          getAmount: (proposal: (typeof proposerProposals)[number]) => number,
        ) => {
          if (!proposalsForKey.length) return;
          const totalAmount = sumBy(proposalsForKey, getAmount);
          const totalCount = proposalsForKey.length;
          const rawValue = mode === "amount" ? totalAmount : totalCount;

          if (rawValue <= 0) return;

          const displayValue =
            mode === "amount"
              ? formatAmountWithUnit(totalAmount)
              : `${totalCount}案`;

          proposerNodes.push({
            id: `proposer-${categoryName}-${proposerId}-${key}`,
            name: `${proposerName}\n${GROUP_LABELS[key]}\n${displayValue}`,
            value: Math.pow(rawValue, 0.45),
            color: partyColor,
            proposerId: mainProposer?.id,
            proposalType: key,
            isFrozen: key === "freeze",
          });
        };

        pushFinancialNode(
          "freeze",
          freezeProposals,
          (proposal) => proposal.freezeAmount ?? 0,
        );

        pushFinancialNode(
          "reduce",
          reductionProposals,
          (proposal) => proposal.reductionAmount ?? 0,
        );

        if (mode === "count" && mainResolutionProposals.length > 0) {
          const totalCount = mainResolutionProposals.length;
          if (totalCount > 0) {
            proposerNodes.push({
              id: `proposer-${categoryName}-${proposerId}-main-resolution`,
              name: `${proposerName}\n${GROUP_LABELS.other}\n${totalCount}案`,
              value: Math.pow(totalCount, 0.45),
              color: partyColor,
              proposerId: mainProposer?.id,
              proposalType: "main-resolution",
            });
          }
        }
      },
    );

    return {
      id: "root",
      name: "root",
      children: proposerNodes,
    };
  });
};
