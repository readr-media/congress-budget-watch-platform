import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import cloneDeep from "lodash/cloneDeep";

/**
 * 分頁狀態類型
 */
type PaginationState = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
};

/**
 * 分頁操作 actions
 */
type PaginationActions = {
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setTotalCount: (count: number) => void;
  resetPagination: () => void;
};

/**
 * 完整的分頁 store 狀態
 */
type PaginationStoreState = {
  pagination: PaginationState;
};

type PaginationStore = {
  state: PaginationStoreState;
  actions: PaginationActions;
};

/**
 * 預設值
 */
const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,
};

const getDefaultState = (): PaginationStoreState => ({
  pagination: cloneDeep(DEFAULT_PAGINATION),
});

/**
 * 分頁 Store
 *
 * 管理 /all-budgets 頁面的分頁狀態
 * 遵循專案的 Zustand 最佳實踐模式
 */
export const usePaginationStore = create<PaginationStore>()(
  devtools(
    immer((set) => ({
      state: getDefaultState(),

      actions: {
        setPage: (page: number) =>
          set(
            (draft) => {
              draft.state.pagination.currentPage = page;
            },
            false,
            "pagination/setPage"
          ),

        nextPage: () =>
          set(
            (draft) => {
              const { currentPage, pageSize, totalCount } =
                draft.state.pagination;
              const totalPages = Math.ceil(totalCount / pageSize);
              const newPage = Math.min(currentPage + 1, totalPages);
              draft.state.pagination.currentPage = newPage || 1;
            },
            false,
            "pagination/nextPage"
          ),

        prevPage: () =>
          set(
            (draft) => {
              const newPage = Math.max(
                draft.state.pagination.currentPage - 1,
                1
              );
              draft.state.pagination.currentPage = newPage;
            },
            false,
            "pagination/prevPage"
          ),

        setTotalCount: (count: number) =>
          set(
            (draft) => {
              draft.state.pagination.totalCount = count;
            },
            false,
            "pagination/setTotalCount"
          ),

        resetPagination: () =>
          set(
            (draft) => {
              draft.state = getDefaultState();
            },
            false,
            "pagination/reset"
          ),
      },
    })),
    {
      name: "pagination-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

/**
 * Selector hooks（避免不必要的重渲染）
 */
export const usePagination = () =>
  usePaginationStore((store) => store.state.pagination);

export const usePaginationActions = () =>
  usePaginationStore((store) => store.actions);

/**
 * 計算總頁數的 helper hook
 */
export const useTotalPages = () => {
  const { totalCount, pageSize } = usePagination();
  return Math.ceil(totalCount / pageSize);
};

/**
 * 檢查是否有下一頁
 */
export const useHasNextPage = () => {
  const { currentPage } = usePagination();
  const totalPages = useTotalPages();
  return currentPage < totalPages;
};

/**
 * 檢查是否有上一頁
 */
export const useHasPrevPage = () => {
  const { currentPage } = usePagination();
  return currentPage > 1;
};
