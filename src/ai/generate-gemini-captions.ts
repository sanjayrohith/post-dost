import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateGeminiCaptions(
  productDescription: string,
  language: string,
  tone: string
): Promise<{ caption: string, hashtags: string }[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: {
      parts: [
        {
          text: `You are a social media marketing expert for a small local business in Malayambakkam, Tamil Nadu, India. Your task is to generate up to 4 different, short, and engaging social media post options. Each post option must have a unique caption and a relevant string of hashtags. The hashtags must be a single string, starting with '#'.`
        }
      ]
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          captions: {
            type: "ARRAY",
            maxItems: 4,
            items: {
              type: "OBJECT",
              properties: {
                caption: { type: "STRING" },
                hashtags: { type: "STRING" }
              }
            }
          }
        }
      }
    }
  });

  const userPrompt = `Generate 4 unique social media post options based on this request, in a clean JSON array with no other text:
- Product description: "${productDescription}"
- Language: "${language}"
- Tone: "${tone}"`;

  try {
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error("Gemini did not return a response.");
    }
    
    const jsonResponse = JSON.parse(responseText);
    
    // Correctly return the 'captions' array from the parsed JSON object
    return jsonResponse.captions;
  } catch (error) {
    console.error("Error generating social media captions with Gemini:", error);
    throw new Error("Failed to generate captions using Gemini.");
  }
}