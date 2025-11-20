import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UPDATE_PROPOSAL_REACTS } from "./proposal.queries";
import { useVoteStore } from "~/stores/vote.store";
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
    onSettled: (_data, _error, variables, _context) => {
      // After mutation, refetch the specific proposal to get the source of truth from the server.
      queryClient.invalidateQueries({
        queryKey: ["proposal", variables.proposalId],
      });
      // Also invalidate the list query, in case vote counts are shown there.
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      // Trigger a lightweight refresh in the local vote store to re-render UI
      try {
        // If server returned updated counts, update store directly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataAny: any = _data;
        if (dataAny?.updateProposal) {
          const updated = dataAny.updateProposal;
          useVoteStore
            .getState()
            .actions.setProposalCounts(variables.proposalId, {
              react_good: updated.react_good ?? 0,
              react_angry: updated.react_angry ?? 0,
              react_disappoint: updated.react_disappoint ?? 0,
              react_whatever: updated.react_whatever ?? 0,
            });
        } else {
          // Fallback: trigger a UI refresh by re-saving current counts
          // useVoteStore.getState().actions.refreshProposalCounts(variables.proposalId);
        }
      } catch {
        // swallow any errors to avoid breaking mutation flow
      }
    },
  });
};
