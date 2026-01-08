import { create } from "zustand";
import type { GetVisualizationProposalsQuery } from "~/graphql/graphql";

type VisualizationActions = Record<string, never>;

type VisualizationStore = {
  state?: GetVisualizationProposalsQuery;
  actions: VisualizationActions;
};

export const useVisualizationStore = create<VisualizationStore>(() => ({
  state: undefined,
  actions: {},
}));
