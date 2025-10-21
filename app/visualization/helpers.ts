import type { GetPaginatedProposalsQuery } from "~/graphql/graphql";
import { groupBy, mapValues, sumBy } from "lodash";

export type NodeDatum = {
  name: string;
  value?: number;
  color?: string;
  id: string;
  isFrozen?: boolean;
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

export const transformToCirclePackData = (
  data: GetPaginatedProposalsQuery
): NodeDatum => {
  const children = data.proposals?.map((proposal) => {
    const { id, proposers, freezeAmount, reductionAmount } = proposal;
    const proposer = proposers?.[0]; // Assuming the first proposer is the main one
    const party = proposer?.party?.name ?? "無黨籍";
    const value = freezeAmount || reductionAmount || 0;
    const name = `${proposer?.name}\n${party}\n${value.toLocaleString()}元`;

    const color = PARTY_COLORS.get(party) || DEFAULT_COLOR;

    return {
      name,
      value,
      color: color,
      isFrozen: !!freezeAmount,
      id: id,
      children: [],
    };
  });

  return {
    id: "root",
    name: "root",
    children: children,
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
  data: GetPaginatedProposalsQuery,
  mode: "amount" | "count" = "amount"
): NodeDatum[] => {
  const proposals = data.proposals || [];

  if (proposals.length === 0) {
    return [];
  }

  // 第一步：雙層分組（年度 -> 政府類別）
  const groupedData = mapValues(
    groupBy(proposals, (p) => p.year ?? "未知年度"),
    (yearProposals) =>
      groupBy(yearProposals, (p) => p.government?.category ?? "未知類別")
  );

  // 第二步：轉換為 NodeDatum[]
  const result: NodeDatum[] = [];

  // 遍歷每個年度
  Object.entries(groupedData).forEach(([year, categoryGroups]) => {
    const categoryNodes: NodeDatum[] = [];

    Object.entries(categoryGroups).forEach(([category, categoryProposals]) => {
      const proposalsToProcess =
        mode === "amount"
          ? categoryProposals.filter(
              (p) => (p.freezeAmount ?? 0) > 0 || (p.reductionAmount ?? 0) > 0
            )
          : categoryProposals;

      if (proposalsToProcess.length === 0) {
        return;
      }

      // 建立提案節點（第三層）
      const proposalNodes: NodeDatum[] = proposalsToProcess.map((proposal) => {
        const { id, government, freezeAmount, reductionAmount } = proposal;
        const party = proposal.proposers?.[0]?.party?.name ?? "無黨籍";

        let originalValue: number;
        let scaledValue: number;

        if (mode === "amount") {
          originalValue = (freezeAmount ?? 0) + (reductionAmount ?? 0);
          scaledValue = Math.pow(originalValue, 0.45);
        } else {
          originalValue = 1;
          scaledValue = 1;
        }

        const displayValue =
          mode === "amount" ? `${originalValue.toLocaleString()}元` : "1案";
        const name = `${id}\n${
          government?.name ?? "未知部會"
        }\n${displayValue}`;

        const color = PARTY_COLORS.get(party) || DEFAULT_COLOR;

        return {
          id: id,
          name,
          value: scaledValue,
          color,
          isFrozen: !!freezeAmount,
          children: [],
        };
      });

      const categoryValue = sumBy(proposalNodes, (n) => n.value || 0);

      // 建立類別節點（第二層）
      categoryNodes.push({
        id: `category-${year}-${category}`,
        name: category,
        value: categoryValue,
        color: "#6B7FFF",
        children: proposalNodes,
      });
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
