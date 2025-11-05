# PRP: 視覺化顯示邏輯調整

## 概述

本 PRP 旨在實作 `FEATs/visualization-change.md` 中提出的四種情況的視覺化顯示邏輯調整：

1. **情況一：依立委、依金額** - 主決議不顯示，同一立委的不同類型分開為獨立 circles
2. **情況二：依部會、依金額** - 不同類型用對應邊框表示
3. **情況三：依立委、依數量** - 主決議顯示（黑色虛線邊框），同一立委的不同類型分開顯示
4. **情況四：依部會、依數量** - 不同類型用對應邊框表示

核心改動在於資料轉換邏輯與邊框樣式的處理，確保不破壞現有的互動邏輯與其他已完成的樣式。

---

## 背景與動機

目前視覺化系統已實作依立委/依部會以及依金額/依數量的切換，但在以下幾個方面需要調整：

1. **主決議處理不一致**：依金額時應隱藏主決議（無金額），依數量時應顯示（計入案件數）
2. **立委群組結構過於複雜**：目前依立委時會有 parent circle 包含同一立委的所有提案，需要扁平化
3. **類型區分不明確**：需要透過邊框樣式清楚區分凍結、刪減、主決議三種類型

這些調整將提升視覺化的資訊傳達效率與使用者體驗。

---

## 現況分析與程式碼參考

### 1. 現有資料轉換邏輯

**依立委資料轉換** (`helpers.ts` 第 143-255 行)：

```typescript
export const transformToGroupedByLegislatorData = (
  data: GetVisualizationProposalsQuery,
  mode: VisualizationMode = "amount",
): VisualizationGroupedData => {
  // 目前會建立一個有層級的結構：
  // 立委 -> 群組節點（凍結/刪減/主決議）
  // 問題：群組節點被包在立委的 parent circle 內
  
  const groupDefinitions = [
    { key: "freeze", proposals: freezeProposals, getAmount: ..., isFrozen: true },
    { key: "reduce", proposals: reductionProposals, getAmount: ... },
    { key: "other", proposals: mainResolutionProposals, getAmount: () => 0 },
  ];
  
  // mode === "amount" 時，主決議的 rawValue 為 totalCount
  // 但根據新需求，依金額時不應顯示主決議
}
```

**依部會資料轉換** (`helpers.ts` 第 412-478 行)：

```typescript
export const transformToCategorizedData = (
  data: GetVisualizationProposalsQuery,
  mode: "amount" | "count",
): Record<string, NodeDatum> => {
  // mode === "amount" 時會過濾掉零金額提案
  const proposalsToProcess =
    mode === "amount"
      ? proposals.filter(
          (p) => (p.freezeAmount ?? 0) + (p.reductionAmount ?? 0) > 0,
        )
      : proposals;
  
  // 目前未區分不同類型，只按立委群組
}
```

### 2. Circle Pack Chart 邊框樣式

**凍結案波浪邊框** (`circle-pack-chart.tsx` 第 61-93 行)：

```typescript
const createScallopedPath = (radius: number) => {
  const waveCount = getWaveCountForRadius(radius);
  const amplitudeRatio = getAmplitudeForRadius(radius);
  // ... 產生波浪路徑
};

// 使用於凍結節點
frozenNodes
  .append("path")
  .attr("class", "frozen-wave")
  .attr("d", (d) => createScallopedPath(d.r));
```

**一般節點圓形邊框** (`circle-pack-chart.tsx` 第 233-242 行)：

```typescript
node
  .append("circle")
  .attr("class", "node-base-circle")
  .attr("stroke", (d) => (d.data.isFrozen ? "none" : "#000"))
  .attr("stroke-width", BASE_STROKE_WIDTH);
```

### 3. NodeDatum 型別定義

**現有型別** (`helpers.ts` 第 49-57 行)：

```typescript
export type NodeDatum = {
  name: string;
  value?: number;
  color?: string;
  id: string;
  proposerId?: string;
  isFrozen?: boolean; // 目前只標記凍結
  children?: NodeDatum[];
};
```

