import { useCallback, useEffect, useRef } from "react";
import { useVoteMutation } from "./use-vote-mutation";
import { useVoteStore } from "~/stores/vote.store";
import type { ReactionType, VoteCounts } from "~/types/store/vote";

const DEFAULT_FLUSH_DELAY_MS = 2000;

type FlushResult = {
  success: boolean;
  errors: Array<{ proposalId: string; error: unknown }>;
};

export const useVoteQueue = (flushDelayMs = DEFAULT_FLUSH_DELAY_MS) => {
  const { mutateAsync } = useVoteMutation();
  const flushTimerRef = useRef<number | null>(null);
  const isFlushingRef = useRef(false);
  const mutateAsyncRef = useRef(mutateAsync);
  const delayRef = useRef(flushDelayMs);

  useEffect(() => {
    mutateAsyncRef.current = mutateAsync;
  }, [mutateAsync]);

  useEffect(() => {
    delayRef.current = flushDelayMs;
  }, [flushDelayMs]);

  const flushPending = useCallback(async (): Promise<FlushResult> => {
    if (isFlushingRef.current) {
      return { success: true, errors: [] };
    }

    const errors: FlushResult["errors"] = [];
    const processedReactions: Array<{
      proposalId: string;
      reactions: ReactionType[];
    }> = [];

    const entries = Object.entries(useVoteStore.getState().state.pending);
    if (!entries.length) {
      return { success: true, errors };
    }

    isFlushingRef.current = true;
    try {
      for (const [proposalId, reactionMap] of entries) {
        const reactions = Object.keys(reactionMap) as ReactionType[];
        if (!reactions.length) {
          useVoteStore.getState().actions.clearProposalPending(proposalId);
          continue;
        }

        const { votes } = useVoteStore.getState().state;
        const proposalCounts = votes[proposalId];
        if (!proposalCounts) {
          useVoteStore.getState().actions.clearProposalPending(proposalId);
          continue;
        }

        const payload: Partial<VoteCounts> = {};
        reactions.forEach((reaction) => {
          payload[reaction] = proposalCounts[reaction];
        });

        if (!Object.keys(payload).length) {
          useVoteStore
            .getState()
            .actions.removePendingReactions(proposalId, reactions);
          continue;
        }

        try {
          await mutateAsyncRef.current({
            proposalId,
            apiPayload: payload,
          });
          processedReactions.push({ proposalId, reactions });
        } catch (error) {
          errors.push({ proposalId, error });
        }
      }
    } finally {
      isFlushingRef.current = false;
    }

    if (processedReactions.length) {
      const { removePendingReactions } = useVoteStore.getState().actions;
      processedReactions.forEach(({ proposalId, reactions }) => {
        removePendingReactions(proposalId, reactions);
      });
    }

    return { success: errors.length === 0, errors };
  }, []);

  const cancelScheduledFlush = useCallback(() => {
    if (flushTimerRef.current) {
      window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
  }, []);

  const scheduleFlush = useCallback(() => {
    cancelScheduledFlush();
    flushTimerRef.current = window.setTimeout(() => {
      flushTimerRef.current = null;
      void flushPending();
    }, delayRef.current);
  }, [cancelScheduledFlush, flushPending]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void flushPending();
      }
    };

    const handleBeforeUnload = () => {
      void flushPending();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelScheduledFlush();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void flushPending();
    };
  }, [cancelScheduledFlush, flushPending]);

  return {
    scheduleFlush,
    cancelScheduledFlush,
    flushPending,
  };
};
