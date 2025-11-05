## Feats

### 情況一：`/visualization` 依立委、依金額
1. 主決議不需要視覺化顯示（凍結金額、刪減金額都是0）。
2. 同一個立委不需要包在同一個parent circle裡面了：王世堅委員的刪減案、凍結案是兩顆circle。並且這兩顆circle的顏色都是王世堅委員的黨派顏色(proposer.party.color)。

### 情況二：`/visualization` 依部會、依金額

1. 不同的類型要用對應的邊框表示（凍結、刪減）。

### 情況三：`/visualization` 依立委、依數量
1. 主決議要顯示，並且邊框樣式為黑色虛線
2. circle的大小由數量決定，王世堅委員的刪減案有12案，那麼他就只會有一顆circle，並且標示王世堅、12案。
3. 同一個立委不需要包在同一個parent circle裡面了：王世堅委員的刪減案、凍結案是兩顆circle。並且這兩顆circle的顏色都是王世堅委員的黨派顏色(proposer.party.color)。

### 情況四：`/visualization` 依部會、依數量
1. 不同的類型要用對應的邊框表示（凍結、刪減）。

## Reminders
1. 不要破壞現有邏輯
2. 不要破壞其他已經不需更新的樣式