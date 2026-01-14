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
  historicalProposalId?: string;
  meetingRecordUrl?: string | null;
  isUnfreeze?: boolean;
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

export const PROPOSAL_TYPE_LABELS: Record<ProposalProposalTypeType, string> = {
  [ProposalProposalTypeTypeEnum.Freeze]: "凍結",
  [ProposalProposalTypeTypeEnum.Reduce]: "減列",
  [ProposalProposalTypeTypeEnum.Other]: "主決議",
};

export const PROPOSAL_RESULT_LABELS: Record<string, string> = {
  passed: "通過",
  rejected: "不通過",
  pending: "待審議",
  reserved: "保留",
  withdrawn: "撤案",
};

export const UNFREEZE_STATUS_LABELS: Record<string, string> = {
  not_reviewed: "尚未審議",
  reviewing: "審議中",
  unfrozen: "已解凍",
};

/**
 * 將 ProposalProposalTypeType 轉換為中文顯示文字
 */
export function getProposalTypeDisplay(
  types?: Array<ProposalProposalTypeType | null> | null
): string {
  const sanitizedTypes = (types ?? []).filter(
    (type): type is ProposalProposalTypeType => Boolean(type)
  );
  if (sanitizedTypes.length === 0) return "未分類";

  return sanitizedTypes
    .map((type) => PROPOSAL_TYPE_LABELS[type] ?? type)
    .join("、");
}

/**
 * 將審議結果轉換為中文顯示文字
 */
export function getResultDisplay(result?: string | null): string {
  if (!result) return "待審議";

  const normalizedResult = result.trim().toLowerCase();
  return PROPOSAL_RESULT_LABELS[normalizedResult] || result;
}

export function getUnfreezeStatusDisplay(status?: string | null): string | null {
  if (!status) return null;
  return UNFREEZE_STATUS_LABELS[status] ?? status ?? "未知狀態";
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

type MeetingCommittee = NonNullable<Meeting["committee"]>[number];

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getLatestCommitteeNameFromMeeting(
  committees?: (MeetingCommittee | null)[] | null,
  fallback = "會議"
): string {
  const latestCommittee = (committees ?? [])
    .filter((committee): committee is MeetingCommittee => Boolean(committee))
    .map((committee) => ({
      committee,
      startDate: toDate(committee.startDate),
    }))
    .filter(
      (
        entry
      ): entry is {
        committee: MeetingCommittee;
        startDate: Date;
      } => Boolean(entry.startDate)
    )
    .reduce<{
      committee: MeetingCommittee;
      startDate: Date;
    } | null>((selected, current) => {
      if (!selected) return current;
      return current.startDate.getTime() > selected.startDate.getTime()
        ? current
        : selected;
    }, null);

  if (latestCommittee) {
    return (
      latestCommittee.committee.name ??
      latestCommittee.committee.displayName ??
      fallback
    );
  }

  return fallback;
}

type TimelineItemWithDate = TimelineItem & { rawDate: Date | null };

function formatMeetingDate(date: Date | null): string {
  if (!date) return "日期未定";
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function normalizeMeetingToTimelineItem(
  meeting: Meeting,
  index: number,
  meetingToHistoricalProposal: Map<string, string>,
  sourceLabel: string
): TimelineItemWithDate {
  const meetingDate = toDate(meeting.meetingDate);
  const fallbackId = `${sourceLabel}-${index}`;
  const meetingId = meeting.id ?? fallbackId;

  return {
    id: meetingId,
    date: formatMeetingDate(meetingDate),
    title: getLatestCommitteeNameFromMeeting(
      meeting.committee,
      mapStageLabel(meeting.type, "會議")
    ),
    historicalProposalId: meeting.id
      ? meetingToHistoricalProposal.get(meeting.id)
      : undefined,
    description: meeting.description || meeting.location || "",
    meetingRecordUrl: meeting.meetingRecordUrl,
    isUnfreeze: meeting.type === "budget_unfreeze",
    rawDate: meetingDate,
  };
}

/**
 * 將 Meeting 陣列轉換為 Timeline 格式
 * 如果沒有 meetings 資料，返回空陣列
 */
export function meetingsToTimeline(
  meetings?: Meeting[] | null,
  historicalProposals?: Proposal["historicalProposals"],
  unfreezeHistory?: Meeting[] | null
): TimelineItem[] {
  const baseMeetings = meetings ?? [];
  const extraMeetings = unfreezeHistory ?? [];
  if (baseMeetings.length === 0 && extraMeetings.length === 0) return [];

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

  const normalizedMeetings = baseMeetings.map((meeting, index) =>
    normalizeMeetingToTimelineItem(
      meeting,
      index,
      meetingToHistoricalProposal,
      "meeting"
    )
  );

  const normalizedUnfreezeHistory = extraMeetings.map(
    (meeting, index) =>
      normalizeMeetingToTimelineItem(
        meeting,
        index,
        meetingToHistoricalProposal,
        "unfreeze"
      )
  );

  return [...normalizedMeetings, ...normalizedUnfreezeHistory]
    .sort((a, b) => {
      if (!a.rawDate && !b.rawDate) return 0;
      if (!a.rawDate) return 1;
      if (!b.rawDate) return -1;
      return b.rawDate.getTime() - a.rawDate.getTime();
    })
    .map(({ rawDate: _rawDate, ...rest }) => rest);
}

type MergedProposalLike = {
  id: string;
  proposers?: Array<{ name?: string | null }> | null;
} | null;

/**
 * 將 mergedProposals / mergedParentProposals 轉換為顯示格式
 * 如果查詢不到母提案資料但當前提案有併案子提案，會自動帶入當前提案為「主」
 */
export function formatMergedProposals(
  mergedProposals?: Array<MergedProposalLike> | null,
  mergedParentProposal?: MergedProposalLike,
  currentProposal?: MergedProposalLike
): MergedProposalInfo[] {
  const normalized: Array<{ raw: MergedProposalLike; isParent: boolean }> = [];

  if (mergedParentProposal?.id) {
    normalized.push({ raw: mergedParentProposal, isParent: true });
  } else if (
    currentProposal?.id &&
    (mergedProposals?.length ?? 0) > 0
  ) {
    normalized.push({ raw: currentProposal, isParent: true });
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
