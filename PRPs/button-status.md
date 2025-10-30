## PRP: Button Status for Vote Buttons (Use new active/hover/default icons)

### Summary
實作心情投票按鈕的三態圖示（default/hover/active），並盤查與替換所有舊圖檔引用。維持既有 Zustand、React Router、Tailwind 的專案慣例，不改動資料流（Zustand + TanStack Query）。

---

## Research

### Codebase analysis

現況 Vote 按鈕與圖示來源：

```19:32:app/components/VoteButtons.tsx
const VOTE_OPTIONS: { type: ReactionType; label: string; icon: string }[] = [
  { type: "react_good", label: "我覺得很讚", icon: "/image/vote-good.svg" },
  { type: "react_angry", label: "我感到生氣", icon: "/image/vote-angry.svg" },
  {
    type: "react_disappoint",
    label: "我有點失望",
    icon: "/image/vote-sad.svg",
  },
  {
    type: "react_whatever",
    label: "我不在意",
    icon: "/image/vote-neutral.svg",
  },
];
```

Inline 模式按鈕渲染：

```144:169:app/components/VoteButtons.tsx
return (
  <div className="flex justify-center space-x-2">
    {VOTE_OPTIONS.map(({ type, icon }) => (
      <button
        key={type}
        onClick={() => handleVote(type)}
        className={`flex h-20 w-20 flex-col items-center justify-center rounded-lg p-2 transition-all duration-200 sm:h-24 sm:w-24 ${
          selectedReaction === type
            ? "scale-105 shadow-lg"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <Image
          src={icon}
          alt={
            VOTE_OPTIONS.find((opt) => opt.type === type)?.label ??
            "Vote option image"
          }
          className="mb-1 h-8 w-8 sm:h-10 sm:w-10"
        />
        <span className="text-xs font-medium sm:text-sm">
          {formatNumber(voteCounts[type])}
        </span>
      </button>
    ))}
  </div>
);
```

Popup 模式選項渲染：

```124:136:app/components/VoteButtons.tsx
{isVoteMenuOpen && (
  <div className="md: absolute right-0 bottom-0 z-10 w-[69px] rounded-[24px] border-2 bg-white p-2.5 text-[9px] md:translate-x-8 md:translate-y-[10.5rem] lg:translate-x-11 lg:translate-y-[10.5rem]">
    {VOTE_OPTIONS.map(({ type, label, icon }) => (
      <div
        key={type}
        onClick={() => handleVote(type)}
        className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center first:mt-0 ${
          selectedReaction === type ? "shadow-lg" : ""
        }`}
      >
        <Image src={icon} alt={label} className="w-12" />
        <p>{label}</p>
      </div>
    ))}
  </div>
)}
```

Zustand store 與型別（不需更動資料模型）：

```47:56:app/stores/vote.store.ts
export const useVoteStore = create<VoteStore>()(
  devtools(
    persist(
      immer<VoteStore>((set) => ({
        state: getDefaultState(),
        actions: {
```

```76:87:app/stores/vote.store.ts
          queueVote: (proposalId: string, reaction: ReactionType) =>
            set((draft) => {
              const pendingMap = ensurePendingMap(draft.state);
              if (!(proposalId in draft.state.votes)) {
                draft.state.votes[proposalId] = createEmptyCounts();
              }
              draft.state.votes[proposalId][reaction] += 1;
              if (!(proposalId in pendingMap)) {
                pendingMap[proposalId] = {};
              }
              pendingMap[proposalId][reaction] = true;
            }),
```

```3:10:app/types/store/vote.ts
export type ReactionType =
  | "react_angry"
  | "react_disappoint"
  | "react_good"
  | "react_whatever";

export type VoteCounts = Record<ReactionType, number>;
```

專案 Image 元件會自動加上 `STATIC_ASSETS_PREFIX`，保留「/image/...」前綴即可：

```1:13:app/components/image.tsx
import { STATIC_ASSETS_PREFIX } from "~/constants/config";

const Image = ({
  src,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  props?: React.HTMLAttributes<HTMLImageElement>;
}) => {
  return <img src={STATIC_ASSETS_PREFIX + src} {...props} />;
};
```

舊圖檔引用盤查結果：只在 `app/components/VoteButtons.tsx` 引用 `vote-*.svg`（good/angry/sad/neutral）。

### External research

- React 事件處理（hover/active 狀態切換）— React Docs: `Event Handlers`
  - `https://react.dev/learn/responding-to-events`
- Tailwind CSS 狀態樣式（hover/active/focus）— Tailwind Docs: `Hover, Focus, and Other States`
  - `https://tailwindcss.com/docs/hover-focus-and-other-states`
- Zustand selector 最佳實踐（TkDodo）— `Working with Zustand`
  - `https://tkdodo.eu/blog/working-with-zustand`
- TanStack Query 變更後快取失效 — `Invalidation from Mutations`
  - `https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations`
- MDN `<img>` 與動態 `src` 切換（hover 換圖可用事件狀態管理）
  - `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img`

### Gotchas

- `<img>` 無法用純 CSS `:hover` 切換 `src`，需以元件狀態（hover/active）決定 `src`。
- 維持 Zustand selector hooks，避免整個 store 訂閱造成不必要 re-render。
- 避免 `any` 型別；為 icon map 建立嚴格型別。
- 新圖檔位於 `public/image/` 下，與現有 `STATIC_ASSETS_PREFIX + "/image/..."` 相容。

---

## Implementation blueprint

### 需求
- 使用新資產：
  - `vote-good-{default,hover,active}.svg`
  - `vote-angry-{default,hover,active}.svg`
  - `vote-sad-{default,hover,active}.svg`
  - `vote-whatever-{default,hover,active}.svg`
- Inline 與 Popup 兩種 UI 都要支援三態。
- 不變更 GraphQL 與 store 資料結構。

### 型別與常數
- 在 `app/types/components/voteButtons.ts` 新增嚴格型別：
  - `ReactionIconVariant = 'default' | 'hover' | 'active'`
  - `ReactionIcons = Record<ReactionType, Record<ReactionIconVariant, string>>`
- 在 `app/components/VoteButtons.tsx` 新增 `ICONS: ReactionIcons` 常數，集中路徑：
  - 例如 `ICONS.react_good.default = '/image/vote-good-default.svg'`

### 狀態管理（僅限元件內）
- 加入本地 `hoveredReaction: ReactionType | null`。
- `selectedReaction` 已存在，作為 active 狀態依據。

### 圖示選擇邏輯（共用）
Pseudo:
```ts
const getIconSrc = (type: ReactionType) => {
  if (selectedReaction === type) return ICONS[type].active;
  if (hoveredReaction === type) return ICONS[type].hover;
  return ICONS[type].default;
};
```

### Inline 與 Popup UI 調整
- 將 `VOTE_OPTIONS` 的 `icon` 欄位移除或僅保留 label/type，改為渲染時以 `getIconSrc(type)` 帶入。
- 在按鈕/選項容器綁定 `onMouseEnter/Leave` 更新 `hoveredReaction`。

### 舊圖檔替換
- 將 `"/image/vote-*.svg"` 改為 `ICONS[...]` 的三態路徑，刪除不再使用的舊常數。

### 錯誤處理與回退策略
- 若找不到對應 icon（理論上不會）：回退至 `default` 路徑。
- 仍沿用既有 mutation 與快取失效策略（見 `use-vote-mutation.ts`）。

---

## Tasks (ordered)
1. 新增型別 `ReactionIconVariant`/`ReactionIcons` 至 `app/types/components/voteButtons.ts`。
2. 在 `app/components/VoteButtons.tsx` 定義 `ICONS` 三態路徑常數（使用 `'/image/...-default.svg'` 等新檔）。
3. 移除 `VOTE_OPTIONS` 中的 `icon` 欄位，保留 `type/label`。
4. 於 Inline/Popup 兩處，改用 `getIconSrc(type)` 動態決定 `Image src`。
5. 新增本地 `hoveredReaction` 狀態，於相關元素綁定 `onMouseEnter/Leave`。
6. 以全域搜尋確認無其他舊路徑引用（目前僅 `VoteButtons.tsx`）。
7. 手動驗證 UI 三態切換與數字更新邏輯（inline/popup）。

---

## Validation gates

```bash
# 型別與 Lint
pnpm typecheck
pnpm lint:check

# 編譯（應成功產出 build）
pnpm build

#（手動）啟動開發伺服器觀察 hover/active 狀態切換
pnpm dev
```

可選自動檢查（檔案是否存在）：

```bash
node -e "const fs=require('fs'); const names=['good','angry','sad','whatever']; const variants=['default','hover','active']; const missing=[]; for(const n of names){ for(const v of variants){ const p=`public/image/vote-${n}-${v}.svg`; if(!fs.existsSync(p)) missing.push(p); }} if(missing.length){ console.error('Missing:', missing); process.exit(1);} console.log('All vote icons present.');"
```

---

## Rollback plan
- 若 UI 有異常，回退至使用單一 `icon` 版本（保留 `VOTE_OPTIONS` 舊實作於 git 方便 revert）。

---

## Acceptance criteria
- Inline/Popup 皆能依 hover/active 切換對應圖示。
- 不影響既有投票排程與快取失效行為。
- 專案通過 typecheck、lint、build。
- 全域無任何 `"/image/vote-*.svg"` 舊路徑殘留。

---

## Confidence score
8/10（資料流與型別不變更，改動集中於單一元件，風險低）。


