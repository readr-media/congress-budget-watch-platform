import { z } from "zod";

export const BUDGET_BY_DEPARTMENT_URL =
  "https://storage.googleapis.com/ccw-tw-prod/json/budget/by-department_latest.json";

export const BUDGET_BY_LEGISLATOR_URL =
  "https://storage.googleapis.com/ccw-tw-prod/json/budget/by-legislator_latest.json";

export const BUDGET_ENDPOINTS = {
  department: BUDGET_BY_DEPARTMENT_URL,
  legislator: BUDGET_BY_LEGISLATOR_URL,
} as const;

const yearInfoSchema = z.object({
  budgetYearId: z.string(),
  year: z.number(),
});

const budgetSummarySchema = z.object({
  reductionAmount: z.number(),
  reductionCount: z.number(),
  freezeAmount: z.number(),
  freezeCount: z.number(),
  otherCount: z.number(),
});

const departmentSummarySchema = z.object({
  governmentId: z.string(),
  name: z.string(),
  reductionAmount: z.number(),
  reductionCount: z.number(),
  freezeAmount: z.number(),
  freezeCount: z.number(),
  otherCount: z.number(),
});

const legislatorDetailSchema = z.object({
  peopleId: z.string(),
  name: z.string(),
  proposerOnly: budgetSummarySchema,
  allInvolved: budgetSummarySchema,
});

export const budgetByDepartmentRecordSchema = z.object({
  yearInfo: yearInfoSchema,
  overall: budgetSummarySchema,
  departments: z.array(departmentSummarySchema),
});

export const budgetByDepartmentSchema = z.array(budgetByDepartmentRecordSchema);

export const budgetByLegislatorRecordSchema = z.object({
  yearInfo: yearInfoSchema,
  overall: budgetSummarySchema,
  legislators: z.array(legislatorDetailSchema),
});

export const budgetByLegislatorSchema = z.array(budgetByLegislatorRecordSchema);

export type BudgetDepartmentEntry = z.infer<typeof departmentSummarySchema>;
export type BudgetByDepartmentPayload = z.infer<
  typeof budgetByDepartmentSchema
>;

export type BudgetLegislatorEntry = z.infer<typeof legislatorDetailSchema>;
export type BudgetByLegislatorPayload = z.infer<
  typeof budgetByLegislatorSchema
>;
