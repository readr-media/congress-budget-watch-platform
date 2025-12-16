import {
  ProposalProposalTypeType,
  type GetVisualizationProposalsQuery,
  VisualizationProposalWithContextFragmentDoc,
  VisualizationProposalBaseFragmentDoc,
  type VisualizationProposalWithContextFragment,
  type VisualizationProposalBaseFragment,
} from "~/graphql/graphql";
import {
  defaultTo,
  entries,
  forEach,
  groupBy,
  mapValues,
  reduce,
  sumBy,
} from "lodash";
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

type VisualizationProposer = NonNullable<
  NonNullable<VisualizationProposal["proposers"]>[number]
>;

const extractProposals = (
  data?: GetVisualizationProposalsQuery | null
): VisualizationProposal[] =>
  useFragment(
    VisualizationProposalWithContextFragmentDoc,
    data?.proposals ?? []
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
  data?: GetVisualizationProposalsQuery | null
): VisualizationProposal[] => {
  return extractProposals(data);
};

const deriveProposalNodeMeta = (
  proposal: VisualizationProposal
): {
  proposalType?: ProposalVisualizationType;
  isFrozen: boolean;
} => {
  const freezeAmount = defaultTo(proposal.freezeAmount, 0);
  const reductionAmount = defaultTo(proposal.reductionAmount, 0);

  if (freezeAmount > 0) {
    return { proposalType: "freeze", isFrozen: true };
  }

  if (reductionAmount > 0) {
    return { proposalType: "reduce", isFrozen: false };
  }

  if (proposal.proposalTypes?.includes(ProposalProposalTypeType.Other)) {
    return { proposalType: "main-resolution", isFrozen: false };
  }

  return { proposalType: undefined, isFrozen: false };
};

export const PASSED_PROPOSAL_RESULTS = ["passed", "通過"] as const;

export type ProposalVisualizationType = "freeze" | "reduce" | "main-resolution";

