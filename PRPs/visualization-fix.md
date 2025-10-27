# 視覺化修復 PRP

## 概述

本 PRP 旨在解決 `visualization-fix.md` 中提出的三個視覺化相關問題：

1. **高優先級** - `circle-pack-chart.tsx` 中的 `onNodeClick` 屬性未被正確調用
2. **中優先級** - `session-chart.tsx` 中使用了不存在的 `border-b-1` Tailwind 類別
3. **低優先級** - `legislator/index.tsx` 中遺留了 debug console.log

## 背景與動機

視覺化功能是我們應用程式的核心部分，確保其正確運作對用戶體驗至關重要。目前存在的問題影響了功能的完整性和界面的一致性。

## 技術細節

### 問題 1: circle-pack-chart.tsx 中的 onNodeClick 回調問題

**問題描述：**
`circle-pack-chart.tsx` 組件接受 `onNodeClick` 屬性，但在 D3 點擊處理程序中從未調用它。這導致父組件中的回調邏輯（如 `app/visualization/index.tsx` 中的 `handleNodeClick`）無法執行。

**受影響文件：**
- `app/visualization/circle-pack-chart.tsx` (第 12 行定義了 prop，第 371-385 行是點擊處理邏輯)
- `app/visualization/index.tsx` (第 127-134 行定義了 `handleNodeClick` 函數)

**解決方案：**
修改 `circle-pack-chart.tsx` 中的點擊處理邏輯，確保調用 `onNodeClick` 回調函數。

```typescript
// 在 node.on("click", ...) 處理程序中添加調用
node.on("click", (event, d) => {
  // 防止在拖曳後觸發點擊
  if (event.defaultPrevented) return;

  // 調用 onNodeClick 回調（如果提供）
  if (props.onNodeClick) {
    props.onNodeClick(d.data);
  }

  // 現有邏輯...
  if (d.data.proposerId && isVisualizationRoute && !d.children) {
    navigate(`/visualization/legislator/${d.data.proposerId}`);
    event.stopPropagation();
    return;
  }
  // 否則執行 zoom 效果
  if (focus !== d) {
    zoom(event as unknown as MouseEvent, d);
    event.stopPropagation();
  }
});
```

### 問題 2: session-chart.tsx 中的 border-b-1 問題

**問題描述：**
`app/visualization/legislator/session-chart.tsx` 中使用了 `border-b-1` Tailwind 類別，但 Tailwind 實際上並沒有這個預設類別，導致分隔線無法渲染。

**受影響文件：**
- `app/visualization/legislator/session-chart.tsx` (第 4-5 行)

**解決方案：**
將 `border-b-1` 替換為 Tailwind 支持的 `border-b` 或 `border-b-[1px]`。

```typescript
// 修改前
const getBorderBottomClass = (index: number, totalItems: number) => {
  return totalItems > 1 && index < totalItems - 1 ? "border-b-1" : "";
};

// 修改後
const getBorderBottomClass = (index: number, totalItems: number) => {
  return totalItems > 1 && index < totalItems - 1 ? "border-b" : "";
};

// 或者更明確地指定 1px 寬度
const getBorderBottomClass = (index: number, totalItems: number) => {
  return totalItems > 1 && index < totalItems - 1 ? "border-b-[1px]" : "";
};
```

### 問題 3: legislator/index.tsx 中的 console.log

**問題描述：**
`app/visualization/legislator/index.tsx` 第 78 行有一個 debug console.log 語句，會在每次數據獲取時向瀏覽器控制台輸出信息。

**受影響文件：**
- `app/visualization/legislator/index.tsx` (第 78 行)

**解決方案：**
刪除該 console.log 語句。

```typescript
// 修改前
console.log("proposalsData", proposalsData);

// 修改後
// 刪除整行
```

## 實施計劃

按照以下順序解決問題：

1. **修復 onNodeClick 回調問題**
   - 檢查 `circle-pack-chart.tsx` 中的點擊處理邏輯
   - 在適當位置添加 `onNodeClick` 調用
   - 確保傳遞正確的節點數據

2. **修復 border-b-1 問題**
   - 將 `session-chart.tsx` 中的 `border-b-1` 替換為 `border-b` 或 `border-b-[1px]`
   - 確認樣式正確應用

3. **移除 debug console.log**
   - 刪除 `legislator/index.tsx` 中的 console.log 語句

## 驗證步驟

1. **onNodeClick 功能驗證**
   - 確保在點擊節點時調用了父組件的 `handleNodeClick` 函數
   - 驗證導航和縮放功能仍然正常工作

2. **邊框樣式驗證**
   - 確認會話項目之間的分隔線正確顯示
   - 確保最後一個項目沒有底部邊框

3. **控制台輸出驗證**
   - 確認瀏覽器控制台中不再顯示 `proposalsData` 的調試輸出

## 風險與緩解

1. **onNodeClick 修改風險**
   - **風險**: 可能影響現有的導航和縮放功能
   - **緩解**: 保留所有現有邏輯，只添加回調調用，並進行全面測試

2. **樣式修改風險**
   - **風險**: 邊框可能顯示不一致
   - **緩解**: 使用 Tailwind 官方支持的類別，確保樣式一致性

## 相關資源

- [Tailwind CSS 邊框文檔](https://tailwindcss.com/docs/border-width)
- [D3.js 事件處理文檔](https://github.com/d3/d3-selection#handling-events)

## 實施後續

完成修復後，應進行以下步驟：

1. 更新相關文檔（如果有）
2. 通知團隊成員關於這些修復
3. 考慮添加測試以防止類似問題再次發生

## 信心評分

8/10 - 問題明確，解決方案直接，實施風險較低。

