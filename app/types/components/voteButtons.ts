import type { Proposal } from "~/graphql/graphql";
import type { ReactionType } from "../store/vote";

export type ReactionIconVariant = "default" | "hover" | "active";

export type ReactionIcons = Record<
  ReactionType,
  Record<ReactionIconVariant, string>
>;

export type VoteButtonsProps = {
  proposal: Pick<
    Proposal,
    "id" | "react_good" | "react_angry" | "react_disappoint" | "react_whatever"
  >;
  displayMode?: "inline" | "popup";
};
