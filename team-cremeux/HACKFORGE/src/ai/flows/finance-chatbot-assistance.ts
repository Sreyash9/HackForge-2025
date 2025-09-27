
'use server';

/**
 * @fileOverview Provides an AI chatbot for freelancers to assist with budgeting, tax, and scam prevention.
 *
 * - `FinanceChatbotInput`: Input type for the finance chatbot, which is a user query string.
 * - `FinanceChatbotOutput`: Output type for the finance chatbot, which is the chatbot's response string.
 * - `financeChatbotAssistance`: A function to get financial assistance from the AI chatbot.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const FinanceChatbotInputSchema = z.object({
  query: z.string().describe('The user query for the finance chatbot.'),
});
export type FinanceChatbotInput = z.infer<typeof FinanceChatbotInputSchema>;

const FinanceChatbotOutputSchema = z.string().describe('The response from the finance chatbot.');
export type FinanceChatbotOutput = z.infer<typeof FinanceChatbotOutputSchema>;

export async function financeChatbotAssistance(
  input: string
): Promise<FinanceChatbotOutput> {
  return await financeChatbotAssistanceFlow({query: input});
}

const prompt = ai.definePrompt({
  name: 'financeChatbotAssistancePrompt',
  input: {schema: FinanceChatbotInputSchema},
  model: googleAI.model('gemini-pro'),
  prompt: `You are a helpful AI assistant designed to provide financial advice to freelancers.
  Address the user directly.
  Answer the following question to the best of your ability:

  {{{query}}}`,
});

const financeChatbotAssistanceFlow = ai.defineFlow(
  {
    name: 'financeChatbotAssistanceFlow',
    inputSchema: FinanceChatbotInputSchema,
    outputSchema: FinanceChatbotOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    return response.text;
  }
);