---

## 外部研究與參考資源

### D3.js 樣式與路徑

- **D3 路徑生成**：`https://github.com/d3/d3-shape`
  - 用於產生自訂路徑，如虛線邊框
- **D3 選擇與樣式**：`https://github.com/d3/d3-selection`
  - 用於動態設定 `stroke-dasharray` 實現虛線效果
- **D3 層級結構**：`https://github.com/d3/d3-hierarchy`
  - 理解 `d3.pack()` 如何處理扁平化 vs 層級結構

### SVG 邊框樣式

- **SVG stroke-dasharray**：`https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray`
  - 實作虛線邊框的標準方式
- **SVG stroke 屬性**：`https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke`
  - 理解如何設定邊框顏色與寬度

### 常見陷阱與備註

- **扁平化數據結構**：移除 parent circle 需要將原本的巢狀結構改為扁平陣列，確保每個 circle 都在同一層級
- **型別標記**：需要在 `NodeDatum` 中加入新的型別標記（如 `proposalType`）來區分凍結/刪減/主決議
- **虛線渲染效能**：虛線比實線稍耗效能，但在合理節點數量下影響不大
- **顏色一致性**：確保立委的黨派顏色在所有類型的 circle 中保持一致

---

## 設計決策與實作藍圖

### 1. 擴充 NodeDatum 型別

新增 `proposalType` 欄位以明確標記提案類型：

```typescript
export type ProposalType = "freeze" | "reduce" | "main-resolution";

export type NodeDatum = {
  name: string;
  value?: number;
  color?: string;
  id: string;
  proposerId?: string;
  proposalType?: ProposalType; // 新增：明確的提案類型
  isFrozen?: boolean; // 保留向後相容
  children?: NodeDatum[];
};
```

**理由**：
- `isFrozen` 僅能區分凍結/非凍結，無法區分刪減與主決議
- 明確的 `proposalType` 讓邊框樣式邏輯更清晰
- 保留 `isFrozen` 以避免破壞現有邏輯

### 2. 調整依立委資料轉換邏輯

**目標結構**：將原本的三層結構（root -> 立委 -> 類型）改為兩層結構（root -> 類型節點）

```typescript
export const transformToGroupedByLegislatorData = (
  data: GetVisualizationProposalsQuery,
  mode: VisualizationMode = "amount",
): VisualizationGroupedData => {
  const proposals = extractProposals(data);
  
  const groupedByLegislator = groupBy(
    proposals,
    (proposal) => proposal.proposers?.[0]?.id ?? "unknown-proposer",
  );
  
  // 扁平化的節點陣列，不再有立委層級
  const allNodes: NodeDatum[] = [];
  
  Object.entries(groupedByLegislator).forEach(([proposerId, legislatorProposals]) => {
    const mainProposer = legislatorProposals[0]?.proposers?.[0];
    const partyColor = mainProposer?.party?.color ?? 
                       PARTY_COLORS.get(mainProposer?.party?.name ?? "無黨籍") ?? 
                       DEFAULT_COLOR;
    
    // 分組
    const freezeProposals = legislatorProposals.filter(...);
    const reductionProposals = legislatorProposals.filter(...);
    const mainResolutionProposals = legislatorProposals.filter(...);
    
    // 凍結案節點（兩種模式都顯示）
    if (freezeProposals.length > 0) {
      const totalAmount = sumBy(freezeProposals, p => p.freezeAmount ?? 0);
      const totalCount = freezeProposals.length;
      const rawValue = mode === "amount" ? totalAmount : totalCount;
      
      if (rawValue > 0) {
        allNodes.push({
          id: `${proposerId}-freeze`,
          name: `${mainProposer?.name ?? "未知"}\n凍結\n${mode === "amount" ? formatAmountWithUnit(totalAmount) : `${totalCount}案`}`,
          value: Math.pow(rawValue, 0.45),
          color: partyColor,
          proposerId: mainProposer?.id,
          proposalType: "freeze",
          isFrozen: true,
        });
      }
    }
    
    // 刪減案節點（兩種模式都顯示）
    if (reductionProposals.length > 0) {
      const totalAmount = sumBy(reductionProposals, p => p.reductionAmount ?? 0);
      const totalCount = reductionProposals.length;
      const rawValue = mode === "amount" ? totalAmount : totalCount;
      
      if (rawValue > 0) {
        allNodes.push({
          id: `${proposerId}-reduce`,
          name: `${mainProposer?.name ?? "未知"}\n刪減\n${mode === "amount" ? formatAmountWithUnit(totalAmount) : `${totalCount}案`}`,
          value: Math.pow(rawValue, 0.45),
          color: partyColor,
          proposerId: mainProposer?.id,
          proposalType: "reduce",
        });
      }
    }
    
    // 主決議節點（僅在 count 模式顯示）
    if (mode === "count" && mainResolutionProposals.length > 0) {
      allNodes.push({
        id: `${proposerId}-main`,
        name: `${mainProposer?.name ?? "未知"}\n主決議\n${mainResolutionProposals.length}案`,
        value: Math.pow(mainResolutionProposals.length, 0.45),
        color: partyColor,
        proposerId: mainProposer?.id,
        proposalType: "main-resolution",
      });
    }
  });
  
  return {
    立委提案彙整: {
      id: "legislator-summary-root",
      name: "root",
      children: allNodes,
    },
  };
};
```

