import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type ReactType =
  | "react_angry"
  | "react_disappoint"
  | "react_good"
  | "react_whatever";

type VoteState = {
  // Stores the user's vote for each proposal.
  // e.g., { 'proposal-123': 'react_good' }
  votes: Record<string, ReactType>;
  actions: {
    setVote: (proposalId: string, vote: ReactType | null) => void;
  };
};

export const useVoteStore = create<VoteState>()(
  devtools(
    persist(
      (set) => ({
        votes: {},
        actions: {
          setVote: (proposalId, vote) => {
            console.log("setVote", proposalId, vote);
            set(
              (state) => {
                const newVotes = { ...state.votes };
                if (vote === null) {
                  delete newVotes[proposalId];
                } else {
                  newVotes[proposalId] = vote;
                }
                return { votes: newVotes };
              },
              false,
              "vote/setVote"
            );
          },
        },
      }),
      {
        name: "vote-storage",
        partialize: (state) => ({ votes: state.votes }),
      }
    ),
    { name: "vote-store" }
  )
);

export const useUserVotes = () => useVoteStore((state) => state.votes);
export const useVoteActions = () => useVoteStore((state) => state.actions);
