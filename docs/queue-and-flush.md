## Queue & Flush System for Vote Reactions

### Purpose
- Provide optimistic voting feedback by updating local counts instantly while batching network writes.
- Reduce mutation load on the API by flushing multiple pending reactions for the same proposal in a single request.
- Guard against data loss when the tab closes or visibility changes by flushing automatically.

---

### Queue Layer (`app/stores/vote.store.ts`)
- `queueVote(proposalId, reaction)` increments the in-memory count for the given reaction and marks it as pending.
- Pending reactions live under `state.pending[proposalId][reaction] = true` so we can flush only the affected reactions.
- The store persists both `votes` and `pending` via `zustand/persist`, so queued items survive reloads.
- `removePendingReactions` and `clearProposalPending` clean up pending flags once a flush succeeds or becomes irrelevant.

---

### Flush Lifecycle (`app/queries/use-vote-queue.ts`)
1. `useVoteQueue()` memoises TanStack Query’s `mutateAsync` so we always use the latest mutation implementation.
2. `scheduleFlush()` sets a timeout (default 2s) and cancels any existing timer before arming a new one.
3. `flushPending()`:
   - Bails out if another flush is already in progress.
   - Reads the current store snapshot, builds a payload per proposal, and issues the mutation.
   - Collects `{ proposalId, reactions }` pairs that succeeded so we can clear only the committed reactions.
   - Returns `{ success, errors }` so callers may react to partial failures if needed.
4. `cancelScheduledFlush()` clears the active timer when we need an immediate flush or component teardown.
5. Lifecycle hooks:
   - Visibility change (`document.visibilityState === "hidden"`) or `beforeunload` trigger an immediate flush.
   - Cleanup on unmount flushes pending reactions and cancels timers to avoid leaks.

---

### Usage Pattern (Example: `app/components/VoteButtons.tsx`)
- Initialise proposal data via `useVoteActions().initProposal` when a detail view mounts.
- Call `queueVote(proposalId, reaction)` to optimistically update counts.
- Immediately call `scheduleFlush()` so the mutation runs soon after user interaction.
- Trigger `flushPending()` after user confirmation (e.g., closing a modal) when you need guarantees.

---

### Error Handling & Retries
- Failed mutations are captured in the `errors` array returned by `flushPending()`.
- Pending entries remain in the store if a mutation fails, so the next flush attempt will retry automatically.
- Consider surfacing failures in the UI or logging them for observability when integrating new flows.

---

### Extending the System
- Keep new reaction types in sync with `ReactionType` and `createEmptyCounts()` so queue bookkeeping stays accurate.
- When adding new entry points that queue votes, always pair optimistic UI updates with a scheduled flush.
- For long-running pages (e.g., dashboards), consider manually invoking `flushPending()` on interval or user-driven checkpoints if interaction bursts are common.