**關鍵變更**：
- 移除立委層級，直接將類型節點放在 root 下
- 依金額模式時過濾掉主決議（rawValue 為 0）
- 依數量模式時包含主決議
- 所有節點都使用立委的黨派顏色

### 3. 調整依部會資料轉換邏輯

**目標**：在依部會視圖中，按提案類型區分節點並設定對應的 `proposalType`

```typescript
export const transformToCategorizedData = (
  data: GetVisualizationProposalsQuery,
  mode: "amount" | "count",
): Record<string, NodeDatum> => {
  const proposals = extractProposals(data);
  
  // 依 mode 決定是否過濾
  const proposalsToProcess = mode === "amount"
    ? proposals.filter(p => (p.freezeAmount ?? 0) + (p.reductionAmount ?? 0) > 0)
    : proposals;
  
  const groupedByCategory = groupBy(
    proposalsToProcess,
    (p) => p.government?.category ?? "未分類",
  );
  
  return mapValues(groupedByCategory, (categoryProposals, categoryName) => {
    const groupedByProposer = groupBy(
      categoryProposals,
      (p) => p.proposers?.[0]?.id ?? "unknown-proposer",
    );
    
    const proposerNodes: NodeDatum[] = [];
    
    Object.entries(groupedByProposer).forEach(([proposerId, proposerProposals]) => {
      const mainProposer = proposerProposals[0]?.proposers?.[0];
      const party = mainProposer?.party?.name ?? "無黨籍";
      const partyColor = mainProposer?.party?.color ?? 
                         PARTY_COLORS.get(party) ?? 
                         DEFAULT_COLOR;
      
      // 按類型分組每個立委的提案
      const freezeProposals = proposerProposals.filter(p => (p.freezeAmount ?? 0) > 0);
      const reductionProposals = proposerProposals.filter(p => (p.reductionAmount ?? 0) > 0);
      const mainResolutionProposals = proposerProposals.filter(p =>
        p.proposalTypes?.includes(ProposalProposalTypeType.Other)
      );
      
      // 凍結案
      if (freezeProposals.length > 0) {
        const amount = sumBy(freezeProposals, p => p.freezeAmount ?? 0);
        const count = freezeProposals.length;
        const rawValue = mode === "amount" ? amount : count;
        
        if (rawValue > 0) {
          proposerNodes.push({
            id: `proposer-${categoryName}-${proposerId}-freeze`,
            name: `${mainProposer?.name ?? "未知"}\n凍結\n${mode === "amount" ? formatAmountWithUnit(amount) : `${count}案`}`,
            value: Math.pow(rawValue, 0.45),
            color: partyColor,
            proposerId: mainProposer?.id,
            proposalType: "freeze",
            isFrozen: true,
          });
        }
      }
      
      // 刪減案
      if (reductionProposals.length > 0) {
        const amount = sumBy(reductionProposals, p => p.reductionAmount ?? 0);
        const count = reductionProposals.length;
        const rawValue = mode === "amount" ? amount : count;
        
        if (rawValue > 0) {
          proposerNodes.push({
            id: `proposer-${categoryName}-${proposerId}-reduce`,
            name: `${mainProposer?.name ?? "未知"}\n刪減\n${mode === "amount" ? formatAmountWithUnit(amount) : `${count}案`}`,
            value: Math.pow(rawValue, 0.45),
            color: partyColor,
            proposerId: mainProposer?.id,
            proposalType: "reduce",
          });
        }
      }
      
      // 主決議（僅在 count 模式）
      if (mode === "count" && mainResolutionProposals.length > 0) {
        proposerNodes.push({
          id: `proposer-${categoryName}-${proposerId}-main`,
          name: `${mainProposer?.name ?? "未知"}\n主決議\n${mainResolutionProposals.length}案`,
          value: Math.pow(mainResolutionProposals.length, 0.45),
          color: partyColor,
          proposerId: mainProposer?.id,
          proposalType: "main-resolution",
        });
      }
    });
    
    return {
      id: "root",
      name: "root",
      children: proposerNodes,
    };
  });
};
```

