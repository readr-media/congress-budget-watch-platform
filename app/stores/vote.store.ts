import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import cloneDeep from "lodash/cloneDeep";
import type {
  VoteStore,
  VoteStoreState,
  VoteCounts,
  ReactionType,
} from "~/types/store/vote";
import type { Proposal } from "~/graphql/graphql";

const DEFAULT_STATE: VoteStoreState = {
  votes: {},
};

// 建立新的instance
const getDefaultState = (): VoteStoreState => cloneDeep(DEFAULT_STATE);

const createEmptyCounts = (): VoteCounts => ({
  react_good: 0,
  react_angry: 0,
  react_disappoint: 0,
  react_whatever: 0,
});

const toVoteCounts = (
  proposal: Pick<
    Proposal,
    "react_good" | "react_angry" | "react_disappoint" | "react_whatever"
  >
): VoteCounts => ({
  react_good: proposal.react_good ?? 0,
  react_angry: proposal.react_angry ?? 0,
  react_disappoint: proposal.react_disappoint ?? 0,
  react_whatever: proposal.react_whatever ?? 0,
});

export const useVoteStore = create<VoteStore>()(
  devtools(
    persist(
      immer<VoteStore>((set) => ({
        state: getDefaultState(),
        actions: {
          initProposal: (
            proposal: Pick<
              Proposal,
              | "id"
              | "react_good"
              | "react_angry"
              | "react_disappoint"
              | "react_whatever"
            >
          ) => {
            set((draft) => {
              draft.state.votes[proposal.id] = toVoteCounts(proposal);
            });
          },
          incrementVote: (proposalId: string, reaction: ReactionType) =>
            set((draft) => {
              if (!(proposalId in draft.state.votes)) {
                draft.state.votes[proposalId] = createEmptyCounts();
              }
              draft.state.votes[proposalId][reaction] += 1;
            }),
          setProposalCounts: (proposalId: string, counts: VoteCounts) =>
            set((draft) => {
              draft.state.votes[proposalId] = { ...createEmptyCounts(), ...counts };
            }),
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

export const useVoteActions = () => useVoteStore((store) => store.actions);
export const useProposalVoteCounts = (proposalId: string) =>
  useVoteStore((store) => store.state.votes[proposalId]);
