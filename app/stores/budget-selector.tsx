import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";

type DepartmentFilter = {
  category: string | null;
  departmentId: string | null;
};

type PeopleFilter = {
  personId: string | null;
};

type BudgetSelectorState = {
  selectedValue: string;
  searchedValue: string;
  visible: boolean;
  // 排序相關
  selectedSort: string;
  departmentFilter: DepartmentFilter;
  peopleFilter: PeopleFilter;
  selectedYear: number | null;
};

type BudgetSelectorActions = {
  setSearchedValue: (value: string) => void;
  setSelectedValue: (value: string) => void;
  toggleVisible: () => void;
  setSelectedSort: (value: string) => void;
  resetToDefault: () => void;
  setDepartmentCategory: (category: string | null) => void;
  setDepartmentId: (id: string | null) => void;
  clearDepartmentFilter: () => void;
  setPersonId: (id: string | null) => void;
  clearPeopleFilter: () => void;
  setSelectedYear: (year: number | null) => void;
};

type BudgetSelectorStore = {
  state: BudgetSelectorState;
  actions: BudgetSelectorActions;
};

/**
 * Default props for the budget selector store
 */
const DEFAULT_STATE: BudgetSelectorState = {
  selectedValue: "all",
  searchedValue: "",
  visible: true,
  selectedSort: "id-asc",
  departmentFilter: { category: null, departmentId: null },
  peopleFilter: { personId: null },
  selectedYear: null,
};

const createInitialState = (
  props: Partial<BudgetSelectorState> = {}
): BudgetSelectorState => merge(cloneDeep(DEFAULT_STATE), props);

/**
 * Creates a budget selector store with optional initial props
 * Following Zustand's initialize-state-with-props pattern
 *
 * @param initProps - Optional initial props to override defaults
 * @returns Zustand store instance
 */
export const createBudgetSelectStore = (
  initProps: Partial<BudgetSelectorState> = {}
) => {
  const initialState = createInitialState(initProps);

  return createStore<BudgetSelectorStore>()(
    immer((set) => ({
      state: initialState,
      actions: {
        setSelectedValue: (value: string) =>
          set((draft) => {
            draft.state.selectedValue = value;
          }),
        setSearchedValue: (value: string) =>
          set((draft) => {
            draft.state.searchedValue = value;
          }),
        toggleVisible: () =>
          set((draft) => {
            draft.state.visible = !draft.state.visible;
          }),
        setSelectedSort: (value: string) =>
          set((draft) => {
            draft.state.selectedSort = value;
          }),
        resetToDefault: () =>
          set((draft) => {
            draft.state.selectedValue = DEFAULT_STATE.selectedValue;
          }),
        setDepartmentCategory: (category: string | null) =>
          set((draft) => {
            draft.state.departmentFilter.category = category;
            draft.state.departmentFilter.departmentId = null;
          }),
        setDepartmentId: (id: string | null) =>
          set((draft) => {
            draft.state.departmentFilter.departmentId = id;
          }),
        clearDepartmentFilter: () =>
          set((draft) => {
            draft.state.departmentFilter.category = null;
            draft.state.departmentFilter.departmentId = null;
          }),
        setPersonId: (id: string | null) =>
          set((draft) => {
            draft.state.peopleFilter.personId = id;
          }),
        clearPeopleFilter: () =>
          set((draft) => {
            draft.state.peopleFilter.personId = null;
          }),
        setSelectedYear: (year: number | null) =>
          set((draft) => {
            draft.state.selectedYear = year;
          }),
      },
    }))
  );
};

/**
 * Budget selector store type
 */
export type BudgetSelectStore = ReturnType<typeof createBudgetSelectStore>;

// Export default store instance for backward compatibility
const defaultBudgetSelectStore = createBudgetSelectStore();
export default defaultBudgetSelectStore;

// Selector Hooks
import { useStore } from "zustand";

export const useSelectedSort = () =>
  useStore(defaultBudgetSelectStore, (s) => s.state.selectedSort);

export const useDepartmentId = () =>
  useStore(
    defaultBudgetSelectStore,
    (s) => s.state.departmentFilter.departmentId
  );

export const usePersonId = () =>
  useStore(defaultBudgetSelectStore, (s) => s.state.peopleFilter.personId);

export const useSearchedValue = () =>
  useStore(defaultBudgetSelectStore, (s) => s.state.searchedValue);

export const useSelectedYear = () =>
  useStore(defaultBudgetSelectStore, (s) => s.state.selectedYear);

// Action Hooks
export const useSetSelectedSort = () =>
  useStore(defaultBudgetSelectStore, (s) => s.actions.setSelectedSort);

export const useSetSelectedYear = () =>
  useStore(defaultBudgetSelectStore, (s) => s.actions.setSelectedYear);