**關鍵變更**：
- 每個立委的每種類型都是獨立節點
- 設定正確的 `proposalType`
- 依金額時過濾主決議，依數量時包含主決議

### 4. 擴充 Circle Pack Chart 邊框樣式

在 `circle-pack-chart.tsx` 中新增主決議的虛線邊框支援：

```typescript
// 在檔案頂部新增常數
const MAIN_RESOLUTION_STROKE_DASHARRAY = "4,4"; // 虛線樣式：4px 線段，4px 間隔
const MAIN_RESOLUTION_STROKE_COLOR = "#000"; // 黑色
const MAIN_RESOLUTION_STROKE_WIDTH = 2;

// 在 node 建立區塊中，於凍結節點處理後新增
const mainResolutionNodes = node.filter(
  (d) => d.data.proposalType === "main-resolution"
);

// 主決議節點：黑色虛線邊框
mainResolutionNodes
  .selectAll(".node-base-circle")
  .attr("stroke", MAIN_RESOLUTION_STROKE_COLOR)
  .attr("stroke-width", MAIN_RESOLUTION_STROKE_WIDTH)
  .attr("stroke-dasharray", MAIN_RESOLUTION_STROKE_DASHARRAY);

// 在 updateSceneForView 函數中，更新主決議邊框
node
  .filter((d) => d.data.proposalType === "main-resolution")
  .selectAll<SVGCircleElement, d3.HierarchyCircularNode<NodeDatum>>(
    ".node-base-circle"
  )
  .attr("r", (d) => d.r * k)
  .attr("stroke", MAIN_RESOLUTION_STROKE_COLOR)
  .attr("stroke-width", MAIN_RESOLUTION_STROKE_WIDTH)
  .attr("stroke-dasharray", MAIN_RESOLUTION_STROKE_DASHARRAY);
```

**樣式總結**：
- **凍結案**：波浪邊框（粉紅色 `#ff40c8`）- 既有邏輯保持不變
- **刪減案**：實線邊框（黑色）- 既有邏輯保持不變
- **主決議**：虛線邊框（黑色，dasharray `4,4`）- 新增

### 5. 更新圖例

在 `constants/legends.ts` 中確認圖例是否需要調整（目前已包含三種類型）：

