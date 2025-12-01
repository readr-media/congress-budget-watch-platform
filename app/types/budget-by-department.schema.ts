import { z } from "zod";

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

const budgetDepartmentSchema = z.object({
  governmentId: z.string(),
  name: z.string(),
  reductionAmount: z.number(),
  reductionCount: z.number(),
  freezeAmount: z.number(),
  freezeCount: z.number(),
  otherCount: z.number(),
});

const budgetByDepartmentRecordSchema = z.object({
  yearInfo: yearInfoSchema,
  overall: budgetSummarySchema,
  departments: z.array(budgetDepartmentSchema),
});

export const budgetByDepartmentSchema = z.array(budgetByDepartmentRecordSchema);

export type BudgetDepartmentEntry = z.infer<typeof budgetDepartmentSchema>;
export type BudgetByDepartmentPayload = z.infer<
  typeof budgetByDepartmentSchema
>;

export const budgetByDepartmentRecord = budgetByDepartmentRecordSchema;
