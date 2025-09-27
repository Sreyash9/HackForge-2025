'use server';

/**
 * @fileOverview Financial assessment analysis flow.
 * Takes structured income/expenses/assets/liabilities input and produces a concise analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AssessmentInputSchema = z.object({
  income: z.record(z.string(), z.number()).describe('Income sources with monthly amounts'),
  expenses: z.record(z.string(), z.number()).describe('Expense categories with monthly amounts'),
  assets: z.record(z.string(), z.number()).describe('Assets and their approximate values'),
  liabilities: z.record(z.string(), z.number()).describe('Liabilities and outstanding balances'),
});

export type AssessmentInput = z.infer<typeof AssessmentInputSchema>;

const AssessmentOutputSchema = z.object({
  analysis: z.string().describe('Clear, actionable assessment and recommendations'),
});

export type AssessmentOutput = z.infer<typeof AssessmentOutputSchema>;

// A simple text input prompt to guarantee the model sees readable values instead of object placeholders.
const PromptInputSchema = z.object({ inputText: z.string() });
const financialAssessmentPrompt = ai.definePrompt({
  name: 'financialAssessmentPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: AssessmentOutputSchema },
  prompt: `You are a seasoned financial planner helping a beginner.

Here is the user's financial data:
{{inputText}}

Requirements:
- Start with a short snapshot: savings rate %, monthly surplus/deficit, and rough net worth.
- Highlight top 3 opportunities (e.g., reduce high-interest debt, build emergency fund, optimize SIPs).
- Include simple ratios: expense-to-income %, debt-to-asset %, and any risk flags.
- Provide 3-5 actionable next steps (clear, beginner-friendly, no jargon).
- Keep it encouraging and concise (~200-300 words). Add a brief disclaimer at the end.
`,
});

const financialAssessmentFlow = ai.defineFlow(
  {
    name: 'financialAssessmentFlow',
    inputSchema: AssessmentInputSchema,
    outputSchema: AssessmentOutputSchema,
  },
  async (input) => {
    // Pre-format input into a readable text block for the model
    const lineify = (records: Record<string, number>): string => {
      const entries = Object.entries(records);
      if (!entries.length) return '(none)';
      return entries
        .map(([k, v]) => `- ${k}: ${Number.isFinite(v) ? v.toLocaleString() : String(v)}`)
        .join('\n');
    };

    const sum = (records: Record<string, number>): number =>
      Object.values(records).reduce((acc, n) => (Number.isFinite(n) ? acc + n : acc), 0);

    const incomeTotal = sum(input.income);
    const expenseTotal = sum(input.expenses);
    const assetsTotal = sum(input.assets);
    const liabilitiesTotal = sum(input.liabilities);
    const monthlySurplus = incomeTotal - expenseTotal;
    const netWorth = assetsTotal - liabilitiesTotal;

    const inputText = [
      'Income (monthly):',
      lineify(input.income),
      `Total Income: ${incomeTotal.toLocaleString()}`,
      '',
      'Expenses (monthly):',
      lineify(input.expenses),
      `Total Expenses: ${expenseTotal.toLocaleString()}`,
      '',
      'Assets:',
      lineify(input.assets),
      `Total Assets: ${assetsTotal.toLocaleString()}`,
      '',
      'Liabilities:',
      lineify(input.liabilities),
      `Total Liabilities: ${liabilitiesTotal.toLocaleString()}`,
      '',
      `Monthly Surplus/Deficit: ${monthlySurplus.toLocaleString()}`,
      `Rough Net Worth: ${netWorth.toLocaleString()}`,
    ].join('\n');

    const { output } = await financialAssessmentPrompt({ inputText });
    return output!;
  }
);

export async function runFinancialAssessment(input: AssessmentInput): Promise<string> {
  const { analysis } = await financialAssessmentFlow(input);
  return analysis;
}
