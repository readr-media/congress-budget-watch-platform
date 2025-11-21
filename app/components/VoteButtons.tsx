import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useToggle, useOnClickOutside } from "usehooks-ts";
import Image from "./image";
import { formatNumber } from "~/budget-detail/helpers";
import { useVoteActions, useProposalVoteCounts } from "~/stores/vote.store";
import { useVoteQueue } from "~/queries/use-vote-queue";
import type { ReactionType, VoteCounts } from "~/types/store/vote";
import type {
  ReactionIcons,
  VoteButtonsProps,
} from "~/types/components/voteButtons";

const REACTION_ICONS: ReactionIcons = {
  react_good: {
    default: "/image/vote-good-default.svg",
    hover: "/image/vote-good-hover.svg",
    active: "/image/vote-good-active.svg",
  },
  react_angry: {
    default: "/image/vote-angry-default.svg",
    hover: "/image/vote-angry-hover.svg",
    active: "/image/vote-angry-active.svg",
  },
  react_disappoint: {
    default: "/image/vote-sad-default.svg",
    hover: "/image/vote-sad-hover.svg",
    active: "/image/vote-sad-active.svg",
  },
  react_whatever: {
    default: "/image/vote-whatever-default.svg",
    hover: "/image/vote-whatever-hover.svg",
    active: "/image/vote-whatever-active.svg",
  },
};

const VOTE_OPTIONS: { type: ReactionType; label: string }[] = [
  { type: "react_good", label: "我覺得很讚" },
  { type: "react_angry", label: "我感到生氣" },
  { type: "react_disappoint", label: "我有點失望" },
  { type: "react_whatever", label: "我不在意" },
];

export function VoteButtons({
  proposal,
  shouldShowCount = true,
  singleButtonStyle = "",
  displayMode = "inline",
}: VoteButtonsProps) {
  const { initProposal, queueVote } = useVoteActions();
  const { scheduleFlush, flushPending, cancelScheduledFlush } = useVoteQueue();

  const [isVoteMenuOpen, toggleIsVoteMenuOpen, setVoteMenuOpen] = useToggle();
  const voteMenuRef = useRef<HTMLDivElement>(null);

  const {
    id: proposalId,
    react_good,
    react_angry,
    react_disappoint,
    react_whatever,
  } = proposal;

  const handleClickOutsideVoteMenu = () => {
    setVoteMenuOpen(false);
    setHoveredReaction(null);
    cancelScheduledFlush();
    void flushPending();
  };

  useOnClickOutside(
    voteMenuRef as RefObject<HTMLElement>,
    handleClickOutsideVoteMenu
  );

  const initialCounts = useMemo<VoteCounts>(
    () => ({
      react_good: react_good ?? 0,
      react_angry: react_angry ?? 0,
      react_disappoint: react_disappoint ?? 0,
      react_whatever: react_whatever ?? 0,
    }),
    [react_good, react_angry, react_disappoint, react_whatever]
  );

  const storeVoteCounts = useProposalVoteCounts(proposalId);
  const voteCounts = storeVoteCounts ?? initialCounts;

  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(
    null
  );
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType | null>(
    null
  );

  const getReactionIcon = (reaction: ReactionType) => {
    if (selectedReaction === reaction) {
      return REACTION_ICONS[reaction].active;
    }
    if (hoveredReaction === reaction) {
      return REACTION_ICONS[reaction].hover;
    }
    return REACTION_ICONS[reaction].default;
  };

  const handleVote = (reaction: ReactionType) => {
    setSelectedReaction(reaction);
    queueVote(proposalId, reaction);
    setHoveredReaction(null);

    if (displayMode === "popup") {
      setVoteMenuOpen(false);
      cancelScheduledFlush();
      void flushPending();
    } else {
      scheduleFlush();
    }
  };

  useEffect(() => {
    initProposal({
      id: proposalId,
      react_good,
      react_angry,
      react_disappoint,
      react_whatever,
    });
  }, [
    initProposal,
    proposalId,
    react_good,
    react_angry,
    react_disappoint,
    react_whatever,
  ]);

  if (displayMode === "popup") {
    return (
      <div ref={voteMenuRef} className="relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleIsVoteMenuOpen();
          }}
          className={`flex h-8 min-w-[68px] cursor-pointer items-center justify-center rounded-sm border-2 bg-white text-[8px] ${
            selectedReaction ? "border-transparent" : "px-2 py-1"
          }`}
        >
          {selectedReaction ? (
            <Image
              src={getReactionIcon(selectedReaction)}
              alt="Selected reaction"
              className="h-full w-auto"
            />
          ) : (
            <span>請支援心情</span>
          )}
        </button>
        {isVoteMenuOpen && (
          <div className="right-0 bottom-0 z-10 w-[69px] rounded-[24px] border-2 bg-white p-2.5 text-[9px] md:absolute md:translate-x-8 md:translate-y-[10.5rem] lg:translate-x-11 lg:translate-y-[10.5rem]">
            {VOTE_OPTIONS.map(({ type, label }) => (
              <div
                key={type}
                onClick={() => handleVote(type)}
                onMouseEnter={() => setHoveredReaction(type)}
                onMouseLeave={() =>
                  setHoveredReaction((current) =>
                    current === type ? null : current
                  )
                }
                className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center first:mt-0 ${
                  selectedReaction === type ? "shadow-lg" : ""
                }`}
              >
                <Image
                  src={getReactionIcon(type)}
                  alt={label}
                  className="w-12"
                />
                <p>{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  console.log({ singleButtonStyle });
  return (
    <div className="flex justify-center gap-4 px-3 py-2.5">
      {VOTE_OPTIONS.map(({ type, label }) => (
        <div
          key={type}
          className={`flex flex-col items-center text-center ${singleButtonStyle}`}
          onMouseEnter={() => setHoveredReaction(type)}
          onMouseLeave={() =>
            setHoveredReaction((current) => (current === type ? null : current))
          }
        >
          <p className="text-sm font-medium">{label}</p>
          {shouldShowCount && (
            <p className="font-base text-base">
              {formatNumber(voteCounts[type])}
            </p>
          )}
          <button
            type="button"
            onClick={() => handleVote(type)}
            className={`mt-3 flex w-full items-center justify-center rounded-lg bg-transparent transition-opacity ${
              selectedReaction === type ? "opacity-100" : "opacity-80"
            }`}
          >
            <Image
              src={getReactionIcon(type)}
              alt={label}
              className="max-w-full"
            />
          </button>
        </div>
      ))}
    </div>
  );
}
