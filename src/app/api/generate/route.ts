import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateGeminiCaptions } from '@/ai/generate-gemini-captions'; // This path will now work
import { generateStabilityImagePrompt } from '@/ai/generate-image-prompt';
import { generateStabilityImage } from '@/ai/generate-image-stability';

// Input validation schema
const inputSchema = z.object({
  productDescription: z.string(),
  language: z.string(),
  tone: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedInput = inputSchema.parse(body);

    const { productDescription, language, tone } = validatedInput;

    // Await all promises in parallel for better performance
    const [captions, detailedImagePrompt] = await Promise.all([
      generateGeminiCaptions(productDescription, language, tone),
      generateStabilityImagePrompt(productDescription, tone),
    ]);

    let imageUrl = null;
    try {
      // Generate the image with Stability AI
      imageUrl = await generateStabilityImage(detailedImagePrompt);
    } catch (err) {
      console.error("Image generation failed:", err);
      // Fail gracefully, imageUrl remains null
    }

    // Return the final combined result
    return NextResponse.json({
      captions, // This will be an array of caption objects
      imageUrl,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('A critical error occurred in /api/generate:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to generate post' },
      { status: 500 }
    );
  }
}