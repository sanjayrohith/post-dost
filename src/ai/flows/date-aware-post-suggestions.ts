// Date-aware post suggestion flow.
'use server';

/**
 * @fileOverview A flow to suggest relevant prompts based on upcoming events or holidays.
 *
 * - getDateAwarePostSuggestion - A function that suggests a post based on the current date.
 * - DateAwarePostSuggestionInput - The input type for the getDateAwarePostSuggestion function.
 * - DateAwarePostSuggestionOutput - The return type for the getDateAwarePostSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DateAwarePostSuggestionInputSchema = z.object({
  language: z.enum(['English', 'Tamil', 'Hindi']).describe('The language for the post suggestion.'),
});

export type DateAwarePostSuggestionInput = z.infer<typeof DateAwarePostSuggestionInputSchema>;

const DateAwarePostSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('The suggested post prompt based on the current date and language.'),
});

export type DateAwarePostSuggestionOutput = z.infer<typeof DateAwarePostSuggestionOutputSchema>;

export async function getDateAwarePostSuggestion(
  input: DateAwarePostSuggestionInput
): Promise<DateAwarePostSuggestionOutput> {
  return dateAwarePostSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dateAwarePostSuggestionPrompt',
  input: {schema: DateAwarePostSuggestionInputSchema},
  output: {schema: DateAwarePostSuggestionOutputSchema},
  prompt: `You are a social media manager for local Indian businesses.

  Suggest a social media post prompt based on the current date and the specified language.

  Today's date is {{currentDate}}.
  The language is {{language}}.

  Consider upcoming Indian holidays and festivals when generating the prompt.

  Examples of Indian holidays and festivals include Diwali, Pongal, New Year's, Holi, etc.

  The post should be relevant to a local Indian business.
  `,
});

const dateAwarePostSuggestionFlow = ai.defineFlow(
  {
    name: 'dateAwarePostSuggestionFlow',
    inputSchema: DateAwarePostSuggestionInputSchema,
    outputSchema: DateAwarePostSuggestionOutputSchema,
  },
  async input => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });

    const {output} = await prompt({...input, currentDate});
    return output!;
  }
);
