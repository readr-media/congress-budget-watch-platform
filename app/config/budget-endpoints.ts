/**
 * Shared budget endpoints published via the Readr statics bucket.
 * Import the constants from this module whenever the latest JSON dumps are needed.
 */
export const BUDGET_BY_DEPARTMENT_URL =
  'https://storage.googleapis.com/statics-readr-tw-dev/json/budget/by-department_latest.json';

export const BUDGET_BY_LEGISLATOR_URL =
  'https://storage.googleapis.com/statics-readr-tw-dev/json/budget/by-legislator_latest.json';

export const BUDGET_ENDPOINTS = {
  department: BUDGET_BY_DEPARTMENT_URL,
  legislator: BUDGET_BY_LEGISLATOR_URL,
} as const;

