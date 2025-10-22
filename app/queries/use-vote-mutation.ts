import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UPDATE_PROPOSAL_REACTS } from "./proposal.queries";
import { useVoteStore, type ReactType } from "~/stores/vote.store";

import { execute } from "~/graphql/execute";

interface VoteVariables {
  proposalId: string;
  reactType: ReactType;
  apiPayload: { [key in ReactType]?: number };
}

export const useVoteMutation = () => {
  const queryClient = useQueryClient();
  const { vote, revertVote, votes, votedProposals } = useVoteStore(
    (state) => ({
      vote: state.vote,
      revertVote: state.revertVote,
      votes: state.votes,
      votedProposals: state.votedProposals,
    })
  );

  return useMutation({
    mutationFn: async ({ proposalId, apiPayload }: VoteVariables) => {
      return execute(UPDATE_PROPOSAL_REACTS, {
        where: { id: proposalId },
        data: apiPayload,
      });
    },
    onMutate: async ({ proposalId, reactType }) => {
      const originalState = {
        votes,
        votedProposals,
      };

      // Optimistically update the zustand store
      vote(proposalId, reactType);

      return { originalState };
    },
    onError: (_err, _variables, context) => {
      if (context?.originalState) {
        revertVote(context.originalState.votes, context.originalState.votedProposals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
};
