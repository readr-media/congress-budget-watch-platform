## Feats

1. new GQL query
```gql
query BudgetYear($where: BudgetYearWhereUniqueInput!) {
  budgetYear(where: $where) {
    budgetProgress
    year
    dataProgress
  }
}
```
expect response:
```
{
  "data": {
    "budgetYear": {
      "budgetProgress": "presidential-promulgation",
      "year": 114,
      "dataProgress": "completed"
    }
  }
}
```
2. 這個query的資料需要用在首頁(`app/routes/home.tsx`):
```tsx
{/* Banner Image */}
<div className="mb-8 flex justify-center">
<Image
    src="/image/homepage-banner.svg"
    alt="國會預算監督平台 Banner"
    className="h-auto w-full max-w-2xl"
/>
</div>
```
這個元件的下方。

3. 在元件(`app/routes/home.tsx`)中應用：
```tsx
<div className="-mt-1 flex w-full max-w-[600px] items-center justify-start rounded-lg bg-[#3E51FF] pl-1 text-white">
    <p className="mr-2 hidden w-[160px] rounded-lg bg-white px-3.5 text-[#3E51FF] md:flex">
    最新審議進度
    </p>
    <div className="flex w-full items-center justify-between">
    <p className="flex grow border-r border-white py-1 justify-center">
        115 年度中央政府總預算審議中
    </p>
    <p className="flex px-2">50%</p>
    </div>
</div>
``` 
這裡的資料是寫死的，請換成真實資料

4. api資料轉換成畫面資訊：
dataProgress如果是"completed"是「完成」，"in-progress"就會是「審議中」
5. 對應`app/all-budgets/page-content.ts`：
```ts
const content = {
  title: "114 年中央政府總預算",
  progressToggle: "114年度 (2025)",
  progressLabels: [
    "中央政府提出預算",
    "立法院委員會審議",
    "黨團協商",
    "院會決議",
    "預算三讀通過",
    "預算總統公布",
  ],
};
```
依序對應：
"government-proposed"
"committee-review"
"party-negotiation"
"plenary-decision"
"final-reviewed"
"presidential-promulgation"

請你依照可能會掉用的方式重構這個單純的物件。
6. 所以首頁主要會應用到的資料會是budgetYear.year, budgetYear.dataProgress, 然後組成：`${budgetYear.year} 年度中央政府總預算${budgetYear.dataProgress}`

7.budgetProgress 這個資料會使用在<ProgressBar />這個元件，如果當前的label === budgetProgress那麼在這個Label之前的都是isFinished，這個label之後的都是未完成。

## Reminders
1. 我希望每個GQL query都只拿取會用到的，所以看看是否能夠通過fragment或是拆分query（寫成多個），讓網路不要拿去沒用到的資料。
2. 不要破壞既有的邏輯與排版。