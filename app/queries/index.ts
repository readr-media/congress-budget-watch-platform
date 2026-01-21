// Budget queries
export {
  GET_BUDGETS_QUERY,
  // GET_BUDGET_BY_ID_QUERY, // TODO: Uncomment when needed
  budgetQueryKeys,
  GET_GOVERNMENTS_QUERY,
  governmentQueryKeys,
  GET_PEOPLE_LIST_QUERY,
  peopleQueryKeys,
} from "./budget.queries";

// Add other query exports here as you create more query files
// export * from "./user.queries";
// export * from "./committee.queries";

export {
  GET_PROPOSALS_QUERY,
  GET_PROPOSAL_BY_ID_QUERY,
  proposalQueryKeys,
} from "./proposal.queries";

export {
  GET_BUDGET_YEARS_LIST_QUERY,
  GET_LATEST_BUDGET_YEAR_QUERY,
  budgetYearQueryKeys,
} from "./budget-year.queries";

export * from "./budget.queries";
export * from "./proposal.queries";
export * from "./visualization.queries";
export * from "./budget-year.queries";