```typescript
export const BUDGET_TYPE_LEGEND_ITEMS: LegendItem[] = [
  {
    icon: "/icon/circle-pack-frozen.svg",
    label: "凍結",
    alt: "circle-pack-frozen",
  },
  {
    icon: "/icon/circle-pack-default.svg",
    label: "刪除",
    alt: "circle-pack-default",
  },
  {
    icon: "/icon/circle-pack-main.svg", // 確認此圖示存在且為虛線樣式
    label: "主決議",
    alt: "circle-pack-main",
  },
];
```

**檢查事項**：確認 `/icon/circle-pack-main.svg` 是否已存在，若不存在需建立或調整圖例。

---

## 擬實作步驟（順序）

### 階段一：型別定義與基礎設施（低風險）

1. **擴充 NodeDatum 型別** (`app/visualization/helpers.ts`)
   - 新增 `ProposalType` 型別定義
   - 在 `NodeDatum` 中新增 `proposalType?: ProposalType`
   - 確保型別匯出正確

2. **新增 Circle Pack Chart 常數** (`app/visualization/circle-pack-chart.tsx`)
   - 在檔案頂部新增主決議邊框相關常數
   - `MAIN_RESOLUTION_STROKE_DASHARRAY`
   - `MAIN_RESOLUTION_STROKE_COLOR`
   - `MAIN_RESOLUTION_STROKE_WIDTH`

### 階段二：資料轉換邏輯調整（核心變更）

3. **重構依立委資料轉換** (`app/visualization/helpers.ts` - `transformToGroupedByLegislatorData`)
   - 移除立委層級的 parent circle
   - 將凍結/刪減/主決議直接作為 root 的 children
   - 依 mode 條件性包含主決議（僅 count 模式）
   - 為每個節點設定正確的 `proposalType`
   - 所有節點使用立委黨派顏色

4. **重構依部會資料轉換** (`app/visualization/helpers.ts` - `transformToCategorizedData`)
   - 將每個立委的每種類型拆分為獨立節點
   - 依 mode 條件性包含主決議（僅 count 模式）
   - 為每個節點設定正確的 `proposalType`
   - 保持部會分類結構不變

### 階段三：視覺化樣式實作（中風險）

5. **實作主決議虛線邊框** (`app/visualization/circle-pack-chart.tsx`)
   - 在節點建立區塊中過濾出主決議節點
   - 設定虛線邊框樣式
   - 在 `updateSceneForView` 中同步更新主決議邊框
   - 確保 hover 與縮放時虛線樣式正確維持

6. **調整邊框更新邏輯** (`app/visualization/circle-pack-chart.tsx`)
   - 確保 `updateSceneForView` 函數正確處理三種邊框類型
   - 凍結案：波浪邊框
   - 刪減案：實線邊框
   - 主決議：虛線邊框

### 階段四：驗證與修正（高優先）

7. **手動測試四種情況**
   - 情況一：依立委、依金額 - 確認主決議不顯示，扁平化結構
   - 情況二：依部會、依金額 - 確認邊框區分，主決議不顯示
   - 情況三：依立委、依數量 - 確認主決議顯示且為虛線，扁平化結構
   - 情況四：依部會、依數量 - 確認邊框區分，主決議顯示且為虛線

8. **檢查圖例** (`public/icon/` 或 `app/constants/legends.ts`)
   - 確認 `circle-pack-main.svg` 圖示存在
   - 若不存在，建立虛線樣式的圖示或調整圖例顯示

9. **效能與互動驗證**
   - 確認縮放、hover、點擊等互動功能正常
   - 確認扁平化結構不影響效能
   - 檢查控制台無錯誤或警告

---

## 偵錯與錯誤處理策略

### 1. 型別安全

- 使用 TypeScript 嚴格模式，確保所有 `proposalType` 賦值正確
- 在資料轉換函數中加入防衛性檢查：
  ```typescript
  if (!mainProposer) {
    console.warn(`Proposal ${proposal.id} missing proposer`);
    return;
  }
  ```

