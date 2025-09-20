'use server';

/**
 * @fileOverview A Genkit flow to generate audio from a given text caption.
 *
 * This file exports:
 * - `GenerateAudioFromCaptionInput`: The input type for the audio generation flow.
 * - `GenerateAudioFromCaptionOutput`: The output type for the audio generation flow.
 * - `generateAudioFromCaption`: The function to call the audio generation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const GenerateAudioFromCaptionInputSchema = z.object({
  caption: z.string().describe('The text caption to be converted to audio.'),
  language: z.enum(['English', 'Tamil', 'Hindi']).describe('The language of the caption.'),
});
export type GenerateAudioFromCaptionInput = z.infer<typeof GenerateAudioFromCaptionInputSchema>;

const GenerateAudioFromCaptionOutputSchema = z.object({
  audioUrl: z.string().describe('The data URI of the generated audio file.'),
});
export type GenerateAudioFromCaptionOutput = z.infer<typeof GenerateAudioFromCaptionOutputSchema>;

// Helper function to convert PCM audio buffer to WAV format as a base64 string.
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

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

const generateAudioFromCaptionFlow = ai.defineFlow(
  {
    name: 'generateAudioFromCaptionFlow',
    inputSchema: GenerateAudioFromCaptionInputSchema,
    outputSchema: GenerateAudioFromCaptionOutputSchema,
  },
  async ({ caption }) => {
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
      prompt: caption,
    });

    if (!media) {
      throw new Error('Audio generation failed: No media returned.');
    }

    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioUrl: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);

export async function generateAudioFromCaption(
  input: GenerateAudioFromCaptionInput
): Promise<GenerateAudioFromCaptionOutput> {
  return generateAudioFromCaptionFlow(input);
}
