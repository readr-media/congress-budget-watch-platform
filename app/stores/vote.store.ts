import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type{ Proposal } from "~/graphql/graphql";

export type ReactType =
  | "react_angry"
  | "react_disappoint"
  | "react_good"
  | "react_whatever";

type VoteChanges = {
  newState: Pick<VoteState, "votes" | "votedProposals">;
  apiPayload: { [key in ReactType]?: number };
};

type VoteState = {
  votes: Record<string, Partial<Pick<Proposal, ReactType>>>;
  votedProposals: Record<string, ReactType | null>;
  initVotes: (proposals: Proposal[]) => void;
  calculateVote: (proposalId: string, reactType: ReactType) => VoteChanges;
  vote: (proposalId: string, reactType: ReactType) => void;
  revertVote: (
    originalVotes: VoteState["votes"],
    originalVotedProposals: VoteState["votedProposals"]
  ) => void;
};

export const useVoteStore = create<VoteState>()(
  devtools(
    (set, get) => ({
      votes: {},
      votedProposals: {},
      initVotes: (proposals) => {
        const initialVotes = proposals.reduce((acc, proposal) => {
          acc[proposal.id] = {
            react_angry: proposal.react_angry,
            react_disappoint: proposal.react_disappoint,
            react_good: proposal.react_good,
            react_whatever: proposal.react_whatever,
          };
          return acc;
        }, {} as VoteState["votes"]);
        set({ votes: initialVotes });
      },
      calculateVote: (proposalId, reactType) => {
        const state = get();
        const currentVote = state.votedProposals[proposalId];
        const newVotes = { ...state.votes };
        const newVotedProposals = { ...state.votedProposals };
        const apiPayload: { [key in ReactType]?: number } = {};

        const proposalVotes = { ...newVotes[proposalId] };

        // If voting for the same type again, unvote it
        if (currentVote === reactType) {
          const newCount = (proposalVotes[reactType] ?? 1) - 1;
          proposalVotes[reactType] = newCount;
          apiPayload[reactType] = newCount;
          newVotedProposals[proposalId] = null;
        } else {
          // If there was a previous vote, decrement it
          if (currentVote) {
            const newPrevCount = (proposalVotes[currentVote] ?? 1) - 1;
            proposalVotes[currentVote] = newPrevCount;
            apiPayload[currentVote] = newPrevCount;
          }
          // Increment the new vote
          const newCurrentCount = (proposalVotes[reactType] ?? 0) + 1;
          proposalVotes[reactType] = newCurrentCount;
          apiPayload[reactType] = newCurrentCount;
          newVotedProposals[proposalId] = reactType;
        }

        newVotes[proposalId] = proposalVotes;

        return {
          newState: { votes: newVotes, votedProposals: newVotedProposals },
          apiPayload,
        };
      },
      vote: (proposalId, reactType) => {
        const { newState } = get().calculateVote(proposalId, reactType);
        set(newState);
      },
      revertVote: (originalVotes, originalVotedProposals) => {
        set({
          votes: originalVotes,
          votedProposals: originalVotedProposals,
        });
      },
    }),
    { name: "vote-store" }
  )
);
