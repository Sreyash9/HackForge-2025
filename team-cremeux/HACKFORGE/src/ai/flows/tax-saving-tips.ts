
'use server';

/**
 * @fileOverview This file implements the Genkit flow for providing personalized tax-saving tips to freelancers.
 *
 * - taxSavingTips - A function that takes income and expense data as input and returns personalized tax-saving tips.
 * - TaxSavingTipsInput - The input type for the taxSavingTips function.
 * - TaxAnalysisOutput - The return type for the taxSavingTips function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
  TaxSavingTipsInputSchema,
  TaxAnalysisOutputSchema,
  type TaxSavingTipsInput,
  type TaxAnalysisOutput,
} from './tax-analysis-schemas';

export {type TaxSavingTipsInput, type TaxAnalysisOutput};

export async function taxSavingTips(input: TaxSavingTipsInput): Promise<TaxAnalysisOutput> {
  return await taxSavingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taxSavingTipsPrompt',
  input: {schema: TaxSavingTipsInputSchema},
  output: {schema: TaxAnalysisOutputSchema},
  model: googleAI.model('gemini-pro'),
  prompt: `You are an AI-powered financial advisor specializing in providing tax analysis for freelancers.

  Analyze the following income and expense data for a freelancer operating in {{{country}}} with a filing status of {{{filingStatus}}}.

  Income: {{{income}}}
  Expenses:
  {{#each expenses}}
  - Category: {{{category}}}, Amount: {{{amount}}}{{#if description}}, Description: {{{description}}}{{/if}}
  {{/each}}

  Based on the data, provide a comprehensive tax analysis.

  1.  **Tax Summary Overview**:
      *   Calculate total eligible deductions based on common freelance expenses.
      *   Estimate the projected tax liability considering the country's tax laws (e.g., GST, TDS, Income Tax Slabs).
      *   Provide a "Tax Readiness Score" (0-100) based on how organized the provided expense data is. A higher score means more categorized expenses.
      *   The total income should be the same as the input.

  2.  **Deduction Insights**:
      *   Generate at least 2-3 AI-powered deduction suggestions from the provided expenses. Frame them as insights (e.g., "Your software subscription for 'Design Tool' is a valid business expense.").
      *   If there are generic expenses under "Other", create a missed deduction alert.

  3.  **Tax Saving Tips**:
      *   Provide 2-3 specific and actionable tax-saving tips tailored to their situation. For example, "If you invest $X in a retirement account, you could save approximately $Y on your taxes."

  4. **Projected Tax Summary**:
      * Provide a brief, one-paragraph summary of the freelancer's projected tax situation based on the numbers.
  `,
});

const taxSavingTipsFlow = ai.defineFlow(
  {
    name: 'taxSavingTipsFlow',
    inputSchema: TaxSavingTipsInputSchema,
    outputSchema: TaxAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
