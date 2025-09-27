
'use server';

/**
 * @fileOverview This file implements the chat bot flow for the global chat room.
 *
 * It provides AI-powered responses when a user mentions "@ai" in a message.
 *
 * @remarks
 * - chatBot - A function that provides an AI response to a user's message.
 * - ChatBotInput - The input type for the chatBot function.
 * - ChatBotOutput - The return type for the chatBot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatBotInputSchema = z.object({
  message: z
    .string()
    .describe('The user message, which should contain a question for the AI.'),
  userName: z.string().describe('The display name of the user asking the question.'),
});
export type ChatBotInput = z.infer<typeof ChatBotInputSchema>;

const ChatBotOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'A helpful, friendly, and encouraging response to the user\'s question.'
    ),
});
export type ChatBotOutput = z.infer<typeof ChatBotOutputSchema>;

export async function chatBot(input: ChatBotInput): Promise<ChatBotOutput> {
  return chatBotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatBotPrompt',
  input: {schema: ChatBotInputSchema},
  output: {schema: ChatBotOutputSchema},
  prompt: `You are FinAdvisor, an AI financial assistant. Your primary goal is to help early-career professionals overcome the barriers to investing. Your persona is that of an encouraging and knowledgeable mentor.

A user, {{userName}}, has asked for help.

User's message: "{{message}}"

Your task is to:
1.  **Be Encouraging and Build Confidence**: Address the user in a friendly, welcoming tone. Frame investing as an achievable goal, no matter how small the start. Praise their questions and curiosity.
2.  **Answer the Question Simply**: Explain financial concepts clearly and concisely. Avoid jargon. Use analogies and simple examples.
3.  **Debunk Common Myths**: If the user's question touches on a common misconception (e.g., "I don't have enough money to invest"), gently correct it. Emphasize that starting small is powerful.
4.  **Guide and Empower**: Where relevant, guide the user to other features of the app that can help them learn. For example, if they ask about long-term growth, suggest they try the "Growth Chart". If they are nervous about risk, point them to the "Simulation" page to practice.
5.  **Maintain Your Persona**: Always be positive and empowering. Your goal is to make the user feel more confident and capable of starting their investment journey.
6.  **Decline Non-Financial Questions**: If the user asks a question not related to finance, investing, or economics, politely decline and explain that your expertise is in financial guidance.
7.  **Include a Disclaimer**: **IMPORTANT:** Always conclude your response with a disclaimer that you are an AI assistant and your advice should not be considered professional financial advice. Users should consult with a qualified professional for personalized advice.
`,
});

const chatBotFlow = ai.defineFlow(
  {
    name: 'chatBotFlow',
    inputSchema: ChatBotInputSchema,
    outputSchema: ChatBotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
