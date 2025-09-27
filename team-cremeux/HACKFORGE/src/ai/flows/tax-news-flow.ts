
'use server';

/**
 * @fileOverview An AI agent that provides the latest tax-related news.
 *
 * - getTaxNews - A function that fetches the latest tax news.
 * - TaxNewsInput - The input type for the getTaxNews function.
 * - TaxNewsOutput - The return type for the getTaxNews function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const TaxNewsInputSchema = z.object({
  country: z.string().describe('The country to fetch tax news for.'),
  state: z.string().optional().describe('The state or province to filter news by.'),
});
export type TaxNewsInput = z.infer<typeof TaxNewsInputSchema>;

const TaxNewsOutputSchema = z.object({
  newsItems: z.array(
    z.object({
      title: z.string().describe('The headline of the news article.'),
      summary: z.string().describe('A brief summary of the news.'),
      source: z.string().describe('The source of the news (e.g., government agency).'),
      publishedDate: z.string().describe('The date the news was published.'),
    })
  ).describe('A list of recent tax news items.'),
});
export type TaxNewsOutput = z.infer<typeof TaxNewsOutputSchema>;

export async function getTaxNews(
  input: TaxNewsInput
): Promise<TaxNewsOutput> {
  return await taxNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taxNewsPrompt',
  input: {schema: TaxNewsInputSchema},
  output: {schema: TaxNewsOutputSchema},
  model: googleAI.model('gemini-pro'),
  prompt: `You are an AI assistant that provides the latest tax-related news for freelancers.
  Find the top 5 most recent and relevant tax news updates for {{{country}}}{{#if state}}, specifically for the state/province of {{{state}}}{{/if}}.
  The news should be from official government sources or highly reputable financial news outlets.
  For each news item, provide a title, a concise summary, the source, and the publication date.
  Focus on news that is most likely to impact a freelancer's financial planning.
  If you cannot find any relevant news, return an empty list for the newsItems and do not raise an error.
`,
});

const taxNewsFlow = ai.defineFlow(
  {
    name: 'taxNewsFlow',
    inputSchema: TaxNewsInputSchema,
    outputSchema: TaxNewsOutputSchema,
  },
  async input => {
     const {output} = await prompt(input);
    return output!;
  }
);
