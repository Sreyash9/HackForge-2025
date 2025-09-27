
import {z} from 'genkit';

export const MythOutputSchema = z.object({
  myth: z.string().describe('A common financial myth or misconception.'),
  isTrue: z.boolean().describe('Whether the myth statement is true or false. This should almost always be false.'),
  explanation: z
    .string()
    .describe(
      'A clear, concise explanation debunking the myth or explaining the nuance.'
    ),
});
export type MythOutput = z.infer<typeof MythOutputSchema>;
