'use server';

/**
 * @fileOverview This file implements the goal suggestion flow.
 *
 * It provides AI-powered suggestions to users to help them achieve their financial goals.
 *
 * @remarks
 * - getGoalSuggestion - A function that provides goal suggestions.
 * - GoalSuggestionInput - The input type for the getGoalSuggestion function.
 * - GoalSuggestionOutput - The return type for the getGoalSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GoalSuggestionInputSchema = z.object({
  name: z.string().describe('The name of the financial goal.'),
  targetAmount: z.number().describe('The target amount for the goal.'),
  currentAmount: z.number().describe('The current amount saved for the goal.'),
  dueDate: z.string().describe('The due date for the goal.'),
});
export type GoalSuggestionInput = z.infer<typeof GoalSuggestionInputSchema>;

const GoalSuggestionOutputSchema = z.object({
  suggestion: z
    .string()
    .describe(
      'A helpful and actionable suggestion for achieving the financial goal sooner. The suggestion should be concise and easy to understand.'
    ),
});
export type GoalSuggestionOutput = z.infer<typeof GoalSuggestionOutputSchema>;

export async function getGoalSuggestion(
  input: GoalSuggestionInput
): Promise<GoalSuggestionOutput> {
  return goalSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalSuggestionPrompt',
  input: {schema: GoalSuggestionInputSchema.extend({ currentDate: z.string() })},
  output: {schema: GoalSuggestionOutputSchema},
  prompt: `You are an expert financial analyst. A user is working towards a financial goal and needs advice on how to achieve it faster. Your role is to analyze their progress and provide data-driven, actionable suggestions.

  Current Date: {{currentDate}}
  
  Goal Details:
  - Goal Name: {{name}}
  - Target Amount: {{targetAmount}}
  - Current Amount Saved: {{currentAmount}}
  - Due Date: {{dueDate}}

  Here's your task:
  1. **Analyze the User's Progress**: Calculate the time remaining until the due date, the percentage of the goal completed, and the required monthly savings rate to meet the deadline.
  2. **Identify Potential Gaps**: Determine if the user is on track, ahead, or falling behind based on a linear savings path.
  3. **Provide Actionable Suggestions**: Based on your analysis, provide a helpful and encouraging suggestion. The suggestion should be specific and include numbers where possible. For example, instead of "save more," suggest something like "Increasing your monthly savings by just 5% could help you reach your goal X months sooner."
  4. **Keep it Concise**: Present your analysis and suggestion in a clear, easy-to-read paragraph. Start with a brief analysis and then provide the main suggestion.
  `,
});

const goalSuggestionFlow = ai.defineFlow(
  {
    name: 'goalSuggestionFlow',
    inputSchema: GoalSuggestionInputSchema,
    outputSchema: GoalSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt({
        ...input,
        currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    return output!;
  }
);
