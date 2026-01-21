import { graphql } from "~/graphql";

/**
 * GraphQL query to fetch the most recent budget year progress information.
 * Ordering by year desc ensures we always display the latest available data.
 */
export const GET_LATEST_BUDGET_YEAR_QUERY = graphql(`
  query GetLatestBudgetYear($skip: Int!, $take: Int!) {
    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {
      year
      budgetProgress
      dataProgress
      unfreezeProgress
    }
  }
`);

export const GET_BUDGET_YEARS_LIST_QUERY = graphql(`
  query GetBudgetYearsList {
    budgetYears(orderBy: [{ year: desc }]) {
      id
      year
    }
  }
`);

export const budgetYearQueryKeys = {
  all: ["budgetYear"] as const,
  list: (skip = 0, take = 1) =>
    [...budgetYearQueryKeys.all, "list", { skip, take }] as const,
  latest: () => [...budgetYearQueryKeys.all, "latest"] as const,
  years: () => [...budgetYearQueryKeys.all, "years"] as const,
} as const;
