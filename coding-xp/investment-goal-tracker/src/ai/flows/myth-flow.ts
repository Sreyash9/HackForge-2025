
'use server';

/**
 * @fileOverview This file implements the myth busting flow.
 *
 * It provides AI-generated financial myths for users to evaluate.
 *
 * @remarks
 * - generateMyth - A function that generates a financial myth.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { MythOutput } from '@/lib/myth-types';
import { MythOutputSchema } from '@/lib/myth-types';


export async function generateMyth(): Promise<MythOutput> {
  return mythFlow();
}

const prompt = ai.definePrompt({
  name: 'mythBusterPrompt',
  output: {schema: MythOutputSchema},
  prompt: `You are an expert financial educator. Your task is to generate a common financial myth to challenge a user.

  Generate a single, interesting, and common financial myth. The myth should be a statement that sounds plausible but is generally incorrect or misleading.
  
  Then, provide a boolean \`isTrue\` field. This should almost always be \`false\`.

  Finally, write a clear, simple, and encouraging explanation that debunks the myth. The explanation should be easy for a beginner investor to understand.

  Example:
  - Myth: "Investing is only for rich people."
  - isTrue: false
  - Explanation: "That's a common misconception! Thanks to modern technology, anyone can start investing with just a few dollars. Many apps allow you to buy fractional shares of stocks, and you can begin building wealth with small, consistent contributions."
  `,
});

const mythFlow = ai.defineFlow(
  {
    name: 'mythFlow',
    outputSchema: MythOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
