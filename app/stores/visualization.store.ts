import { create } from "zustand";
import type { GetVisualizationProposalsQuery } from "~/graphql/graphql";

type VisualizationActions = {};

type VisualizationStore = {
  state?: GetVisualizationProposalsQuery;
  actions: VisualizationActions;
};

const createVisualizationStore = (initProps?: VisualizationStore["state"]) => {
  const DEFAULT_PROPS: Partial<VisualizationStore> = {
    state: undefined,
  };
  console.log({ DEFAULT_PROPS });
  return create<VisualizationStore>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    actions: {},
  }));
};
