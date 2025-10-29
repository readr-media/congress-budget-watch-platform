# PRP: Add Dynamic Budget Progress Bar to Homepage

## 1. Overview

This PRP outlines the implementation of a dynamic budget progress indicator on the homepage (`app/routes/home.tsx`). The feature will fetch the latest budget year's progress data from the GraphQL API and display it in a styled progress banner beneath the homepage banner image. This will replace the current hardcoded "115 年度中央政府總預算審議中 50%" text with real-time data.

## 2. Rationale

Currently, the homepage displays static progress information that requires manual updates. By fetching this data dynamically from the API, we ensure that users always see the most current budget審議進度 (deliberation progress) without requiring code changes. This aligns with the platform's goal of providing real-time budget oversight information.

## 3. Feature Requirements

Based on `FEATs/add-progress-bar.md`:

1. **New GraphQL Query**: Fetch `budgetYear` data including `year`, `budgetProgress`, and `dataProgress`
2. **Homepage Integration**: Display progress information below the banner image
3. **Data Transformation**: Convert API response to human-readable text
4. **Progress Percentage**: Calculate completion percentage based on current stage
5. **Refactor Content Structure**: Make `page-content.ts` reusable for mapping progress stages
6. **Network Efficiency**: Only fetch required fields using GraphQL best practices

### Progress Stage Mapping

The API's `budgetProgress` field maps to Chinese labels as follows:

| API Value (`budgetProgress`) | Display Label (Chinese) |
|------------------------------|-------------------------|
| `government-proposed` | 中央政府提出預算 |
| `committee-review` | 立法院委員會審議 |
| `party-negotiation` | 黨團協商 |
| `plenary-decision` | 院會決議 |
| `final-reviewed` | 預算三讀通過 |
| `presidential-promulgation` | 預算總統公布 |

### Data Progress Mapping

- `completed` → "完成"
- `in-progress` → "審議中"

## 4. Implementation Blueprint

### Task 1: Create Constants for Progress Stages

**Goal**: Create a centralized, typed constant structure for progress stages that can be reused across components.

**File to Create/Modify**: `app/constants/progress-stages.ts` (new file)

**Pseudocode**:

```typescript
// app/constants/progress-stages.ts

// Define the possible budget progress stages as a const enum or literal type
export const BUDGET_PROGRESS_STAGES = {
  GOVERNMENT_PROPOSED: 'government-proposed',
  COMMITTEE_REVIEW: 'committee-review',
  PARTY_NEGOTIATION: 'party-negotiation',
  PLENARY_DECISION: 'plenary-decision',
  FINAL_REVIEWED: 'final-reviewed',
  PRESIDENTIAL_PROMULGATION: 'presidential-promulgation',
} as const;

export type BudgetProgressStage = typeof BUDGET_PROGRESS_STAGES[keyof typeof BUDGET_PROGRESS_STAGES];

// Define the mapping between API values and Chinese labels
export const PROGRESS_STAGE_LABELS: Record<BudgetProgressStage, string> = {
  [BUDGET_PROGRESS_STAGES.GOVERNMENT_PROPOSED]: '中央政府提出預算',
  [BUDGET_PROGRESS_STAGES.COMMITTEE_REVIEW]: '立法院委員會審議',
  [BUDGET_PROGRESS_STAGES.PARTY_NEGOTIATION]: '黨團協商',
  [BUDGET_PROGRESS_STAGES.PLENARY_DECISION]: '院會決議',
  [BUDGET_PROGRESS_STAGES.FINAL_REVIEWED]: '預算三讀通過',
  [BUDGET_PROGRESS_STAGES.PRESIDENTIAL_PROMULGATION]: '預算總統公布',
};

// Ordered array for calculating progress percentage
export const PROGRESS_STAGE_ORDER: BudgetProgressStage[] = [
  BUDGET_PROGRESS_STAGES.GOVERNMENT_PROPOSED,
  BUDGET_PROGRESS_STAGES.COMMITTEE_REVIEW,
  BUDGET_PROGRESS_STAGES.PARTY_NEGOTIATION,
  BUDGET_PROGRESS_STAGES.PLENARY_DECISION,
  BUDGET_PROGRESS_STAGES.FINAL_REVIEWED,
  BUDGET_PROGRESS_STAGES.PRESIDENTIAL_PROMULGATION,
];

// Data progress mapping
export const DATA_PROGRESS_LABELS = {
  completed: '完成',
  'in-progress': '審議中',
} as const;

export type DataProgress = keyof typeof DATA_PROGRESS_LABELS;
```