export type NodeDatum = {
  name: string;
  value?: number;
  color?: string;
  id: string; // 圖表節點唯一 ID
  proposalId?: string; // 代表提案 ID（僅單一提案節點使用）
  proposerId?: string; // 代表提案人 ID
  proposerKey?: string; // 立委識別值（含無 ID 的情況）
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

export type VisualizationGroupedData = Record<string, NodeDatum>;

export const GROUP_LABELS = {
  freeze: "凍結",
  reduce: "刪減",
  other: "主決議",
} as const;

type VisualizationMode = "amount" | "count";

export const formatAmountWithUnit = (value: number): string => {
  const formatted = formatNumber(value);
  if (formatted === "無預算金額") return formatted;
  return `${formatted.trim()}元`;
};

const sanitizePartyName = (partyName?: string | null): string | null => {
  if (typeof partyName !== "string") {
    return null;
  }
  const trimmed = partyName.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const hasLabelContent = (value?: string | null): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const getProposerKey = (
  proposer: VisualizationProposer | null | undefined,
  proposalId?: string | null,
  index = 0
): string => {
  if (proposer?.id) {
    return proposer.id;
  }
  if (hasLabelContent(proposer?.name)) {
    return proposer!.name!.trim();
  }
  if (proposalId) {
    return `unknown-${proposalId}`;
  }
  return `unknown-proposer-${index}`;
};

const buildNodeLabel = (...parts: Array<string | null | undefined>) =>
  parts.filter(hasLabelContent).join("\n");

export const transformToCirclePackData = (
  data: GetVisualizationProposalsQuery
): NodeDatum => {
  const proposals = extractProposals(data);
  const children = proposals
    .map<NodeDatum | null>((proposal) => {
      const { id, proposers, freezeAmount, reductionAmount } = proposal;
      const proposer = proposers?.[0]; // Assuming the first proposer is the main one
      const proposerName = proposer?.name ?? "";
      const party = sanitizePartyName(proposer?.party?.name);
      const originalValue = (freezeAmount ?? 0) + (reductionAmount ?? 0);

      if (originalValue === 0) {
        return null;
      }

      const scaledValue = Math.pow(originalValue, 0.45);
      const name = buildNodeLabel(
        proposerName,
        party,
        formatAmountWithUnit(originalValue)
      );
      const color = PARTY_COLORS.get(party ?? "無黨籍") || DEFAULT_COLOR;

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

/**
 * 將提案資料依立委與類型群組
 */
export const transformToGroupedByLegislatorData = (
  data: GetVisualizationProposalsQuery,
  mode: VisualizationMode = "amount"
): VisualizationGroupedData => {
  const proposals = extractProposals(data);
  const proposerEntries = proposals.flatMap((proposal) => {
    const proposers = proposal.proposers?.length
      ? proposal.proposers
      : [null];
    return proposers.map((proposer, index) => ({
      proposerKey: getProposerKey(proposer, proposal.id, index),
      proposer,
      proposal,
    }));
  });

  const groupedByLegislator = groupBy(
    proposerEntries,
    (entry) => entry.proposerKey ?? "unknown-proposer"
  );

  const legislatorNodes: NodeDatum[] = [];

  forEach(entries(groupedByLegislator), ([proposerKey, groupedEntries]) => {
    const mainEntry = groupedEntries[0];
    const mainProposer = mainEntry?.proposer ?? null;
    const legislatorName = mainProposer?.name ?? "未知立委";
    const partyName = sanitizePartyName(mainProposer?.party?.name);
    const partyColor =
      mainProposer?.party?.color ??
      (partyName ? PARTY_COLORS.get(partyName) : undefined) ??
      DEFAULT_COLOR;
    const freezeEntries = groupedEntries.filter(
      (entry) => defaultTo(entry.proposal.freezeAmount, 0) > 0
    );
    const reductionEntries = groupedEntries.filter(
      (entry) => defaultTo(entry.proposal.reductionAmount, 0) > 0
    );
    const mainResolutionEntries = groupedEntries.filter((entry) =>
      entry.proposal.proposalTypes?.includes(ProposalProposalTypeType.Other)
    );

    if (mode === "amount") {
      const legislatorFreezeAmount = sumBy(freezeEntries, (entry) =>
        defaultTo(entry.proposal.freezeAmount, 0)
      );
      const legislatorReductionAmount = sumBy(reductionEntries, (entry) =>
        defaultTo(entry.proposal.reductionAmount, 0)
      );
      // 因為這些節點代表「立委」的總結，而不是單一「提案」，所以不應該有 proposalId
      // 移除 proposalId 屬性，讓 handleNodeClick 能依據 proposerId 導航
      if (legislatorFreezeAmount > 0) {
        legislatorNodes.push({
          id: `${proposerKey}-freeze`, // 使用 proposerKey 來建立唯一的節點 ID
          // proposalId: undefined, // 移除或設定為 undefined
          name: buildNodeLabel(
            legislatorName,
            partyName,
            formatAmountWithUnit(legislatorFreezeAmount)
          ),
          value: Math.pow(legislatorFreezeAmount, 0.45),
          color: partyColor,
          proposerId: mainProposer?.id, // 立委 ID 是這裡
          proposerKey: proposerKey,
          proposalType: "freeze",
          isFrozen: true,
        });
      }
      if (legislatorReductionAmount > 0) {
        legislatorNodes.push({
          id: `${proposerKey}-reduce`, // 使用 proposerKey 來建立唯一的節點 ID
          // proposalId: undefined, // 移除或設定為 undefined
          name: buildNodeLabel(
            legislatorName,
            partyName,
            formatAmountWithUnit(legislatorReductionAmount)
          ),
          value: Math.pow(legislatorReductionAmount, 0.45),
          color: partyColor,
          proposerId: mainProposer?.id, // 立委 ID 是這裡
          proposerKey: proposerKey,
          proposalType: "reduce",
        });
      }
    } else {
      const freezeCount = freezeEntries.length;
      const reductionCount = reductionEntries.length;
      const pureMainResolutionCount = mainResolutionEntries.filter(
        (entry) =>
          defaultTo(entry.proposal.freezeAmount, 0) === 0 &&
          defaultTo(entry.proposal.reductionAmount, 0) === 0
      ).length;

      if (freezeCount > 0) {
        legislatorNodes.push({
          id: `${proposerKey}-freeze-count`,
          name: buildNodeLabel(legislatorName, partyName, `${freezeCount}案`),
          value: freezeCount,
          color: partyColor,
          proposerId: mainProposer?.id,
          proposerKey: proposerKey,
          proposalType: "freeze",
          isFrozen: true,
        });
      }

      if (reductionCount > 0) {
        legislatorNodes.push({
          id: `${proposerKey}-reduce-count`,
          name: buildNodeLabel(
            legislatorName,
            partyName,
            `${reductionCount}案`
          ),
          value: reductionCount,
          color: partyColor,
          proposerId: mainProposer?.id,
          proposerKey: proposerKey,
          proposalType: "reduce",
        });
      }

      if (pureMainResolutionCount > 0) {
        legislatorNodes.push({
          id: `${proposerKey}-main-resolution-count`,
          name: buildNodeLabel(
            legislatorName,
            partyName,
            `${pureMainResolutionCount}案`
          ),
          value: pureMainResolutionCount,
          color: partyColor,
          proposerId: mainProposer?.id,
          proposerKey: proposerKey,
          proposalType: "main-resolution",
        });
      }
    }
  });

  return {
    "": {
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

  if (proposals.length === 0) return [];

  // 第一步：雙層分組（年度 -> 政府類別）
  const groupedData = mapValues(
    groupBy(proposals, (p) => p.year?.year ?? "未知年度"),
    (yearProposals) =>
      groupBy(yearProposals, (p) => p.government?.category ?? "未知類別")
  );

  // 第二步：轉換為 NodeDatum[]
  const result: NodeDatum[] = [];

  // 遍歷每個年度
  forEach(entries(groupedData), ([year, categoryGroups]) => {
    const categoryNodes: NodeDatum[] = [];

    forEach(entries(categoryGroups), ([category, categoryProposals]) => {
      if (mode === "amount") {
        const proposalsToProcess = categoryProposals.filter(
          (p) => (p.freezeAmount ?? 0) > 0 || (p.reductionAmount ?? 0) > 0
        );

        if (proposalsToProcess.length === 0) return;

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
            const color =
              proposer?.party?.color ||
              PARTY_COLORS.get(party) ||
              DEFAULT_COLOR;
            const { proposalType, isFrozen } = deriveProposalNodeMeta(proposal);

            return {
              id,
              name,
              value: scaledValue,
              color,
              isFrozen,
              proposalType,
              proposerId: proposer?.id,
              children: [],
            };
          }
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
          (p) => p.government?.name ?? "未知部會"
        );

        const governmentNodes: NodeDatum[] = Object.entries(groupedByGov).map(
          ([govName, govProposals]) => {
            const proposalNodes: NodeDatum[] = govProposals.map((proposal) => {
              const { id, government, proposers } = proposal;
              const proposer = proposers?.[0];
              const party = proposer?.party?.name ?? "無黨籍";
              const name = `${id}\n${government?.name ?? "未知部會"}\n1案`;
              const color = PARTY_COLORS.get(party) || DEFAULT_COLOR;
              const { proposalType, isFrozen } = deriveProposalNodeMeta(proposal);

              return {
                id,
                name,
                value: 1,
                color,
                children: [],
                proposalType,
                isFrozen,
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
          }
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
    const yearA = parseInt(a.id.replace("session-", ""), 10) || 0;
    const yearB = parseInt(b.id.replace("session-", ""), 10) || 0;
    return yearB - yearA;
  });

  return result;
};

export const transformToCategorizedData = (
  data: GetVisualizationProposalsQuery,
  mode: "amount" | "count"
): Record<string, NodeDatum> => {
  const proposals = extractProposals(data);

  // 依 mode 決定是否過濾提案
  const proposalsToProcess =
    mode === "amount"
      ? proposals.filter(
          (p) => (p.freezeAmount ?? 0) + (p.reductionAmount ?? 0) > 0
        )
      : proposals;
  // 第一層：按 government.category 分組
  const groupedByDepartment = groupBy(
    proposalsToProcess,
    (p) => p.government?.name ?? "unknown-government-name"
  );

  return mapValues(groupedByDepartment, (departmentProposals, categoryName) => {
    const proposerNodes: NodeDatum[] = [];
    const freezeProposals = departmentProposals.filter(
      (proposal) => (proposal.freezeAmount ?? 0) > 0
    );
    const reductionProposals = departmentProposals.filter(
      (proposal) => (proposal.reductionAmount ?? 0) > 0
    );
    const mainResolutionProposals = departmentProposals.filter(
      (proposal) =>
        proposal.proposalTypes?.includes(ProposalProposalTypeType.Other) &&
        defaultTo(proposal.freezeAmount, 0) === 0 &&
        defaultTo(proposal.reductionAmount, 0) === 0
    );

    const pushFinancialNode = (
      key: Extract<ProposalVisualizationType, "freeze" | "reduce">,
      proposalsForKey: typeof departmentProposals
    ) => {
      if (!proposalsForKey.length) return;
      const groupedByProposer = groupBy(
        proposalsForKey,
        (p) => p.proposers?.[0]?.id ?? "unknown-proposer"
      );
      forEach(
        entries(groupedByProposer),
        ([proposerId, groupedByProposerProposals]) => {
          const freezeAmount = defaultTo(
            reduce(
              groupedByProposerProposals,
              (acc, cur) => acc + (cur.freezeAmount ?? 0),
              0
            ),
            0
          );
          const reductionAmount = defaultTo(
            reduce(
              groupedByProposerProposals,
              (acc, cur) => acc + (cur.reductionAmount ?? 0),
              0
            ),
            0
          );

          if (freezeAmount <= 0 && reductionAmount <= 0) return;
          const primaryProposer = groupedByProposerProposals[0]?.proposers?.[0];
          const proposerDisplayName = primaryProposer?.name ?? "";
          const proposerPartyName = sanitizePartyName(
            primaryProposer?.party?.name
          );
          const proposerPartyColor =
            primaryProposer?.party?.color ??
            (proposerPartyName
              ? PARTY_COLORS.get(proposerPartyName)
              : undefined) ??
            DEFAULT_COLOR;
          const totalAmount = defaultTo(
            key === "freeze" ? freezeAmount : reductionAmount,
            0
          );
          const amountLabel = formatAmountWithUnit(totalAmount);

          proposerNodes.push({
            id: `proposer-${categoryName}-${proposerId}-${key}`, // 更新 ID，使其更清晰地表示立委節點
            proposalId: undefined, // 將 proposalId 設定為 undefined
            name: buildNodeLabel(
              proposerDisplayName,
              proposerPartyName,
              GROUP_LABELS[key],
              amountLabel
            ),
            value: Math.pow(totalAmount, 0.45),
            color: proposerPartyColor,
            proposerId,
            proposalType: key,
            isFrozen: key === "freeze",
          });

          return;
        }
      );
    };

    if (mode === "amount") {
      pushFinancialNode("freeze", freezeProposals);
      pushFinancialNode("reduce", reductionProposals);
    } else {
      const pushFinancialCountNode = (
        key: Extract<ProposalVisualizationType, "freeze" | "reduce">,
        proposalsForKey: typeof departmentProposals
      ) => {
        if (!proposalsForKey.length) return;
        const groupedByProposer = groupBy(
          proposalsForKey,
          (p) => p.proposers?.[0]?.id ?? "unknown-proposer"
        );
        forEach(
          entries(groupedByProposer),
          ([proposerId, groupedByProposerProposals]) => {
            const totalCount = groupedByProposerProposals.length;
            if (totalCount <= 0) return;

            const primaryProposer =
              groupedByProposerProposals[0]?.proposers?.[0];
            const proposerDisplayName = primaryProposer?.name ?? "";
            const proposerPartyName = sanitizePartyName(
              primaryProposer?.party?.name
            );
            const proposerPartyColor =
              primaryProposer?.party?.color ??
              (proposerPartyName
                ? PARTY_COLORS.get(proposerPartyName)
                : undefined) ??
              DEFAULT_COLOR;

            proposerNodes.push({
              id: `proposer-${categoryName}-${proposerId}-${key}-count`,
              proposalId: undefined,
              name: buildNodeLabel(
                proposerDisplayName,
                proposerPartyName,
                GROUP_LABELS[key],
                `${totalCount}案`
              ),
              value: totalCount,
              color: proposerPartyColor,
              proposerId,
              proposalType: key,
              isFrozen: key === "freeze",
            });
          }
        );
      };

      pushFinancialCountNode("freeze", freezeProposals);
      pushFinancialCountNode("reduce", reductionProposals);

      if (mainResolutionProposals.length > 0) {
        const groupedByProposer = groupBy(
          mainResolutionProposals,
          (p) => p.proposers?.[0]?.id ?? "unknown-proposer"
        );
        forEach(
          entries(groupedByProposer),
          ([proposerId, groupedProposals]) => {
            const totalCount = groupedProposals.length;
            if (totalCount <= 0) return;
            const primaryProposer = groupedProposals[0]?.proposers?.[0];
            const proposerDisplayName = primaryProposer?.name ?? "";
            const proposerPartyName = sanitizePartyName(
              primaryProposer?.party?.name
            );
            const proposerPartyColor =
              primaryProposer?.party?.color ??
              (proposerPartyName
                ? PARTY_COLORS.get(proposerPartyName)
                : undefined) ??
              DEFAULT_COLOR;

            proposerNodes.push({
              id: `proposer-${categoryName}-${proposerId}-main-resolution-count`,
              proposalId: undefined,
              name: buildNodeLabel(
                proposerDisplayName,
                proposerPartyName,
                GROUP_LABELS.other,
                `${totalCount}案`
              ),
              value: totalCount,
              color: proposerPartyColor,
              proposerId,
              proposalType: "main-resolution",
            });
          }
        );
      }
    }

    return {
      id: "root",
      name: "root",
      children: proposerNodes,
    };
  });
};
