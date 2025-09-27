/**
 * @fileOverview This file defines the Zod schemas and TypeScript types for the tax analysis flow.
 *
 * - TaxSavingTipsInput - The input type for the taxSavingTips function.
 * - TaxAnalysisOutput - The return type for the taxSavingTips function.
 */

import {z} from 'zod';

export const TaxSavingTipsInputSchema = z.object({
  income: z.number().describe('The total income of the freelancer.'),
  expenses: z
    .array(
      z.object({
        category: z.string().describe('The category of the expense.'),
        amount: z.number().describe('The amount of the expense.'),
        description: z
          .string()
          .optional()
          .describe('Optional description of the expense.'),
      })
    )
    .describe('A list of expenses with category and amount.')
    .default([]),
  country: z.string().describe('The country the freelancer is operating in.'),
  filingStatus: z
    .enum(['single', 'married', 'headOfHousehold'])
    .describe('The filing status of the freelancer.'),
});
export type TaxSavingTipsInput = z.infer<typeof TaxSavingTipsInputSchema>;

export const TaxAnalysisOutputSchema = z.object({
  taxSummary: z
    .object({
      totalIncome: z.number().describe('The total income provided.'),
      eligibleDeductions: z
        .number()
        .describe('The total auto-calculated eligible deductions.'),
      projectedTaxLiability: z
        .number()
        .describe(
          'The estimated tax liability based on the provided data and regional rules.'
        ),
      taxReadinessScore: z
        .number()
        .min(0)
        .max(100)
        .describe(
          'A score from 0-100 indicating how ready the user is for tax filing.'
        ),
    })
    .describe("An overview of the user's tax summary."),
  deductionInsights: z
    .array(
      z.object({
        title: z.string().describe('Title for the deduction insight.'),
        description: z
          .string()
          .describe(
            'AI-powered suggestion for a potential deduction. For example: "Your laptop purchase qualifies as a business expense."'
          ),
      })
    )
    .describe(
      'A list of AI-powered deduction suggestions and alerts for missed deductions.'
    ),
  tips: z
    .array(
      z.object({
        title: z.string().describe('The title of the tax saving tip.'),
        description: z
          .string()
          .describe(
            'A detailed description of the tax saving tip, e.g., "If you invest $X in Section 80C, you can save $Y tax".'
          ),
      })
    )
    .describe('A list of personalized tax saving tips.'),
  projectedTaxSummary: z
    .string()
    .describe(
      'A summary of the projected tax liability based on the provided data.'
    ),
});
export type TaxAnalysisOutput = z.infer<typeof TaxAnalysisOutputSchema>;