**Pattern Reference**: Similar to how `app/constants/enums.ts` defines `SortDirection` and other enums.

---

### Task 2: Refactor page-content.ts

**Goal**: Make the existing `page-content.ts` structure dynamic by using the newly created constants.

**File to Modify**: `app/all-budgets/page-content.ts`

**Pseudocode**:

```typescript
// app/all-budgets/page-content.ts

import { PROGRESS_STAGE_LABELS, PROGRESS_STAGE_ORDER } from '~/constants/progress-stages';

const content = {
  title: '114 年中央政府總預算',
  progressToggle: '114年度 (2025)',
  progressLabels: PROGRESS_STAGE_ORDER.map(stage => PROGRESS_STAGE_LABELS[stage]),
};

export default content;
```

**Validation**: Ensure that the existing `ProgressBar` component in `app/all-budgets/index.tsx` (lines 318-322, 367) still works correctly after this change.

---

### Task 3: Create GraphQL Query and Helpers

**Goal**: Create a new query to fetch the latest budget year progress data (with a built-in fallback to the most recent historical record) and helper functions to process it.

**File to Create**: `app/queries/budget-year.queries.ts` (new file)

**Pseudocode**:

```typescript
// app/queries/budget-year.queries.ts

import { graphql } from "~/graphql";

/**
 * GraphQL query to get the most recent budget year progress information.
 * We sort by year descending and take the first item so the UI always
 * displays the latest available data even if the current year is not ready yet.
 */
export const GET_LATEST_BUDGET_YEAR_QUERY = graphql(`
  query GetLatestBudgetYear($skip: Int!, $take: Int!) {
    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {
      year
      budgetProgress
      dataProgress
    }
  }
`);

/**
 * React Query keys for budget year queries
 */
export const budgetYearQueryKeys = {
  all: ["budgetYear"] as const,
  list: (skip = 0, take = 1) =>
    [...budgetYearQueryKeys.all, "list", { skip, take }] as const,
  latest: () => [...budgetYearQueryKeys.all, "latest"] as const,
} as const;
```

**Pattern Reference**: Follow the same structure as `app/queries/budget.queries.ts` and `app/queries/collaboration.queries.ts`.

**File to Modify**: `app/queries/index.ts`

Add export:

```typescript
// app/queries/index.ts

// ... existing exports

export {
  GET_BUDGET_YEAR_QUERY,
  budgetYearQueryKeys,
} from './budget-year.queries';
```

---

### Task 4: Create Helper Functions for Progress Calculation

**Goal**: Create utility functions to calculate progress percentage and format display text.

**File to Create**: `app/utils/progress.ts` (new file)

**Pseudocode**:

