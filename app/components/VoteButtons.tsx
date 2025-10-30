import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useToggle, useOnClickOutside } from "usehooks-ts";
import Image from "./image";
import { formatNumber } from "~/budget-detail/helpers";
import {
  useVoteActions,
  useProposalVoteCounts,
} from "~/stores/vote.store";
import { useVoteQueue } from "~/queries/use-vote-queue";
import type { ReactionType, VoteCounts } from "~/types/store/vote";
import type { VoteButtonsProps } from "~/types/components/voteButtons";

const VOTE_OPTIONS: { type: ReactionType; label: string; icon: string }[] = [
  { type: "react_good", label: "我覺得很讚", icon: "/image/vote-good.svg" },
  { type: "react_angry", label: "我感到生氣", icon: "/image/vote-angry.svg" },
  {
    type: "react_disappoint",
    label: "我有點失望",
    icon: "/image/vote-sad.svg",
  },
  {
    type: "react_whatever",
    label: "我不在意",
    icon: "/image/vote-neutral.svg",
  },
];

export function VoteButtons({
  proposal,
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

  const [selectedReaction, setSelectedReaction] =
    useState<ReactionType | null>(null);

  const handleVote = (reaction: ReactionType) => {
    setSelectedReaction(reaction);
    queueVote(proposalId, reaction);

    if (displayMode === "popup") {
      toggleIsVoteMenuOpen();
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
      <div
        ref={voteMenuRef}
        className="relative rounded-sm border-2 bg-white px-0.5 py-1 text-[8px]"
      >
        <span
          onClick={(e) => {
            e.preventDefault();
            toggleIsVoteMenuOpen();
          }}
          className="cursor-pointer"
        >
          請支援心情
        </span>
        {isVoteMenuOpen && (
          <div className="md: absolute right-0 bottom-0 z-10 w-[69px] rounded-[24px] border-2 bg-white p-2.5 text-[9px] md:translate-x-8 md:translate-y-[10.5rem] lg:translate-x-11 lg:translate-y-[10.5rem]">
            {VOTE_OPTIONS.map(({ type, label, icon }) => (
              <div
                key={type}
                onClick={() => handleVote(type)}
                className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center first:mt-0 ${
                  selectedReaction === type ? "shadow-lg" : ""
                }`}
              >
                <Image src={icon} alt={label} className="w-12" />
                <p>{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-2">
      {VOTE_OPTIONS.map(({ type, icon }) => (
        <button
          key={type}
          onClick={() => handleVote(type)}
          className={`flex h-20 w-20 flex-col items-center justify-center rounded-lg p-2 transition-all duration-200 sm:h-24 sm:w-24 ${
            selectedReaction === type
              ? "scale-105 shadow-lg"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Image
            src={icon}
            alt={
              VOTE_OPTIONS.find((opt) => opt.type === type)?.label ??
              "Vote option image"
            }
            className="mb-1 h-8 w-8 sm:h-10 sm:w-10"
          />
          <span className="text-xs font-medium sm:text-sm">
            {formatNumber(voteCounts[type])}
          </span>
        </button>
      ))}
    </div>
  );
}
