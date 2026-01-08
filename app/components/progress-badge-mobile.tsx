import type {
  ProgressBadgeColor,
  ProgressBadgeProps,
} from "./progress-badge";
import {
  PROGRESS_BADGE_COLOR_MAP,
  normalizeProgressPercentage,
} from "./progress-badge";

type ProgressBadgeMobileProps = {
  headerLabel: string;
  badges: ProgressBadgeProps[];
  headerColor?: ProgressBadgeColor;
};

const safeText = (value?: string | null) => value?.trim() || "-";

export default function ProgressBadgeMobile({
  headerLabel,
  badges,
  headerColor,
}: ProgressBadgeMobileProps) {
  if (!badges.length) {
    return null;
  }

  const headerVariant =
    PROGRESS_BADGE_COLOR_MAP[headerColor ?? badges[0]?.color ?? "blue"] ??
    PROGRESS_BADGE_COLOR_MAP.blue;

  return (
    <div
      className="flex w-full flex-col items-center pb-2"
      role="status"
      aria-live="polite"
    >
      <div className="relative z-30 mb-[-8px] flex h-[35px] w-24 shrink-0 items-center justify-center rounded-lg bg-white p-2.5">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-lg border-2 ${headerVariant.border}`}
        />
        <p
          className={`relative shrink-0 whitespace-nowrap text-center text-sm font-bold ${headerVariant.text}`}
        >
          {safeText(headerLabel)}
        </p>
      </div>

      {badges.map((badge, index) => {
        const colors =
          PROGRESS_BADGE_COLOR_MAP[badge.color ?? "pink"] ??
          PROGRESS_BADGE_COLOR_MAP.pink;
        const percentage = normalizeProgressPercentage(badge.percentage);
        return (
          <div
            key={`${badge.label}-${index}`}
            className={`relative mb-[-8px] flex h-9 w-full shrink-0 items-center gap-1 rounded-lg px-3 last:mb-0 ${colors.bg}`}
            style={{ zIndex: 20 - index }}
          >
            <p className="flex-1 whitespace-nowrap text-left text-sm font-medium text-white">
              {safeText(badge.description)}
            </p>
            <div className="flex h-9 w-0 shrink-0 items-center justify-center">
              <div className="rotate-90" aria-hidden="true">
                <svg
                  className="block"
                  width="36"
                  height="2"
                  fill="none"
                  viewBox="0 0 36 2"
                >
                  <line stroke="white" strokeWidth="2" x2="36" y1="1" y2="1" />
                </svg>
              </div>
            </div>
            <p className="min-w-[42px] whitespace-nowrap text-right text-base font-bold text-white">
              {percentage}%
            </p>
          </div>
        );
      })}
    </div>
  );
}
