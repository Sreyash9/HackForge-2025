'use server';

/**
 * @fileOverview This file implements the password reset assistance flow.
 *
 * It provides AI-powered assistance to users who are having trouble logging in and need to reset their password.
 *
 * @remarks
 * - passwordResetAssistance - A function that provides password reset assistance.
 * - PasswordResetAssistanceInput - The input type for the passwordResetAssistance function.
 * - PasswordResetAssistanceOutput - The return type for the passwordResetAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PasswordResetAssistanceInputSchema = z.object({
  email: z
    .string()
    .email()
    .describe('The email address of the user requesting password reset assistance.'),
  loginAttempts: z
    .number()
    .min(3)
    .describe(
      'The number of failed login attempts the user has made.  Should be at least 3 to trigger assistance.'
    ),
});
export type PasswordResetAssistanceInput = z.infer<
  typeof PasswordResetAssistanceInputSchema
>;

const PasswordResetAssistanceOutputSchema = z.object({
  assistanceMessage: z
    .string()
    .describe(
      'A helpful message providing guidance to the user on how to reset their password.'
    ),
});
export type PasswordResetAssistanceOutput = z.infer<
  typeof PasswordResetAssistanceOutputSchema
>;

export async function passwordResetAssistance(
  input: PasswordResetAssistanceInput
): Promise<PasswordResetAssistanceOutput> {
  return passwordResetAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'passwordResetAssistancePrompt',
  input: {schema: PasswordResetAssistanceInputSchema},
  output: {schema: PasswordResetAssistanceOutputSchema},
  prompt: `You are a helpful AI assistant that guides users through the password reset process.

  A user has repeatedly failed to login ({{loginAttempts}} attempts) with email address {{email}}.

  Create a message that provides clear and concise instructions on how to reset their password.

  The message should include:
  - A reminder of the email address associated with the account.
  - Steps on how to initiate the password reset process (e.g., check their email for a reset link).
  - Tips for creating a strong password.
  - Where to get further help if needed.
  `,
});

const passwordResetAssistanceFlow = ai.defineFlow(
  {
    name: 'passwordResetAssistanceFlow',
    inputSchema: PasswordResetAssistanceInputSchema,
    outputSchema: PasswordResetAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
