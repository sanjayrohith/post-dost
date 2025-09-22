import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateStabilityImagePrompt(
  productDescription: string,
  tone: string
): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY_PROMPT_ENGINEERING;
  if (!apiKey) throw new Error("GOOGLE_API_KEY_PROMPT_ENGINEERING is not set.");

  const genAI = new GoogleGenerativeAI(apiKey);

  const systemPrompt = `
You are an expert prompt engineer for Stability AI's Stable Diffusion image generation model.
Given a product description and tone, create a single prompt suitable for Stable Diffusion. 
Make sure the prompt is less than 2000 characters. Emphasize visual appeal, clarity, and style.
Do not exceed 2000 characters.
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: { parts: [{ text: systemPrompt }] },
  });

  const userPrompt = `
Product Description: "${productDescription}"
Tone: "${tone}"
Return a single prompt for Stability AI.
`;

  try {
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();
    if (!responseText) throw new Error("Gemini did not return a prompt.");
    return responseText.trim();
  } catch (error) {
    console.error("Error generating Stability AI prompt with Gemini:", error);
    throw new Error("Failed to generate image prompt using Gemini.");
  }
}
