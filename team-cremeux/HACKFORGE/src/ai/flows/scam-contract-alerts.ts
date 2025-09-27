'use server';

/**
 * @fileOverview An AI agent that provides alerts about potentially fraudulent contracts.
 *
 * - getScamContractAlerts - A function that generates scam contract alerts based on a contract description.
 * - ScamContractAlertsInput - The input type for the getScamContractAlerts function.
 * - ScamContractAlertsOutput - The return type for the getScamContractAlerts function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const ScamContractAlertsInputSchema = z.object({
  contractDescription: z
    .string()
    .describe('A detailed description of the contract offered to the freelancer.'),
  crowdSourcedRules: z
    .string()
    .optional()
    .describe('Crowdsourced rules and patterns of known scam contracts.'),
});
export type ScamContractAlertsInput = z.infer<typeof ScamContractAlertsInputSchema>;

const ScamContractAlertsOutputSchema = z.object({
  isScam: z
    .boolean()
    .describe(
      'Whether the contract is likely a scam based on the description and rules.'
    ),
  alertMessage: z
    .string()
    .describe(
      'A detailed alert message explaining why the contract is potentially fraudulent.'
    ),
});
export type ScamContractAlertsOutput = z.infer<typeof ScamContractAlertsOutputSchema>;

export async function getScamContractAlerts(
  input: ScamContractAlertsInput
): Promise<ScamContractAlertsOutput> {
  return await scamContractAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scamContractAlertsPrompt',
  input: {schema: ScamContractAlertsInputSchema},
  output: {schema: ScamContractAlertsOutputSchema},
  model: googleAI.model('gemini-pro'),
  prompt: `You are an AI assistant specialized in detecting fraudulent contracts targeting freelancers.
  Analyze the contract description provided by the user and determine if it is a potential scam.
  Consider the following crowdsourced rules and patterns of known scam contracts:
  {{#if crowdSourcedRules}}
  {{{crowdSourcedRules}}}
  {{else}}
  No crowdsourced rules available.
  {{/if}}

  Contract Description: {{{contractDescription}}}

  Based on your analysis, determine if the contract is a scam and provide a detailed alert message explaining your reasoning.
  Indicate the likelihood of the contract being a scam in the isScam field (true or false).
  Provide a detailed explanation supporting your decision in the alertMessage field.
  If you cannot determine if the contract is a scam, err on the side of caution and assume that it is.
`,
});

const scamContractAlertsFlow = ai.defineFlow(
  {
    name: 'scamContractAlertsFlow',
    inputSchema: ScamContractAlertsInputSchema,
    outputSchema: ScamContractAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
