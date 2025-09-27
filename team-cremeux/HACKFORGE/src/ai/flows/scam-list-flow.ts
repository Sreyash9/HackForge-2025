
'use server';

/**
 * @fileOverview An AI agent that provides a list of common scams targeting freelancers.
 *
 * - getScamList - A function that fetches a list of common scams.
 * - ScamListOutput - The return type for the getScamList function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const ScamListOutputSchema = z.object({
  scams: z.array(
    z.object({
      name: z.string().describe('The name of the scam.'),
      description: z.string().describe('A detailed description of how the scam works.'),
      redFlags: z.array(z.string()).describe('A list of red flags or warning signs to look out for.'),
    })
  ).describe('A list of common scams targeting freelancers.'),
});
export type ScamListOutput = z.infer<typeof ScamListOutputSchema>;

export async function getScamList(): Promise<ScamListOutput> {
  return await scamListFlow();
}

const prompt = ai.definePrompt({
  name: 'scamListPrompt',
  output: {schema: ScamListOutputSchema},
  model: googleAI.model('gemini-pro'),
  prompt: `You are a cybersecurity expert specializing in financial fraud.
  Provide a list of the 5 most common and current scams targeting freelancers.
  For each scam, provide a name, a detailed description of how it operates, and a list of key red flags to watch out for.
  The information should be clear, concise, and actionable to help freelancers protect themselves.
`,
});

const scamListFlow = ai.defineFlow(
  {
    name: 'scamListFlow',
    outputSchema: ScamListOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
