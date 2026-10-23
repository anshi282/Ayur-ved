import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('✅ Google Gemini API client initialized.');
} else {
  console.warn('⚠️ GEMINI_API_KEY is not set or placeholder. Gemini calls will use intelligent simulated analysis.');
}

export function getGeminiModel(modelName = 'gemini-1.5-flash') {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });
}

export { genAI };
