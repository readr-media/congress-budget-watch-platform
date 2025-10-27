import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import cloneDeep from "lodash/cloneDeep";

export type ReactType =
  | "react_angry"
  | "react_disappoint"
  | "react_good"
  | "react_whatever";

type VoteStoreState = {
  votes: Record<string, ReactType>;
};

type VoteStoreActions = {
  setVote: (proposalId: string, vote: ReactType | null) => void;
};

type VoteStore = {
  state: VoteStoreState;
  actions: VoteStoreActions;
};

const DEFAULT_STATE: VoteStoreState = {
  votes: {},
};

const getDefaultState = (): VoteStoreState => cloneDeep(DEFAULT_STATE);

export const useVoteStore = create<VoteStore>()(
  devtools(
    persist(
      immer<VoteStore>((set) => ({
        state: getDefaultState(),
        actions: {
          setVote: (proposalId, vote) =>
            set(
              (draft) => {
                if (vote === null) {
                  delete draft.state.votes[proposalId];
                } else {
                  draft.state.votes[proposalId] = vote;
                }
              }
            ),
        },
      })),
      {
        name: "vote-storage",
        partialize: (store) => ({ state: { votes: store.state.votes } }),
      }
    ),
    {
      name: "vote-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

export const useUserVotes = () => useVoteStore((store) => store.state.votes);
export const useVoteActions = () => useVoteStore((store) => store.actions);