### 2. 資料驗證

- 在開發環境中加入資料完整性檢查：
  ```typescript
  if (process.env.NODE_ENV === "development") {
    allNodes.forEach(node => {
      if (!node.proposalType) {
        console.warn(`Node ${node.id} missing proposalType`);
      }
    });
  }
  ```

### 3. 視覺化除錯

- 使用瀏覽器開發者工具檢查 SVG 元素的 `stroke-dasharray` 屬性
- 在控制台輸出轉換後的資料結構以驗證扁平化：
  ```typescript
  console.log("Legislator nodes:", allNodes.length, allNodes);
  ```

### 4. 回退機制

- 保留舊的資料轉換函數，在新邏輯失敗時可快速切換
- 邊框樣式錯誤不應影響圖表渲染，設定預設值：
  ```typescript
  .attr("stroke", (d) => {
    if (d.data.proposalType === "main-resolution") return MAIN_RESOLUTION_STROKE_COLOR;
    if (d.data.isFrozen) return "none";
    return "#000";
  });
  ```

---

## 驗證關卡（可執行）

```bash
# 1. 型別檢查
pnpm typecheck

# 2. 程式碼風格檢查
pnpm lint:check

# 3. 建置測試
pnpm build

# 4. 本地開發伺服器
pnpm dev
```

### 手動驗證步驟

#### 情況一：依立委、依金額
1. 進入 `/visualization`
2. 確認「依立委」tab 已選取
3. 確認「依金額（刪減/凍結）」已選取
4. **驗證點**：
   - [ ] 沒有主決議節點顯示
   - [ ] 同一立委的凍結案和刪減案是分開的兩個 circle（無 parent circle）
   - [ ] 凍結案有波浪邊框（粉紅色）
   - [ ] 刪減案有實線邊框（黑色）
   - [ ] 所有 circle 顏色為立委黨派顏色
   - [ ] 點擊凍結/刪減 circle 導向正確

#### 情況二：依部會、依金額
1. 進入 `/visualization`
2. 選取「依部會」tab
3. 確認「依金額（刪減/凍結）」已選取
4. **驗證點**：
   - [ ] 沒有主決議節點顯示
   - [ ] 凍結案有波浪邊框（粉紅色）
   - [ ] 刪減案有實線邊框（黑色）
   - [ ] 同一立委的不同類型是分開的節點

#### 情況三：依立委、依數量
1. 進入 `/visualization`
2. 選取「依立委」tab
3. 選取「依數量（凍結案/刪減案/建議案）」
4. **驗證點**：
   - [ ] 主決議節點有顯示
   - [ ] 主決議有黑色虛線邊框
   - [ ] 同一立委的三種類型（凍結/刪減/主決議）是分開的三個 circle（無 parent circle）
   - [ ] Circle 大小反映案件數量
   - [ ] 所有 circle 顏色為立委黨派顏色
   - [ ] 標籤顯示正確（例如「王世堅\n主決議\n5案」）

#### 情況四：依部會、依數量
1. 進入 `/visualization`
2. 選取「依部會」tab
3. 選取「依數量（凍結案/刪減案/建議案）」
4. **驗證點**：
   - [ ] 主決議節點有顯示
   - [ ] 主決議有黑色虛線邊框
   - [ ] 凍結案有波浪邊框（粉紅色）
   - [ ] 刪減案有實線邊框（黑色）
   - [ ] 同一立委的不同類型是分開的節點

#### 整體驗證
- [ ] 所有互動（zoom、hover、click）正常運作
- [ ] 頁面切換（立委/部會、金額/數量）無錯誤
- [ ] 控制台無 warning 或 error
- [ ] 圖例與實際樣式一致
- [ ] 手機版視圖正常

---

## Pseudocode（關鍵變更示意）

### 1. 資料轉換（依立委）