```typescript
// app/utils/progress.ts

import {
  PROGRESS_STAGE_ORDER,
  PROGRESS_STAGE_LABELS,
  DATA_PROGRESS_LABELS,
  type BudgetProgressStage,
  type DataProgress,
} from '~/constants/progress-stages';

/**
 * Calculate progress percentage based on current budget progress stage
 * @param currentStage - The current budget progress stage
 * @returns Percentage (0-100) rounded to nearest integer
 */
export function calculateProgressPercentage(
  currentStage: BudgetProgressStage | null | undefined
): number {
  if (!currentStage) return 0;

  const currentIndex = PROGRESS_STAGE_ORDER.indexOf(currentStage);
  if (currentIndex === -1) return 0;

  // Calculate percentage: (current_stage_index + 1) / total_stages * 100
  // +1 because we count the current stage as completed
  const totalStages = PROGRESS_STAGE_ORDER.length;
  const percentage = ((currentIndex + 1) / totalStages) * 100;

  return Math.round(percentage);
}

/**
 * Format progress text for homepage display
 * @param year - Budget year (e.g., 115)
 * @param dataProgress - Data progress status
 * @returns Formatted string (e.g., "115 年度中央政府總預算審議中")
 */
export function formatProgressText(
  year: number | null | undefined,
  dataProgress: string | null | undefined
): string {
  if (!year) return '載入中...';

  const progressLabel = dataProgress && dataProgress in DATA_PROGRESS_LABELS
    ? DATA_PROGRESS_LABELS[dataProgress as DataProgress]
    : '進行中';

  return `${year} 年度中央政府總預算${progressLabel}`;
}

/**
 * Get human-readable label for budget progress stage
 */
export function getProgressStageLabel(stage: BudgetProgressStage | null | undefined): string {
  if (!stage || !(stage in PROGRESS_STAGE_LABELS)) {
    return '未知階段';
  }
  return PROGRESS_STAGE_LABELS[stage];
}
```

**Pattern Reference**: Similar utility functions can be found in `app/utils/format.ts`.

---

### Task 5: Integrate Progress Data into Homepage

**Goal**: Fetch budget year data in the homepage component and replace the hardcoded progress banner. Always display the most recent record (even if the current ROC year is not yet available) and handle loading/error states explicitly.

**File to Modify**: `app/routes/home.tsx`

**Detailed Implementation Steps**:

1. **Import Required Dependencies**:

```typescript
import { useQuery } from "@tanstack/react-query";
import { execute } from "~/graphql/execute";
import { GET_LATEST_BUDGET_YEAR_QUERY, budgetYearQueryKeys } from "~/queries";
import { calculateProgressPercentage, formatProgressText } from "~/utils/progress";
import type { GetLatestBudgetYearQuery } from "~/graphql/graphql";
```

2. **Inside the `Home` Component, Add Data Fetching**:

```typescript
export default function Home() {
  const {
    data: budgetYearData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: budgetYearQueryKeys.latest(),
    queryFn: () =>
      execute(GET_LATEST_BUDGET_YEAR_QUERY, {
        skip: 0,
        take: 1,
      }),
  });

  const latestBudgetYear =
    (budgetYearData as GetLatestBudgetYearQuery | undefined)?.budgetYears?.[0] ?? null;

  const progressPercentage = calculateProgressPercentage(latestBudgetYear?.budgetProgress);
  const progressText = formatProgressText(latestBudgetYear?.year, latestBudgetYear?.dataProgress);

  // ... rest of component
}
```

3. **Replace Hardcoded Progress Banner**:

```tsx
{isLoading ? (
  <div className="-mt-1 flex w-full max-w-[600px] items-center justify-center rounded-lg bg-gray-300 p-2 text-gray-600">
    載入審議進度中...
  </div>
) : isError ? (
  <div className="-mt-1 flex w-full max-w-[600px] items-center justify-center rounded-lg bg-red-100 p-2 text-red-600">
    審議進度載入失敗，請稍後再試
  </div>
) : latestBudgetYear ? (
  <div className="-mt-1 flex w-full max-w-[600px] items-center justify-start rounded-lg bg-[#3E51FF] pl-1 text-white">
    <p className="mr-2 hidden w-[160px] rounded-lg bg-white px-3.5 text-[#3E51FF] md:flex">
      最新審議進度
    </p>
    <div className="flex w-full items-center justify-between">
      <p className="flex grow justify-center border-r border-white py-1">
        {progressText}
      </p>
      <p className="flex px-2">{progressPercentage}%</p>
    </div>
  </div>
) : (
  <div className="-mt-1 flex w-full max-w-[600px] items-center justify-center rounded-lg bg-gray-300 p-2 text-gray-600">
    暫無審議進度資料
  </div>
)}
```

**Pattern Reference**: Data fetching pattern matches `app/routes/collaboration.tsx` (lines 23-26) and now includes explicit error handling.

---

### Task 6: Update ProgressBar Component (Optional Enhancement)

**Goal**: Enhance the `ProgressBar` component to accept a `currentStage` prop to automatically determine which labels should be marked as finished.

