import { useNavigate } from "react-router";

export type TimelineItemData = {
  id: string | number;
  date: string;
  title: string;
  historicalProposalId?: string;
  meetingRecordUrl?: string | null;
  isUnfreeze?: boolean;
};

type TimelineItemProps = TimelineItemData & {
  isLast?: boolean;
  isFirst?: boolean;
};

const TimelineConnector = () => <hr className="w-0.5 bg-black" />;

export const TimelineItem = ({
  date,
  title,
  isFirst,
  isLast,
  historicalProposalId,
  meetingRecordUrl,
  isUnfreeze,
}: TimelineItemProps & { isLast?: boolean }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!historicalProposalId) return;
    navigate(`/budget/${historicalProposalId}`);
  };

  return (
    <li className="min-h-16">
      {!isFirst && <TimelineConnector />}
      <div className="timeline-middle">
        <div
          className={`h-3 w-3 ${isUnfreeze ? "rotate-45 bg-brand-primary" : "rounded-full bg-black"}`}
          aria-hidden="true"
        />
      </div>
      <div className="timeline-end rounded-xl bg-transparent px-6 py-4 md:px-0">
        <div className="flex items-center justify-between md:w-[200px] md:max-w-[200px]">
          <div className="min-w-0 text-gray-900">
            {meetingRecordUrl ? (
              <a
                href={meetingRecordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="md:text-md inline-block text-base leading-7 font-normal hover:underline md:leading-8"
              >
                <div className="flex flex-col">
                  <time className="font-inherit leading-inherit align-middle text-inherit lg:underline">
                    {date}
                  </time>
                  <div className="flex items-start gap-1">
                    {isUnfreeze && (
                      <span className="shrink-0 align-middle font-bold text-brand-primary">
                        【解凍案】
                      </span>
                    )}
                    <span className="align-middle">{title}</span>
                  </div>
                </div>
              </a>
            ) : (
              <div className="md:text-md flex flex-col text-base leading-7 font-normal md:leading-8">
                <time className="font-inherit leading-inherit align-middle text-inherit lg:underline">
                  {date}
                </time>
                <div className="flex items-start gap-1">
                  {isUnfreeze && (
                    <span className="shrink-0 align-middle font-bold text-brand-primary">
                      【解凍案】
                    </span>
                  )}
                  <span className="align-middle">{title}</span>
                </div>
              </div>
            )}
          </div>
          {historicalProposalId && (
            <button
              type="button"
              onClick={handleNavigate}
              className="ml-4 shrink-0 rounded-lg border border-black bg-white p-1 text-sm font-medium text-neutral-500 md:max-w-[44px] md:px-0 md:text-xs"
            >
              看版本變更
            </button>
          )}
        </div>
      </div>
      {!isLast && <TimelineConnector />}
    </li>
  );
};
