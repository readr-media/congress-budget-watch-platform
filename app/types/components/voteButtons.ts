import type { Proposal } from "~/graphql/graphql";

export type VoteButtonsProps = {
  proposal: Pick<
    Proposal,
    "id" | "react_good" | "react_angry" | "react_disappoint" | "react_whatever"
  >;
  displayMode?: "inline" | "popup";
};
