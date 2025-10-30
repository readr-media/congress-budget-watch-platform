import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UPDATE_PROPOSAL_REACTS } from "./proposal.queries";
import { execute } from "~/graphql/execute";
import type { ReactionType } from "~/types/store/vote";

export interface VoteVariables {
  proposalId: string;
  apiPayload: Partial<Record<ReactionType, number>>;
}

export const useVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proposalId, apiPayload }: VoteVariables) => {
      return execute(UPDATE_PROPOSAL_REACTS, {
        where: { id: proposalId },
        data: apiPayload,
      });
    },
    onSettled: (_data, _error, variables) => {
      // After mutation, refetch the specific proposal to get the source of truth from the server.
      queryClient.invalidateQueries({
        queryKey: ["proposal", variables.proposalId],
      });
      // Also invalidate the list query, in case vote counts are shown there.
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
};
