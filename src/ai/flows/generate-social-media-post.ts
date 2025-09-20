// Placeholder generation (external AI removed)
'use server';
import { z } from 'zod';

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

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
  const { productDescription, language, tone } = GenerateSocialMediaPostInputSchema.parse(input);
  const caption = `${tone} ${language} Post: ${productDescription}\n\nHashtags: #${tone.toLowerCase()} #${language.toLowerCase()} #localbusiness`;
  return {
    imageUrl: 'https://picsum.photos/seed/' + encodeURIComponent(productDescription).slice(0,20) + '/800/800',
    caption,
  };
}
