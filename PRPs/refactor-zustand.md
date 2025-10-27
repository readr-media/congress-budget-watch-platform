# Zustand 重構 PRP

## 概述

本 PRP 旨在根據 Zustand 官方文檔和最佳實踐，重構和優化專案中的 Zustand 狀態管理實現。目標是提高代碼可維護性、性能和一致性，同時確保所有 store 都使用 immer 進行狀態更新。

## 背景與動機

根據 `refactor-zustand.md` 的要求，我們需要：
1. 依照官方網站文檔使用 Zustand
2. 盤查現有 Zustand 使用方式並檢查是否符合官方模式
3. 確保每個 store 都透過 immer 發揮效用
4. 檢查是否有應該使用 Zustand 管理但未使用的狀態
5. 遵循 DRY 原則和函數式編程概念，多利用已安裝的 lodash

## 現狀分析

### 現有 Zustand Store 結構

經過分析，專案中有以下 Zustand store：

1. **uiStore.ts**
   - 管理 UI 狀態（header、progress 等）
   - 使用 devtools 中間件
   - 導出多個選擇器 hooks

2. **vote.store.ts**
   - 管理用戶投票狀態
   - 使用 devtools 和 persist 中間件
   - 導出選擇器 hooks

3. **visualization.store.ts**
   - 管理視覺化相關狀態
   - 使用 devtools 中間件
   - 導出多個選擇器 hooks

4. **paginationStore.ts**
   - 管理分頁狀態
   - 使用 devtools 中間件
   - 導出多個選擇器 hooks

5. **budget-selector.tsx**
   - 使用 createStore 工廠模式創建可重用 store
   - 未使用中間件
   - 導出選擇器 hooks

### 問題識別

1. **immer 整合缺失**：雖然專案已安裝 immer，但大多數 store 未使用 immer 中間件
2. **命名不一致**：store 文件命名不一致（有些是 `.store.ts`，有些是 `Store.ts`）
3. **模式不一致**：有些 store 將 actions 放在 state 內部，有些則分開
4. **類型定義重複**：許多類型定義重複，可以提取共享類型
5. **未充分利用 lodash**：可以更多地利用 lodash 進行函數式編程

## 技術細節

### 1. 引入 immer 中間件

所有 store 都應使用 immer 中間件，以簡化狀態更新邏輯。

```typescript
// 修改前（例如 uiStore.ts 中的一個 action）
toggleShareModal: () =>
  set(
    (state) => ({
      headerState: {
        ...state.headerState,
        isShareModalOpen: !state.headerState.isShareModalOpen,
      },
    }),
    undefined,
    "toggleShareModal"
  ),

// 修改後（使用 immer）
toggleShareModal: () =>
  set(
    (state) => {
      state.headerState.isShareModalOpen = !state.headerState.isShareModalOpen;
    },
    false,
    "toggleShareModal"
  ),
```

### 2. 統一 Store 結構

所有 store 應遵循一致的結構：

```typescript
// 標準化 store 結構
type SomeState = {
  // 狀態字段...
};

type SomeActions = {
  // 操作方法...
};

type SomeStore = {
  state: SomeState;
  actions: SomeActions;
};

const DEFAULT_STATE: SomeState = {
  // 預設值...
};

export const useSomeStore = create<SomeStore>()(
  immer(
    devtools(
      (set) => ({
        state: DEFAULT_STATE,
        actions: {
          someAction: () => 
            set(
              (state) => {
                // 直接修改 state...
              },
              false,
              "some/someAction"
            ),
          // 其他 actions...
        },
      }),
      { name: "some-store", enabled: process.env.NODE_ENV === "development" }
    )
  )
);

// 導出選擇器 hooks
export const useSomeState = () => useSomeStore((s) => s.state);
export const useSomeActions = () => useSomeStore((s) => s.actions);
export const useSomeSpecificState = () => useSomeStore((s) => s.state.specificField);
```

### 3. 使用 lodash 優化

利用 lodash 的函數式方法優化代碼：

```typescript
import { get, set as lodashSet, cloneDeep } from 'lodash';

// 例如在 action 中使用 lodash
updateNestedState: (path, value) =>
  set(
    (state) => {
      lodashSet(state, path, value);
    },
    false,
    `some/updateNestedState:${path}`
  ),
```

### 4. 命名統一

統一 store 文件命名為 `*.store.ts`，例如：
- `ui.store.ts`
- `pagination.store.ts`
- `budget-selector.store.ts`

### 5. 提取共享類型

將重複的類型定義提取到共享文件中：

```typescript
// types/store.types.ts
export type ActionType<T> = {
  (payload?: T): void;
};

export type PaginationState = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
};
```

## 實施計劃

### 階段 1：重構現有 Store

1. **uiStore.ts 重構**
   - 重命名為 `ui.store.ts`
   - 整合 immer 中間件
   - 簡化狀態更新邏輯

2. **vote.store.ts 重構**
   - 已使用 persist，保留並整合 immer
   - 簡化狀態更新邏輯

