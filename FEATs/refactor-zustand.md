## Docs
1. https://zustand.docs.pmnd.rs/guides/immutable-state-and-merging
2. https://zustand.docs.pmnd.rs/guides/updating-state
3. https://zustand.docs.pmnd.rs/guides/auto-generating-selectors

## Feats
1. 我希望可以依照官方網站文件使用zustand
2. 先盤查這個repo(codebase)中有使用到zustand的地方、使用方式。
3. 檢查是否符合官方網站文件pattern
4. codebase 有安裝immer，確保每個store都有透過immer去發會效用。
5. 檢查是否有應該要透過zustand管理state但沒有使用的。

## Reminders
1. 如果發現現有的做法有問題要提出
2. 不要破壞原本的功能
3. 要注意複用性(DRY原則)
4. 可以多多利用functional programming的概念（參考：https://github.com/lodash/lodash/wiki/FP-Guide）
5. code已經安裝 lodash請多利用（呼應第四點）