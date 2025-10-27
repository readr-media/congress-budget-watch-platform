import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import cloneDeep from "lodash/cloneDeep";

type VisualizationTab = "legislator" | "department";
type VisualizationMode = "amount" | "count";

type VisualizationState = {
  activeTab: VisualizationTab;
  mode: VisualizationMode;
  selectedYear: string;
};

type VisualizationActions = {
  setActiveTab: (tab: VisualizationTab) => void;
  setMode: (mode: VisualizationMode) => void;
  setSelectedYear: (year: string) => void;
  reset: () => void;
};

type VisualizationStore = {
  state: VisualizationState;
  actions: VisualizationActions;
};

const DEFAULT_STATE: VisualizationState = {
  activeTab: "legislator", // 預設依立委
  mode: "amount",
  selectedYear: "2025",
};

const getDefaultState = (): VisualizationState => cloneDeep(DEFAULT_STATE);

export const useVisualizationStore = create<VisualizationStore>()(
  devtools(
    immer((set) => ({
      state: getDefaultState(),
      actions: {
        setActiveTab: (tab) =>
          set(
            (draft) => {
              draft.state.activeTab = tab;
            },
            false,
            "visualization/setActiveTab"
          ),
        setMode: (mode) =>
          set(
            (draft) => {
              draft.state.mode = mode;
            },
            false,
            "visualization/setMode"
          ),
        setSelectedYear: (year) =>
          set(
            (draft) => {
              draft.state.selectedYear = year;
            },
            false,
            "visualization/setSelectedYear"
          ),
        reset: () =>
          set(
            (draft) => {
              draft.state = getDefaultState();
            },
            false,
            "visualization/reset"
          ),
      },
    })),
    { name: "visualization-store", enabled: process.env.NODE_ENV === "development" }
  )
);

export const useVisualizationState = () =>
  useVisualizationStore((s) => s.state);

export const useVisualizationActions = () =>
  useVisualizationStore((s) => s.actions);

export const useActiveTab = () =>
  useVisualizationStore((s) => s.state.activeTab);

export const useVisualizationMode = () =>
  useVisualizationStore((s) => s.state.mode);

export const useSelectedYear = () =>
  useVisualizationStore((s) => s.state.selectedYear);
