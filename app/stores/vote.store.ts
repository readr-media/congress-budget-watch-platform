import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type VoteState = {
  votes: Record<string, string>;
  actions: {
    setVote: (proposalId: string, vote: string) => void;
  };
};

export const useVoteStore = create<VoteState>()(
  immer((set) => ({
    votes: {},
    actions: {
      setVote: (proposalId, vote) =>
        set((state) => {
          state.votes[proposalId] = vote;
        }),
    },
  }))
);

export const useVotes = () => useVoteStore((state) => state.votes);
export const useVoteActions = () => useVoteStore((state) => state.actions);
