
'use server';

/**
 * @fileOverview This file implements the quiz generation flow.
 *
 * It provides AI-generated quiz questions for users.
 *
 * @remarks
 * - generateQuiz - A function that generates a quiz question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { QuizOutput } from '@/lib/quiz-types';
import { QuizOutputSchema } from '@/lib/quiz-types';


export async function generateQuiz(): Promise<QuizOutput> {
  return quizFlow();
}

const prompt = ai.definePrompt({
  name: 'quizGeneratorPrompt',
  output: {schema: QuizOutputSchema},
  prompt: `You are a helpful AI assistant that creates financial literacy quizzes for beginner investors.

  Your task is to generate a single multiple-choice question about a fundamental investing or finance topic.

  The question should be clear and relevant to someone early in their career.
  Provide 4 distinct options.
  One of the options must be the correct answer.
  Provide the correct answer.
  Provide a simple, encouraging explanation for the correct answer.

  Topics can include:
  - Basic stock market terms (e.g., bull vs. bear market)
  - Investment types (e.g., stocks, bonds, ETFs)
  - Core concepts (e.g., diversification, risk, compound interest)
  - Financial planning (e.g., retirement accounts, emergency funds)

  Generate one quiz item now.
  `,
});

const quizFlow = ai.defineFlow(
  {
    name: 'quizFlow',
    outputSchema: QuizOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
