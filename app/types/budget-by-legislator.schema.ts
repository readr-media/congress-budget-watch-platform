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

const legislatorSummarySchema = budgetSummarySchema;

const legislatorSchema = z.object({
  peopleId: z.string(),
  name: z.string(),
  proposerOnly: legislatorSummarySchema,
  allInvolved: legislatorSummarySchema,
});

const budgetByLegislatorRecordSchema = z.object({
  yearInfo: yearInfoSchema,
  overall: budgetSummarySchema,
  legislators: z.array(legislatorSchema),
});

export const budgetByLegislatorSchema = z.array(budgetByLegislatorRecordSchema);

export type BudgetLegislatorEntry = z.infer<typeof legislatorSchema>;
export type BudgetByLegislatorPayload = z.infer<
  typeof budgetByLegislatorSchema
>;

export const budgetByLegislatorRecord = budgetByLegislatorRecordSchema;
