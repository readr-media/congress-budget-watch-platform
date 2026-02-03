export const PROGRESS_BADGE_COLOR_MAP = {
  pink: {
    border: "border-[#e9808e]",
    text: "text-[#e9808e]",
    bg: "bg-[#e9808e]",
  },
  blue: {
    border: "border-[#3e51ff]",
    text: "text-[#3e51ff]",
    bg: "bg-[#3e51ff]",
  },
} as const;

export type ProgressBadgeColor = keyof typeof PROGRESS_BADGE_COLOR_MAP;

export type ProgressBadgeProps = {
  label: string;
  description?: string | null;
  percentage?: number | null;
  color?: ProgressBadgeColor;
};

export const normalizeProgressPercentage = (
  value?: number | null
): number => {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(Number(value));
  return Math.min(100, Math.max(0, rounded));
};

const safeText = (value?: string | null) => value?.trim() || "-";

function ProgressBadge({
  label,
  description,
  percentage,
  color = "pink",
}: ProgressBadgeProps) {
  const colors = PROGRESS_BADGE_COLOR_MAP[color] ?? PROGRESS_BADGE_COLOR_MAP.pink;
  const text = safeText(description);
  const normalizedPercentage = normalizeProgressPercentage(percentage);
  const badgeLabel = safeText(label);

  return (
    <div
      className="flex h-[35px] w-full items-center gap-0"
      role="status"
      aria-live="polite"
    >
      {/* Label Section */}
      <div
        className={`relative flex items-center justify-center rounded-l-[8px] border-2 bg-white ${colors.border} h-full min-w-[124px] px-[10px]`}
      >
        <p
          className={`font-['Noto_Sans_TC:Bold',sans-serif] text-[16px] font-bold ${colors.text} text-nowrap`}
        >
          {badgeLabel}
        </p>
      </div>

      {/* Progress Bar Section */}
      <div
        className={`relative flex items-center ${colors.bg} h-full flex-1 px-4`}
      >
        <p className="overflow-hidden w-full text-center text-[16px] font-medium text-nowrap text-ellipsis text-white">
          {text}
        </p>
      </div>

      {/* Separator Line */}
      <div
        className={`flex items-center justify-center ${colors.bg} h-full w-[2px]`}
      >
        <div className="h-[35px] w-[2px] bg-white" />
      </div>

      {/* Percentage Section */}
      <div
        className={`flex items-center justify-center ${colors.bg} h-full min-w-[79px] rounded-r-[8px] px-4`}
      >
        <p className="font-['Noto_Sans_TC:Bold',sans-serif] text-[20px] font-bold text-nowrap text-white">
          {normalizedPercentage}%
        </p>
      </div>
    </div>
  );
}

export default ProgressBadge;