```typescript
// transformToGroupedByLegislatorData
const allNodes: NodeDatum[] = [];

for (const [proposerId, proposals] of groupedByLegislator) {
  const proposer = proposals[0].proposers[0];
  const partyColor = getPartyColor(proposer);
  
  // 凍結案（兩種模式都顯示）
  const freezeData = aggregateProposals(proposals, "freeze");
  if (shouldShow(freezeData, mode)) {
    allNodes.push({
      id: `${proposerId}-freeze`,
      name: formatName(proposer, "凍結", freezeData, mode),
      value: calculateValue(freezeData, mode),
      color: partyColor,
      proposalType: "freeze",
      isFrozen: true,
    });
  }
  
  // 刪減案（兩種模式都顯示）
  const reduceData = aggregateProposals(proposals, "reduce");
  if (shouldShow(reduceData, mode)) {
    allNodes.push({
      id: `${proposerId}-reduce`,
      name: formatName(proposer, "刪減", reduceData, mode),
      value: calculateValue(reduceData, mode),
      color: partyColor,
      proposalType: "reduce",
    });
  }
  
  // 主決議（僅 count 模式）
  if (mode === "count") {
    const mainData = aggregateProposals(proposals, "main-resolution");
    if (shouldShow(mainData, mode)) {
      allNodes.push({
        id: `${proposerId}-main`,
        name: formatName(proposer, "主決議", mainData, mode),
        value: calculateValue(mainData, mode),
        color: partyColor,
        proposalType: "main-resolution",
      });
    }
  }
}

return { 立委提案彙整: { id: "root", name: "root", children: allNodes } };
```

### 2. 邊框樣式（Circle Pack Chart）

```typescript
// 在節點建立後
const mainResolutionNodes = node.filter(
  (d) => d.data.proposalType === "main-resolution"
);

mainResolutionNodes
  .selectAll(".node-base-circle")
  .attr("stroke", "#000")
  .attr("stroke-width", 2)
  .attr("stroke-dasharray", "4,4");

// 在 updateSceneForView 中
node
  .selectAll<SVGCircleElement>(".node-base-circle")
  .attr("stroke", (d) => {
    if (d.data.proposalType === "main-resolution") return "#000";
    if (d.data.isFrozen) return "none";
    return "#000";
  })
  .attr("stroke-dasharray", (d) => {
    return d.data.proposalType === "main-resolution" ? "4,4" : "none";
  });
```

---

## 驗收標準

### 功能性
- [ ] **情況一（依立委、依金額）**：主決議不顯示，同一立委的凍結/刪減為獨立 circles
- [ ] **情況二（依部會、依金額）**：邊框正確區分凍結（波浪）/刪減（實線）
- [ ] **情況三（依立委、依數量）**：主決議顯示且為黑色虛線，同一立委的三種類型為獨立 circles
- [ ] **情況四（依部會、依數量）**：邊框正確區分三種類型

### 視覺與互動
- [ ] 所有邊框樣式清晰可辨
- [ ] 顏色使用立委黨派色
- [ ] Zoom、hover、click 互動正常
- [ ] 標籤文字正確顯示立委名稱與金額/數量

### 品質
- [ ] `pnpm typecheck` 通過
- [ ] `pnpm lint:check` 通過
- [ ] `pnpm build` 成功
- [ ] 無控制台錯誤或警告
- [ ] 不破壞現有功能（如導航、篩選）

---

## 風險與退場機制

### 風險一：扁平化結構導致效能問題

**可能性**：中
**影響**：中

當節點數量大幅增加（例如 100+ 立委 × 3 種類型 = 300+ 節點）時，可能影響渲染效能。

**緩解措施**：
- 限制初始顯示節點數（例如依金額/數量排序後取前 100）
- 在開發環境測試大數據集
- 若效能不佳，考慮延遲載入或虛擬化

**退場方案**：
保留原有層級結構的程式碼，提供 feature flag 切換：
```typescript
const USE_FLAT_STRUCTURE = true; // 可透過環境變數控制
```

### 風險二：虛線邊框在不同裝置/瀏覽器顯示不一致

