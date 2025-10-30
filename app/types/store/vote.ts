import type { Proposal } from "~/graphql/graphql";

export type ReactionType =
  | "react_angry"
  | "react_disappoint"
  | "react_good"
  | "react_whatever";

export type VoteCounts = Record<ReactionType, number>;

export type VoteStoreState = {
  votes: Record<string, VoteCounts>;
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
  incrementVote: (proposalId: string, reaction: ReactionType) => void;
  setProposalCounts: (proposalId: string, counts: VoteCounts) => void;
};

export type VoteStore = {
  state: VoteStoreState;
  actions: VoteStoreActions;
};
