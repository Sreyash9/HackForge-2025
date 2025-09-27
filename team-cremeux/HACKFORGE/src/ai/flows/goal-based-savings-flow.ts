
'use server';

/**
 * @fileOverview An AI agent that provides a goal-based savings plan for freelancers.
 *
 * - getGoalBasedSavingsPlan - A function that generates a savings plan based on a user's financial goals.
 * - GoalBasedSavingsInput - The input type for the getGoalBasedSavingsPlan function.
 * - GoalBasedSavingsOutput - The return type for the getGoalBasedSavingsPlan function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GoalBasedSavingsInputSchema = z.object({
  goalName: z.string().describe('The name of the financial goal (e.g., Retirement, New Car).'),
  targetAmount: z.number().describe('The total amount of money the user wants to save.'),
  targetDate: z.string().describe('The date by which the user wants to achieve the goal (in YYYY-MM-DD format).'),
  currentSavings: z.number().describe('The amount the user has already saved for this goal.'),
  monthlyIncome: z.number().describe('The user\'s average monthly income.'),
  riskTolerance: z.enum(['low', 'medium', 'high']).describe('The user\'s tolerance for investment risk.'),
});
export type GoalBasedSavingsInput = z.infer<typeof GoalBasedSavingsInputSchema>;

const GoalBasedSavingsOutputSchema = z.object({
  monthlySavingNeeded: z.number().describe('The calculated amount the user needs to save each month to reach their goal.'),
  feasibilityAnalysis: z.string().describe('A paragraph analyzing the feasibility of the goal, like "Save X/month to reach Y in Z years."'),
  investmentSuggestions: z.array(
    z.object({
      name: z.string().describe('The name of the investment suggestion (e.g., Index Fund, High-Yield Savings).'),
      description: z.string().describe('A detailed description of the investment and why it fits the user\'s profile.'),
      suitability: z.string().describe('A brief explanation of its suitability based on risk tolerance.'),
    })
  ).describe('A list of automated investment suggestions for the freelancer.'),
});
export type GoalBasedSavingsOutput = z.infer<typeof GoalBasedSavingsOutputSchema>;

export async function getGoalBasedSavingsPlan(
  input: GoalBasedSavingsInput
): Promise<GoalBasedSavingsOutput> {
  return await goalBasedSavingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalBasedSavingsPrompt',
  input: {schema: GoalBasedSavingsInputSchema},
  output: {schema: GoalBasedSavingsOutputSchema},
  model: googleAI.model('gemini-pro'),
  prompt: `You are an expert financial planner for freelancers.
  A user wants to create a savings plan for the following goal:

  - Goal: {{{goalName}}}
  - Target Amount: {{{targetAmount}}}
  - Target Date: {{{targetDate}}}
  - Current Savings: {{{currentSavings}}}
  - Monthly Income: {{{monthlyIncome}}}
  - Risk Tolerance: {{{riskTolerance}}}

  1.  Calculate the required monthly savings to reach the goal. The formula should be (Target Amount - Current Savings) / Number of months until the target date.
  2.  Provide a feasibility analysis. Start with a clear, actionable insight like "To reach your goal of $X in Y years, you need to save approximately $Z per month." Then, briefly discuss if this is realistic given their income.
  3.  Generate 2-3 personalized investment suggestions based on their risk tolerance. For each suggestion, provide a name, a detailed description of what it is and why it's suitable, and a brief note on its suitability.

  Make the advice practical and encouraging for a freelancer.
`,
});

const goalBasedSavingsFlow = ai.defineFlow(
  {
    name: 'goalBasedSavingsFlow',
    inputSchema: GoalBasedSavingsInputSchema,
    outputSchema: GoalBasedSavingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