**可能性**：低
**影響**：低

SVG `stroke-dasharray` 在某些舊瀏覽器或低解析度螢幕上可能顯示不佳。

**緩解措施**：
- 使用常見的 dasharray 值（`4,4`）
- 在多種裝置測試（桌面、平板、手機）
- 記錄不支援的瀏覽器版本

**退場方案**：
改用純色邊框並在標籤中加入文字標示（例如「主決議」）

### 風險三：資料轉換邏輯錯誤導致節點遺失或重複

**可能性**：中
**影響**：高

重構資料轉換邏輯可能導致某些提案未正確分類或重複顯示。

**緩解措施**：
- 在開發環境加入資料驗證與 console 輸出
- 比對新舊邏輯的輸出節點數量
- 撰寫單元測試驗證轉換函數

**退場方案**：
```typescript
// 保留舊函數並重新命名
export const transformToGroupedByLegislatorDataLegacy = (/* ... */) => { /* 原邏輯 */ };

// 在主函數中加入切換邏輯
export const transformToGroupedByLegislatorData = (data, mode) => {
  if (USE_NEW_TRANSFORM_LOGIC) {
    return transformToGroupedByLegislatorDataNew(data, mode);
  }
  return transformToGroupedByLegislatorDataLegacy(data, mode);
};
```

---

## 品質檢查與一通過信心分數

### 檢查清單

- [x] **必要上下文已包含**：現有程式碼參考、型別定義、資料流
- [x] **外部研究已完成**：D3.js 文檔、SVG 邊框屬性、相關 PRP 範例
- [x] **實作步驟清晰**：分階段、有順序、可驗證
- [x] **驗證關卡可執行**：包含自動化與手動測試步驟
- [x] **錯誤處理已規劃**：型別安全、資料驗證、視覺化除錯
- [x] **風險已識別並有退場機制**：效能、相容性、資料正確性
- [x] **符合專案規範**：Zustand 模式、TypeScript 型別、Commit 慣例

### 潛在挑戰

1. **資料轉換邏輯複雜度**：需要仔細處理多種模式與類型的組合
2. **邊框樣式維護**：需要確保在所有縮放與互動情境下正確顯示
3. **測試覆蓋**：四種情況的組合測試需要完整覆蓋

### 信心分數：8/10

**理由**：
- ✅ 現有程式碼結構良好，有清晰的資料轉換與視覺化分離
- ✅ D3.js 與 SVG 邊框技術成熟穩定
- ✅ 型別系統提供良好的安全保障
- ⚠️ 扁平化結構可能需要微調效能或 padding
- ⚠️ 四種情況的測試需要時間，可能需要小幅迭代

**降低風險的措施**：
- 分階段實作，每個階段都進行驗證
- 保留舊程式碼作為參考與退場方案
- 在開發環境充分測試後再部署

---

## 參考資源

### 內部文件
- `app/visualization/helpers.ts` - 資料轉換邏輯
- `app/visualization/circle-pack-chart.tsx` - D3 視覺化元件
- `app/constants/legends.ts` - 圖例定義
- `PRPs/refactor-d3.md` - D3 重構範例
- `PRPs/visualization-fix.md` - 視覺化修復範例

### 外部資源
- [D3.js Hierarchy](https://github.com/d3/d3-hierarchy)
- [D3.js Shape](https://github.com/d3/d3-shape)
- [SVG stroke-dasharray](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray)
- [Zoomable Circle Packing](https://observablehq.com/@d3/zoomable-circle-packing)

---

## 後續優化建議（非本次範圍）

1. **效能優化**：若節點數量持續增長，考慮實作虛擬化或分頁
2. **可訪問性**：為不同邊框樣式加入 ARIA 標籤
3. **互動增強**：支援鍵盤導航與螢幕閱讀器
4. **測試自動化**：撰寫視覺回歸測試確保邊框樣式正確
5. **文檔完善**：更新使用者文檔說明不同視圖的差異

