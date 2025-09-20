'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating social media posts.
 *
 * The flow takes a product description, language, and tone as input and generates
 * a social media post with an image and caption.
 *
 * @file
 * Exports:
 *   - `GenerateSocialMediaPostInput`: The input type for the generateSocialMediaPost function.
 *   - `GenerateSocialMediaPostOutput`: The output type for the generateSocialMediaPost function.
 *   - `generateSocialMediaPost`: An async function that generates a social media post.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateSocialMediaPostInputSchema = z.object({
  productDescription: z
    .string()
    .describe('A description of the product or offer to be promoted.'),
  language: z.enum(['English', 'Tamil', 'Hindi']).describe('The language for the post.'),
  tone: z
    .enum(['Promotional', 'Festive', 'Funny', 'Formal'])
    .describe('The tone of the post.'),
});
export type GenerateSocialMediaPostInput = z.infer<
  typeof GenerateSocialMediaPostInputSchema
>;

const GenerateSocialMediaPostOutputSchema = z.object({
  imageUrl: z.string().describe('URL of the generated image.'),
  caption: z.string().describe('The generated social media caption.'),
});
export type GenerateSocialMediaPostOutput = z.infer<
  typeof GenerateSocialMediaPostOutputSchema
>;

const postGenerationPrompt = ai.definePrompt({
  name: 'postGenerationPrompt',
  input: {
    schema: GenerateSocialMediaPostInputSchema,
  },
  output: {
    schema: GenerateSocialMediaPostOutputSchema,
  },
  prompt: `You are a social media manager for local Indian businesses.
  Create a social media post (image and caption) based on the following:

  Product Description: {{{productDescription}}}
  Language: {{{language}}}
  Tone: {{{tone}}}

  Ensure the post is culturally relevant to the Indian audience and appropriate for the selected tone and language.
  The image should be relevant to the product description.
  The caption should be engaging and encourage interaction.

  Return the URL of the generated image and the generated social media caption.
  `,
});

const generateImagePrompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: {
    schema: GenerateSocialMediaPostInputSchema,
  },
  output: {
    schema: z.string(),
  },
  prompt: `You are an image generation expert. Generate a detailed image generation prompt, no more than 50 words, based on the following description of the product:

  {{{productDescription}}}

  The image should be suitable for social media and high quality.
  Return ONLY the image generation prompt.  Do not include any other text.
  `,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const imagePromptResponse = await generateImagePrompt(input);
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: imagePromptResponse.output!,
    });

    const postGenerationInput = {
      ...input,
      imageUrl: media.url,
    };

    const postGenerationResponse = await postGenerationPrompt({
      ...input,
      imageUrl: media.url,
    });

    return {
      imageUrl: media.url,
      caption: postGenerationResponse.output!.caption,
    };
  }
);

export async function generateSocialMediaPost(
  input: GenerateSocialMediaPostInput
): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}
