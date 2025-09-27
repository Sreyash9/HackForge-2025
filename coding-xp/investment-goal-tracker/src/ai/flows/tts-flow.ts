
'use server';

/**
 * @fileOverview This file implements the text-to-speech (TTS) flow.
 *
 * It converts a given text string into an audio data URI.
 *
 * @remarks
 * - generateSpeech - A function that converts text to speech.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


const ttsFlow = ai.defineFlow(
    {
        name: 'ttsFlow',
        inputSchema: z.string(),
        outputSchema: z.string(),
    },
    async (text) => {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-preview-tts',
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Algenib' },
                    },
                },
            },
            prompt: text,
        });

        if (!media) {
            throw new Error('No audio was generated.');
        }

        const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
        );

        const wavBase64 = await toWav(audioBuffer);
        return `data:audio/wav;base64,${wavBase64}`;
    }
);

export async function generateSpeech(text: string): Promise<string> {
    return ttsFlow(text);
}
