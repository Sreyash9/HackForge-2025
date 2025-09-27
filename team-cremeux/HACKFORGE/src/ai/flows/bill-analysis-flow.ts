'use server';

/**
 * @fileOverview An AI agent that analyzes uploaded bills to identify tax-deductible expenses.
 *
 * - analyzeBill - A function that analyzes an image of a bill.
 * - BillAnalysisInput - The input type for the analyzeBill function.
 * - BillAnalysisOutput - The return type for the analyzeBill function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const BillAnalysisInputSchema = z.object({
  billImage: z
    .string()
    .describe(
      "An image of a bill or receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type BillAnalysisInput = z.infer<typeof BillAnalysisInputSchema>;

const BillAnalysisOutputSchema = z.object({
  vendor: z.string().optional().describe('The name of the vendor or store.'),
  date: z.string().optional().describe('The date of the transaction in YYYY-MM-DD format.'),
  totalAmount: z.number().optional().describe('The total amount of the bill.'),
  isDeductible: z
    .boolean()
    .describe('Whether the bill is likely to contain tax-deductible expenses for a freelancer.'),
  deductionReason: z
    .string()
    .describe('An explanation of why the expense is or is not deductible.'),
  items: z.array(
    z.object({
      description: z.string().describe('The description of the line item.'),
      amount: z.number().describe('The amount of the line item.'),
    })
  ).optional().describe("A list of items from the bill."),
});
export type BillAnalysisOutput = z.infer<typeof BillAnalysisOutputSchema>;

export async function analyzeBill(
  input: BillAnalysisInput
): Promise<BillAnalysisOutput> {
  return await billAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'billAnalysisPrompt',
  input: {schema: BillAnalysisInputSchema},
  output: {schema: BillAnalysisOutputSchema},
  model: googleAI.model('gemini-1.5-flash-preview'),
  prompt: `You are an expert AI accountant for freelancers. Analyze the following bill image.
  
  Image: {{media url=billImage}}

  Your task is to:
  1. Extract the vendor name, transaction date, and total amount.
  2. Determine if the expenses on this bill are likely tax-deductible for a freelancer (e.g., software, office supplies, business meals).
  3. Provide a clear reason for your decision in the 'deductionReason' field.
  4. If possible, list the individual items from the bill.
  5. Set 'isDeductible' to true if it contains any potentially deductible items.
  
  Provide the output in the specified JSON format.
`,
});

const billAnalysisFlow = ai.defineFlow(
  {
    name: 'billAnalysisFlow',
    inputSchema: BillAnalysisInputSchema,
    outputSchema: BillAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