**File to Modify**: `app/components/progress-bar.tsx`

**Note**: This task is marked as **optional** because the current implementation on the all-budgets page doesn't use this feature. However, it would be useful for future enhancements.

**Pseudocode**:

```typescript
// app/components/progress-bar.tsx

import { PROGRESS_STAGE_ORDER, type BudgetProgressStage } from '~/constants/progress-stages';

type ProgressBarProps = {
  // ... existing props
  currentStage?: BudgetProgressStage | null; // New prop
  labels?: string[];
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  isFinished = true,
  count = 6,
  width = 165,
  height = 48,
  gap = 16,
  className = "",
  labels = [],
  isDesktop = false,
  currentStage, // New prop
}) => {
  // Calculate which stages are finished based on currentStage
  const currentStageIndex = currentStage
    ? PROGRESS_STAGE_ORDER.indexOf(currentStage)
    : -1;

  // In the desktop rendering section (lines 42-55), enhance to show finished/unfinished states
  return (
    // ... existing render logic, enhanced to use currentStageIndex to determine styling
  );
};
```

**Implementation Note**: This enhancement would require modifying the desktop view's rendering logic to apply different styles (green vs. blue) based on whether the stage is before or after the `currentStageIndex`.

---

## 5. GraphQL Schema Reference

From `schema.graphql`:

```graphql
type BudgetYear {
  budgetProgress: String
  dataProgress: String
  year: Int
  # ... other fields
}

type Query {
  budgetYears(
    orderBy: [BudgetYearOrderByInput!]
    skip: Int
    take: Int
  ): [BudgetYear]
}
```

**Query Usage**:
```graphql
query GetLatestBudgetYear($skip: Int!, $take: Int!) {
  budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {
    year
    budgetProgress
    dataProgress
  }
}
```

**Variables**:
```json
{
  "skip": 0,
  "take": 1
}
```

## 6. Task Execution Order

To ensure a smooth implementation, execute tasks in this order:

1. ✅ **Task 1**: Create `app/constants/progress-stages.ts`
2. ✅ **Task 2**: Refactor `app/all-budgets/page-content.ts`
3. ✅ **Task 3**: Create `GET_LATEST_BUDGET_YEAR_QUERY` in `app/queries/budget-year.queries.ts` and export in `index.ts`
4. ✅ **Task 4**: Create utility functions in `app/utils/progress.ts`
5. ✅ **Task 5**: Integrate data fetching into `app/routes/home.tsx`
6. 🔧 **Task 6**: (Optional) Enhance `ProgressBar` component

**Post-Implementation**:
- Run `pnpm codegen` to generate TypeScript types for the new query
- Run `pnpm typecheck` to verify type safety
- Test the homepage manually to ensure data displays correctly

## 7. Critical Implementation Notes

### Network Efficiency (Requirement #1 from Feature File)

The query is already optimized - we only fetch the three fields we need (`year`, `budgetProgress`, `dataProgress`) rather than all fields on `BudgetYear`. GraphQL fragments are not necessary here because we're not reusing this selection set elsewhere.

### Don't Break Existing Logic (Requirement #2)

- **Task 2** ensures that `app/all-budgets/page-content.ts` still exports the same structure
- **Task 2** validation step confirms the existing `ProgressBar` usages still work
- No changes to existing layout or styling in the homepage except for the progress banner section

### Type Safety

All new code must be properly typed:
- Use generated types from `~/graphql/graphql` (e.g., `GetLatestBudgetYearQuery`)
- Define custom types where needed (e.g., `BudgetProgressStage`, `DataProgress`)
- Leverage TypeScript's `as const` for readonly objects

### Error States

The homepage integration must handle:
- Loading state (`isLoading`)
- Failed fetch (`isError`)
- Missing data (no records returned)
- Invalid `budgetProgress` or `dataProgress` values (fallback to default text)

## 8. Validation Gates

After implementation, verify the following:

### Manual Testing

1. **Homepage Loads Successfully**:
   - Navigate to `/` (homepage)
   - Confirm the progress banner appears below the main banner image
   - Verify no console errors

