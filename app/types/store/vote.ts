import type { Proposal } from "~/graphql/graphql";

export type ReactionType =
  | "react_angry"
  | "react_disappoint"
  | "react_good"
  | "react_whatever";

export type VoteCounts = Record<ReactionType, number>;

export type VoteStoreState = {
  votes: Record<string, VoteCounts>;
  pending: Record<string, Partial<Record<ReactionType, boolean>>>;
};

export type VoteStoreActions = {
  initProposal: (
    proposal: Pick<
      Proposal,
      | "id"
      | "react_good"
      | "react_angry"
      | "react_disappoint"
      | "react_whatever"
    >
  ) => void;
  queueVote: (proposalId: string, reaction: ReactionType) => void;
  setProposalCounts: (proposalId: string, counts: VoteCounts) => void;
  removePendingReactions: (
    proposalId: string,
    reactions: ReactionType[]
  ) => void;
  clearProposalPending: (proposalId: string) => void;
};

export type VoteStore = {
  state: VoteStoreState;
  actions: VoteStoreActions;
};
