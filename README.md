## Project Structure

### Directory Overview

Main structure under `app/`:

```
app/
├── all-budgets/       # Budget list page
├── budget-detail/     # Single budget detail page
├── components/        # Reusable React components
├── constants/         # Global application constants
├── graphql/           # GraphQL client and codegen output
├── hooks/             # Custom React hooks
├── queries/           # Hand-written GraphQL operations
├── routes/            # Page-level components and route definitions
├── stores/            # Zustand state
├── utils/             # Shared helpers
└── visualization/     # Data visualization components
```

### Core Concepts

1. **Centralized Routes (`routes/`)**
   - All page-level components live in `routes/`, such as `home.tsx`.
   - Each route is mapped to a file that composes the page UI and data.

2. **Componentization (`components/`)**
   - Follow an "atomic" approach: small, reusable UI components.
   - Complex or specialized components (like `timeline` or `skeleton`) can have their own subdirectories.

3. **Data Layer (`graphql/`, `queries/`)**
   - The project uses GraphQL for data access.
   - `graphql/` contains `graphql-codegen` output (types and client helpers).
   - `queries/` contains hand-authored queries, mutations, and fragments for reuse.

4. **State Management (`stores/`)**
   - See the "State Management (Zustand)" section below.

---

## State Management (Zustand)

This project uses [Zustand](https://github.com/pmndrs/zustand) for shared/global state.

### Principles

1. **Keep Stores Focused**: Each store owns a single domain (for example, `paginationStore` only manages pagination). Avoid a single, massive store.
2. **Separate Actions and State**: Keep state and action functions separate inside the store for clarity and performance.
3. **Export Selector Hooks Only**: Do not export the store instance directly. Export selector hooks (for example, `usePagination()`) to avoid unnecessary re-renders.

### Example

Using `paginationStore.ts`:

```typescript
// Store structure
const usePaginationStore = create((set) => ({
  page: 1,
  actions: {
    setPage: (page) => set({ page }),
  },
}));

// Export selector hooks
export const usePage = () => usePaginationStore((state) => state.page);
export const usePaginationActions = () =>
  usePaginationStore((state) => state.actions);
```

### When to Use Zustand

- When multiple components without a direct parent-child relationship need shared state.
- When state should persist across pages.
- For local state used by a single component subtree, prefer React `useState` or `useReducer`.

---

## Other Important Areas

### Visualization (`visualization/`)

- Contains D3.js and other complex visualization components (for example, `circle-pack-chart.tsx`).
- Goal: keep visualization logic separate from business logic so it can be self-contained.

### Constants (`constants/`)

- `config.ts`: environment variables and app-level settings.
- `endpoints.ts`: API endpoints.
- `legends.ts`: chart legend definitions.

### React Query Cache Defaults

- Global defaults live in `app/root.tsx`.
- `staleTime`: 60 seconds
- `gcTime`: 10 minutes
- `refetchOnWindowFocus`: `false`
- `retry`: 1

## Known Limitations

- The `/all-budgets` "unfreeze" filter currently approximates by `freezeAmount > 0`. The GraphQL schema does not yet support list filtering on `proposalTypes`, so freeze-type proposals with `freezeAmount = 0` or unset are not included. This should switch to `proposalTypes` once the backend supports it.

## Dark Mode

### Current Status: Paused

Dark mode is currently disabled. Only light mode is used.

### Re-enabling Dark Mode

To re-enable, edit `app/app.css`:

```css
html,
body {
  @apply bg-background dark:bg-gray-950;

  @media (prefers-color-scheme: dark) {
    color-scheme: dark;
  }
}
```

### Change Log

- **Paused on**: January 2025
- **File**: `app/app.css`
- **Changes**:
  - Removed `dark:bg-gray-950`
  - Removed `@media (prefers-color-scheme: dark)`
  - Kept base `@apply bg-background`

---