2. **Data Display**:
   - The progress text shows the format: `{year} 年度中央政府總預算{status}`
   - The percentage displays correctly (e.g., 50%, 83%, 100%)
   - The percentage matches the expected calculation based on the current stage

3. **Loading State**:
   - Refresh the page and observe a loading indicator or "載入中..." text

4. **Error State**:
   - Simulate或暫時中斷請求時，確認顯示「審議進度載入失敗，請稍後再試」

5. **All Budgets Page Still Works**:
   - Navigate to `/all-budgets`
   - Confirm the `ProgressBar` component still displays correctly
   - Verify that the progress labels are correct

### Automated Checks

Run the following commands:

```bash
# Generate GraphQL types from schema
pnpm codegen

# Type check the entire project
pnpm typecheck

# Lint the code
pnpm lint

# Format check
pnpm format:check
```

All commands must pass without errors.

### Type Safety Validation

Ensure that:
- `BudgetYearQuery` type is correctly generated by codegen
- No `any` types are used in the implementation
- All props and function signatures are properly typed

## 9. Code Quality & Best Practices

This implementation follows the project's established patterns:

1. **GraphQL Queries**: Matches the structure in `app/queries/budget.queries.ts`
2. **React Query Usage**: Follows the pattern from `app/routes/collaboration.tsx`
3. **Constants**: Similar approach to `app/constants/enums.ts`
4. **Utility Functions**: Consistent with `app/utils/format.ts`
5. **TypeScript**: Full type safety with no `any` usage (per repository rules)
6. **Component Integration**: Non-invasive changes to existing components

## 10. References

### Documentation

- **GraphQL Best Practices**: [https://graphql.org/learn/best-practices/](https://graphql.org/learn/best-practices/)
- **TanStack Query (React Query)**: [https://tanstack.com/query/latest/docs/framework/react/overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- **GraphQL Code Generator**: [https://the-guild.dev/graphql/codegen](https://the-guild.dev/graphql/codegen)

### Codebase Pattern References

- **GraphQL Query Pattern**: `app/queries/budget.queries.ts`
- **React Query Usage**: `app/routes/collaboration.tsx` (lines 23-26)
- **Constants Definition**: `app/constants/enums.ts`
- **Utility Functions**: `app/utils/format.ts`
- **Component Integration**: `app/all-budgets/index.tsx` (lines 318-322, 367)

### Related Files (for context)

- Feature specification: `FEATs/add-progress-bar.md`
- GraphQL schema: `schema.graphql` (lines 113-124, 188-191)
- Progress bar component: `app/components/progress-bar.tsx`
- Homepage route: `app/routes/home.tsx`
- All budgets content: `app/all-budgets/page-content.ts`

## 11. Potential Pitfalls & Solutions

| Pitfall | Solution |
|---------|----------|
| Query returns `null` for current year | Query `budgetYears` ordered desc and take 1 so we always receive the newest record |
| Invalid `budgetProgress` value | Use type guard in helper function to validate against known stages |
| Breaking `ProgressBar` on all-budgets page | Run manual test after Task 2 to verify existing usage |
| Types not generated after query creation | Remember to run `pnpm codegen` before `pnpm typecheck` |
| Percentage calculation edge cases | Handle `null`/`undefined` in `calculateProgressPercentage` |

## 12. Future Enhancements (Out of Scope)

These are not part of this PRP but could be considered later:

1. Add animation to the progress percentage
2. Implement real-time updates using subscriptions or polling
3. Allow users to click the progress banner to see detailed timeline
4. Add historical progress data comparison
5. Implement the optional Task 6 (enhanced `ProgressBar` component)

---

## Confidence Score: 9/10

**Rationale**: The implementation plan is comprehensive and follows established patterns in the codebase. The GraphQL query is straightforward and now fetches the most recent record automatically, and all necessary utility functions are clearly defined. The remaining uncertainty is whether the API exposes `budgetYears` with the expected ordering semantics, but we have fallbacks for loading/error cases. One point is deducted because we cannot verify the API's actual response format without making a live query, yet the schema documentation appears complete.
