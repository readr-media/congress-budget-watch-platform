import type {
  Meeting,
  Proposal,
  ProposalProposalTypeType,
} from "~/graphql/graphql";
import { ProposalProposalTypeType as ProposalProposalTypeTypeEnum } from "~/graphql/graphql";
import { mapStageLabel } from "~/utils/stage";

/**
 * Timeline 元件所需的資料格式
 */
export type TimelineItem = {
  id: number | string;
  date: string;
  title: string;
  description: string;
};

/**
 * 併案資訊的資料格式
 */
export type MergedProposalInfo = {
  id: string;
  date: string;
  proposers: string;
  isParent?: boolean;
};

/**
 * 將 ProposalProposalTypeType 轉換為中文顯示文字
 */
export function getProposalTypeDisplay(
  types?: Array<ProposalProposalTypeType> | null
): string {
  if (!types || types.length === 0) return "未分類";

  const typeMap: Record<ProposalProposalTypeType, string> = {
    [ProposalProposalTypeTypeEnum.Freeze]: "凍結",
    [ProposalProposalTypeTypeEnum.Reduce]: "減列",
    [ProposalProposalTypeTypeEnum.Other]: "其他",
  };

  return types.map((t) => typeMap[t] || t).join("、");
}

/**
 * 將審議結果轉換為中文顯示文字
 */
export function getResultDisplay(result?: string | null): string {
  if (!result) return "待審議";

  // 根據實際 API 回傳的值來調整
  const resultMap: Record<string, string> = {
    passed: "通過",
    rejected: "不通過",
    pending: "待審議",
  };

  return resultMap[result] || result;
}

/**
 * 格式化數字為千分位格式
 */
export function formatNumber(num?: number | null): string {
  if (num === null || num === undefined) return "無預算金額";
  if (num === 0) return "0";

  if (Math.abs(num) < 10000) {
    return num.toLocaleString("zh-TW");
  }

  const formatWithUnit = (value: number, unit: string) => {
    const formatted = value.toFixed(1);
    const normalized = formatted.endsWith(".0")
      ? formatted.slice(0, -2)
      : formatted;
    return `${normalized} ${unit}`;
  };

  const inYi = num / 1_0000_0000;
  if (Math.abs(inYi) >= 1) {
    return formatWithUnit(inYi, "億");
  }

  const inWan = num / 1_0000;
  return formatWithUnit(inWan, "萬");
}

/**
 * 格式化減列與凍結金額
 */
export function formatReducedAndFrozenAmount(
  reduced?: number | null,
  frozen?: number | null
): string {
  const formattedReduced = reduced ? formatNumber(reduced) : "0";
  const formattedFrozen = frozen ? formatNumber(frozen) : "0";

  if (formattedReduced === "0" && formattedFrozen === "0") return "0";

  return `${formattedReduced} / ${formattedFrozen}`;
}

/**
 * 將 Meeting 陣列轉換為 Timeline 格式
 * 如果沒有 meetings 資料，返回空陣列
 */
export function meetingsToTimeline(
  meetings?: Meeting[] | null,
  historicalProposals?: Proposal["historicalProposals"]
): TimelineItem[] {
  if (!meetings || meetings.length === 0) return [];

  const meetingToHistoricalProposal = new Map<string, string>();
  (historicalProposals ?? []).forEach((historicalProposal) => {
    if (!historicalProposal?.id) return;
    (historicalProposal.meetings ?? []).forEach((historicalMeeting) => {
      if (historicalMeeting?.id) {
        meetingToHistoricalProposal.set(
          historicalMeeting.id,
          historicalProposal.id
        );
      }
    });
  });

  return meetings.map((meeting, index) => ({
    id: meeting.id || index,
    date: meeting.meetingDate
      ? new Date(meeting.meetingDate).toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "日期未定",
    title: mapStageLabel(meeting.type, "會議"),
    historicalProposalId: meeting.id
      ? meetingToHistoricalProposal.get(meeting.id)
      : undefined,
    description: meeting.description || meeting.location || "",
  }));
}

type MergedProposalLike = {
  id: string;
  proposers?: Array<{ name?: string | null }> | null;
} | null;

/**
 * 將 mergedProposals / mergedParentProposals 轉換為顯示格式
 */
export function formatMergedProposals(
  mergedProposals?: Array<MergedProposalLike> | null,
  mergedParentProposal?: MergedProposalLike
): MergedProposalInfo[] {
  const normalized: Array<{ raw: MergedProposalLike; isParent: boolean }> = [];

  if (mergedParentProposal?.id) {
    normalized.push({ raw: mergedParentProposal, isParent: true });
  }

  if (mergedProposals && mergedProposals.length > 0) {
    mergedProposals.forEach((proposal) => {
      if (proposal?.id) {
        normalized.push({ raw: proposal, isParent: false });
      }
    });
  }

  if (normalized.length === 0) return [];

  return normalized.map(({ raw, isParent }, index) => ({
    id: raw?.id ?? `unknown-${index}`,
    date: "2025/08/01", // TODO: 如果 API 有提供日期，使用實際日期
    proposers:
      raw?.proposers
        ?.map((p) => p?.name)
        .filter(Boolean)
        .join("、") || "未知",
    isParent,
  }));
}

/**
 * 組合科目/計畫字串
 */
export function formatBudgetCategory(
  majorCategory?: string | null,
  mediumCategory?: string | null,
  minorCategory?: string | null
): string {
  const parts = [majorCategory, mediumCategory, minorCategory].filter(Boolean);

  if (parts.length === 0) return "暫無科目計畫";

  return parts.join(" > ");
}

/**
 * 判斷是否有併案：只要 併案子提案單mergedProposals、併案母提案單mergedParentProposals 任一個有值，就是
 */
export function hasMergedProposals(proposal?: Proposal | null): boolean {
  if (!proposal) return false;

  const hasParent = Boolean(proposal.mergedParentProposals?.id);
  const hasChildren = (proposal.mergedProposals?.length ?? 0) > 0;

  return hasParent || hasChildren;
}
/**
 * 判斷是否為主提案：只要 併案母提案單historicalParentProposals 有值，就是
 */
export function hasHistoricalProposals(proposal?: Proposal | null): boolean {
  if (!proposal) return false;

  return Boolean(proposal.historicalParentProposals?.id);
}
