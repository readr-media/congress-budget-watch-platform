import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import cloneDeep from "lodash/cloneDeep";

/**
 * Header state type
 */
type HeaderState = {
  isShareModalOpen: boolean;
};

/**
 * Progress state type
 */
type ProgressState = {
  currentStep: number;
  isComplete: boolean;
};

type UIStoreState = {
  headerState: HeaderState;
  progressState: ProgressState;
};

type UIStoreActions = {
  toggleShareModal: () => void;
  openShareModal: () => void;
  closeShareModal: () => void;
  updateProgressStep: (step: number) => void;
  markProgressComplete: () => void;
  resetProgress: () => void;
  resetUI: () => void;
};

type UIStore = {
  state: UIStoreState;
  actions: UIStoreActions;
};

const DEFAULT_STATE: UIStoreState = {
  headerState: {
    isShareModalOpen: false,
  },
  progressState: {
    currentStep: 0,
    isComplete: false,
  },
};

const getDefaultState = (): UIStoreState => cloneDeep(DEFAULT_STATE);

/**
 * UI Store using Zustand
 *
 * Manages global UI state for header and progress components
 * Following 2025 best practices with TypeScript and devtools integration
 */
export const useUIStore = create<UIStore>()(
  devtools(
    immer((set) => ({
      state: getDefaultState(),
      actions: {
        toggleShareModal: () =>
          set(
            (draft) => {
              draft.state.headerState.isShareModalOpen =
                !draft.state.headerState.isShareModalOpen;
            },
            false,
            "ui/toggleShareModal"
          ),
        openShareModal: () =>
          set(
            (draft) => {
              draft.state.headerState.isShareModalOpen = true;
            },
            false,
            "ui/openShareModal"
          ),
        closeShareModal: () =>
          set(
            (draft) => {
              draft.state.headerState.isShareModalOpen = false;
            },
            false,
            "ui/closeShareModal"
          ),
        updateProgressStep: (step: number) =>
          set(
            (draft) => {
              draft.state.progressState.currentStep = step;
              draft.state.progressState.isComplete = false;
            },
            false,
            `ui/updateProgressStep:${step}`
          ),
        markProgressComplete: () =>
          set(
            (draft) => {
              draft.state.progressState.isComplete = true;
            },
            false,
            "ui/markProgressComplete"
          ),
        resetProgress: () =>
          set(
            (draft) => {
              draft.state.progressState = cloneDeep(
                DEFAULT_STATE.progressState
              );
            },
            false,
            "ui/resetProgress"
          ),
        resetUI: () =>
          set(
            (draft) => {
              draft.state = getDefaultState();
            },
            false,
            "ui/resetUI"
          ),
      },
    })),
    {
      name: "ui-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// Selector hooks for better performance (prevent unnecessary re-renders)

/**
 * Hook to get header state
 */
export const useHeaderState = () => useUIStore((store) => store.state.headerState);

/**
 * Hook to get progress state
 */
export const useProgressState = () =>
  useUIStore((store) => store.state.progressState);

/**
 * Hook to get actions
 */
export const useUIActions = () => useUIStore((store) => store.actions);

/**
 * Hook to get specific header actions
 */
export const useHeaderActions = () =>
  useUIStore((state) => ({
    toggleShareModal: state.actions.toggleShareModal,
    openShareModal: state.actions.openShareModal,
    closeShareModal: state.actions.closeShareModal,
  }));

/**
 * Hook to get specific progress actions
 */
export const useProgressActions = () =>
  useUIStore((state) => ({
    updateProgressStep: state.actions.updateProgressStep,
    markProgressComplete: state.actions.markProgressComplete,
    resetProgress: state.actions.resetProgress,
  }));
