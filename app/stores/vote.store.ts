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
  pending: {},
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

const ensurePendingMap = (state: VoteStoreState) => {
  if (!state.pending) {
    state.pending = {};
  }
  return state.pending;
};

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
              const pendingMap = ensurePendingMap(draft.state);
              const pending = pendingMap[proposal.id];
              const hasPending =
                pending && Object.keys(pending).length > 0;
              if (
                !(proposal.id in draft.state.votes) ||
                !hasPending
              ) {
                draft.state.votes[proposal.id] = toVoteCounts(proposal);
              }
            });
          },
          queueVote: (proposalId: string, reaction: ReactionType) =>
            set((draft) => {
              const pendingMap = ensurePendingMap(draft.state);
              if (!(proposalId in draft.state.votes)) {
                draft.state.votes[proposalId] = createEmptyCounts();
              }
              draft.state.votes[proposalId][reaction] += 1;
              if (!(proposalId in pendingMap)) {
                pendingMap[proposalId] = {};
              }
              pendingMap[proposalId][reaction] = true;
            }),
          setProposalCounts: (proposalId: string, counts: VoteCounts) =>
            set((draft) => {
              draft.state.votes[proposalId] = { ...createEmptyCounts(), ...counts };
            }),
          refreshProposalCounts: (proposalId: string) =>
            set((draft) => {
              const current = draft.state.votes[proposalId];
              if (current) {
                draft.state.votes[proposalId] = { ...current };
              }
            }),
          removePendingReactions: (proposalId: string, reactions: ReactionType[]) =>
            set((draft) => {
              const pendingMap = ensurePendingMap(draft.state);
              const pending = pendingMap[proposalId];
              if (!pending) return;
              reactions.forEach((reaction) => {
                delete pending[reaction];
              });
              if (Object.keys(pending).length === 0) {
                delete draft.state.pending[proposalId];
              }
            }),
          clearProposalPending: (proposalId: string) =>
            set((draft) => {
              const pendingMap = ensurePendingMap(draft.state);
              delete pendingMap[proposalId];
            }),
        },
      })),
      {
        name: "vote-storage",
        partialize: (store) => ({
          state: { votes: store.state.votes, pending: store.state.pending },
        }),
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
export const usePendingVotes = () => useVoteStore((store) => store.state.pending);
