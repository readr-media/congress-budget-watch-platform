import { useState } from "react";
import type { Proposal } from "~/graphql/graphql";
import {
  useVoteActions,
  useUserVotes,
  type ReactType,
} from "~/stores/vote.store";
import { useVoteMutation } from "~/queries/use-vote-mutation";
import { formatNumber } from "~/budget-detail/helpers";
import Image from "./image";
import { useToggle, useOnClickOutside } from "usehooks-ts";
import { useRef, type RefObject } from "react";

const VOTE_OPTIONS: { type: ReactType; label: string; icon: string }[] = [
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

type VoteCounts = Record<ReactType, number>;

interface VoteButtonsProps {
  proposal: Pick<
    Proposal,
    "id" | "react_good" | "react_angry" | "react_disappoint" | "react_whatever"
  >;
  displayMode?: "inline" | "popup";
}

export function VoteButtons({
  proposal,
  displayMode = "inline",
}: VoteButtonsProps) {
  const userVotes = useUserVotes();
  const { setVote } = useVoteActions();
  const voteMutation = useVoteMutation();

  const [isVoteMenuOpen, toggleIsVoteMenuOpen, setVoteMenuOpen] = useToggle();
  const voteMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutsideVoteMenu = () => {
    setVoteMenuOpen(false);
  };

  useOnClickOutside(
    voteMenuRef as RefObject<HTMLElement>,
    handleClickOutsideVoteMenu
  );

  const [voteCounts, setVoteCounts] = useState<VoteCounts>({
    react_good: proposal.react_good ?? 0,
    react_angry: proposal.react_angry ?? 0,
    react_disappoint: proposal.react_disappoint ?? 0,
    react_whatever: proposal.react_whatever ?? 0,
  });

  const currentUserVote = userVotes[proposal.id] ?? null;

  const handleVote = (newVoteType: ReactType) => {
    const previousUserVote = currentUserVote;

    // Optimistic UI Update
    const newVoteCounts = { ...voteCounts };
    let newUserVote: ReactType | null = newVoteType;

    if (previousUserVote) {
      newVoteCounts[previousUserVote] -= 1;
    }

    if (previousUserVote === newVoteType) {
      // Unvoting
      newUserVote = null;
    } else {
      // New vote or changing vote
      newVoteCounts[newVoteType] += 1;
    }

    setVoteCounts(newVoteCounts);
    setVote(proposal.id, newUserVote);

    // Backend Mutation
    const apiPayload: Partial<VoteCounts> = {};
    if (previousUserVote) {
      apiPayload[previousUserVote] = newVoteCounts[previousUserVote];
    }
    if (newUserVote) {
      apiPayload[newUserVote] = newVoteCounts[newUserVote];
    }

    if (displayMode === "popup") {
      toggleIsVoteMenuOpen();
    }

    voteMutation.mutate(
      { proposalId: proposal.id, apiPayload },
      {
        onSuccess: () => {
          // Optional: You might want to refetch proposal data on success
          // to ensure full consistency with the backend.
          // This is often handled by invalidating queries in the mutation's onSettled callback.
        },
        onError: () => {
          // Rollback on error
          // The state is already captured in closures, so we can directly use them.
          const rolledBackCounts = { ...voteCounts };
          if (previousUserVote) {
            rolledBackCounts[previousUserVote] += 1;
          }
          if (newUserVote && newUserVote !== previousUserVote) {
            rolledBackCounts[newUserVote] -= 1;
          }
          setVoteCounts(rolledBackCounts);
          setVote(proposal.id, previousUserVote);
          // Optional: Add user notification
        },
      }
    );
  };

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
                  currentUserVote === type ? "shadow-lg" : ""
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
            currentUserVote === type
              ? "scale-105 shadow-lg"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Image
            src={icon}
            alt={
              VOTE_OPTIONS.find((opt) => opt.type === type)?.label ??
              'Vote option image'
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
