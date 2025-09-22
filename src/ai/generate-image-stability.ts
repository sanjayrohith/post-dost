// src/ai/generate-image-stability.ts

import StabilityAI from "stability-ai";
import fs from "fs/promises";

// Make sure the function is exported
export async function generateStabilityImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    throw new Error("STABILITY_API_KEY is not set in environment variables.");
  }

  try {
    const stability = new StabilityAI(apiKey);

    const results = await stability.v1.generation.textToImage(
      'stable-diffusion-xl-1024-v1-0',
      [{ text: prompt, weight: 1 }]
    );

    const imageResult = results[0];
    if (!imageResult || !imageResult.filepath) {
      console.error("Stability AI did not return a valid image file.");
      return null;
    }

    const imagePath = imageResult.filepath;
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Clean up the temporary file created by the library
    await fs.unlink(imagePath);

    return `data:image/png;base64,${base64Image}`;

  } catch (error) {
    console.error("Error generating image with Stability AI:", error);
    return null; 
  }
}