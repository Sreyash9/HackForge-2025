
import {z} from 'genkit';

export const QuizOutputSchema = z.object({
  question: z.string().describe('A multiple-choice question about a financial topic.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correctOption: z.string().describe('The correct answer from the options array.'),
  explanation: z
    .string()
    .describe(
      'A simple explanation of why the correct answer is right.'
    ),
});
export type QuizOutput = z.infer<typeof QuizOutputSchema>;