3. **visualization.store.ts 重構**
   - 整合 immer 中間件
   - 簡化狀態更新邏輯

4. **paginationStore.ts 重構**
   - 重命名為 `pagination.store.ts`
   - 整合 immer 中間件
   - 簡化狀態更新邏輯

5. **budget-selector.tsx 重構**
   - 重命名為 `budget-selector.store.ts`
   - 整合 immer 中間件
   - 簡化狀態更新邏輯

### 階段 2：提取共享類型和工具函數

1. 創建 `types/store.types.ts` 文件，包含共享類型
2. 創建 `utils/store.utils.ts` 文件，包含 store 相關工具函數

### 階段 3：檢查和優化

1. 檢查是否有未使用 Zustand 管理但應該使用的狀態
2. 確保所有 store 都使用 immer 和適當的中間件
3. 使用 lodash 優化代碼

## 代碼示例

### 重構 uiStore.ts 的示例

```typescript
// ui.store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type HeaderState = {
  isShareModalOpen: boolean;
};

type ProgressState = {
  currentStep: number;
  isComplete: boolean;
};

type UIState = {
  headerState: HeaderState;
  progressState: ProgressState;
};

type UIActions = {
  // Header actions
  toggleShareModal: () => void;
  openShareModal: () => void;
  closeShareModal: () => void;

  // Progress actions
  updateProgressStep: (step: number) => void;
  markProgressComplete: () => void;
  resetProgress: () => void;

  // Combined actions
  resetUI: () => void;
};

type UIStore = {
  state: UIState;
  actions: UIActions;
};

const DEFAULT_STATE: UIState = {
  headerState: {
    isShareModalOpen: false,
  },
  progressState: {
    currentStep: 0,
    isComplete: false,
  },
};

export const useUIStore = create<UIStore>()(
  devtools(
    immer((set) => ({
      state: DEFAULT_STATE,
      actions: {
        // Header actions
        toggleShareModal: () =>
          set(
            (state) => {
              state.state.headerState.isShareModalOpen = !state.state.headerState.isShareModalOpen;
            },
            false,
            "ui/toggleShareModal"
          ),

        openShareModal: () =>
          set(
            (state) => {
              state.state.headerState.isShareModalOpen = true;
            },
            false,
            "ui/openShareModal"
          ),

        closeShareModal: () =>
          set(
            (state) => {
              state.state.headerState.isShareModalOpen = false;
            },
            false,
            "ui/closeShareModal"
          ),

        // Progress actions
        updateProgressStep: (step: number) =>
          set(
            (state) => {
              state.state.progressState.currentStep = step;
              state.state.progressState.isComplete = false;
            },
            false,
            `ui/updateProgressStep:${step}`
          ),

        markProgressComplete: () =>
          set(
            (state) => {
              state.state.progressState.isComplete = true;
            },
            false,
            "ui/markProgressComplete"
          ),

        resetProgress: () =>
          set(
            (state) => {
              state.state.progressState = DEFAULT_STATE.progressState;
            },
            false,
            "ui/resetProgress"
          ),

        // Combined actions
        resetUI: () =>
          set(
            (state) => {
              state.state = DEFAULT_STATE;
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

// Selector hooks
export const useUIState = () => useUIStore((s) => s.state);
export const useUIActions = () => useUIStore((s) => s.actions);
export const useHeaderState = () => useUIStore((s) => s.state.headerState);
export const useProgressState = () => useUIStore((s) => s.state.progressState);
```

## 驗證步驟

1. **類型檢查**：運行 `pnpm typecheck` 確保沒有類型錯誤
2. **功能測試**：確保所有功能正常工作
3. **開發工具測試**：使用 Redux DevTools 確認 actions 正確顯示
4. **性能測試**：確保重構不會導致性能下降

## 風險與緩解

1. **破壞現有功能**：
   - 風險：重構可能破壞現有功能
   - 緩解：逐步重構每個 store，每次修改後進行全面測試

2. **性能影響**：
   - 風險：immer 可能影響性能
   - 緩解：對關鍵路徑進行性能測試，確保沒有明顯影響

3. **學習曲線**：
   - 風險：團隊成員可能不熟悉新模式
   - 緩解：提供詳細文檔和示例，進行知識分享

## 相關資源

- [Zustand 官方文檔](https://zustand.docs.pmnd.rs/)
- [Zustand 與 immer 整合指南](https://zustand.docs.pmnd.rs/guides/immutable-state-and-merging)
- [Zustand 更新狀態指南](https://zustand.docs.pmnd.rs/guides/updating-state)
- [Zustand 自動生成選擇器指南](https://zustand.docs.pmnd.rs/guides/auto-generating-selectors)
- [Lodash FP 指南](https://github.com/lodash/lodash/wiki/FP-Guide)

## 實施後續

完成重構後，應進行以下步驟：

1. 更新相關文檔
2. 為團隊成員提供培訓
3. 考慮添加 Zustand 使用指南到專案文檔

## 信心評分

8/10 - 重構方向明確，風險可控，但需要謹慎處理以避免破壞現有功能。
