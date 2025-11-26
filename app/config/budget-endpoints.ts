export const BUDGET_BY_DEPARTMENT_URL =
  "https://statics-readr-tw-dev.readr.tw/json/budget/by-department_latest.json";

export const BUDGET_BY_LEGISLATOR_URL =
  "https://statics-readr-tw-dev.readr.tw/json/budget/by-legislator_latest.json";

export const BUDGET_ENDPOINTS = {
  department: BUDGET_BY_DEPARTMENT_URL,
  legislator: BUDGET_BY_LEGISLATOR_URL,
} as const;
