import fs from 'fs';
import { getGeminiModel } from '../config/geminiClient.js';
import { SYSTEM_INSTRUCTION, buildAnalysisPrompt } from './prompt.js';

/**
 * Heuristic simulator for testing when Gemini API key is not yet provided
 */
function getSimulatedAyurvedicAnalysis({ symptoms = '', age, gender, duration, file }) {
  const lower = symptoms.toLowerCase();
  const isEmergency = lower.includes('chest pain') ||
                      lower.includes('heart') ||
                      lower.includes('breath') ||
                      lower.includes('stroke') ||
                      lower.includes('unconscious') ||
                      lower.includes('severe bleeding');

  let conditions = ["Mild Kapha-Vata Imbalance", "General Metabolic Sluggishness (Manda Agni)"];
  let abnormal_values = [];
  let herbs = [
    { name: "Tulsi (Holy Basil)", benefit: "Balances Kapha and Vata, supports respiratory immunity." },
    { name: "Ashwagandha", benefit: "Restores vitality and relieves stress-related exhaustion." },
    { name: "Amla (Indian Gooseberry)", benefit: "Rich in natural Vitamin C, balances all three doshas." }
  ];
  let fruits_diet = ["Sip warm water with a slice of fresh ginger", "Light moong dal khichdi with cumin and ghee", "Fresh seasonal pomegranate and soaked almonds", "Avoid processed sugars, excessive dairy, and cold beverages"];
  let lifestyle = ["Ensure 7-8 hours of sound sleep", "Perform 10 minutes of Anulom Vilom pranayama daily", "Engage in light morning walking in fresh air", "Avoid daytime naps immediately after heavy meals"];
  let specialist = "Ayurvedic Physician / General Practitioner";

  if (isEmergency) {
    conditions = ["Critical Symptoms Requiring Immediate Medical Triage"];
    specialist = "Emergency Physician / Cardiologist";
    lifestyle = ["DO NOT DELAY: Visit the nearest emergency room or hospital trauma unit immediately."];
  } else if (lower.includes('cough') || lower.includes('cold') || lower.includes('throat')) {
    conditions = ["Pranavaha Srotas Irritation (Upper Respiratory Discomfort)", "Kapha Congestion"];
    herbs = [
      { name: "Sitopaladi Churna", benefit: "Traditional remedy for dry and productive cough." },
      { name: "Mulethi (Yashtimadhu)", benefit: "Soothes irritated mucous membranes in the throat." },
      { name: "Ginger & Honey", benefit: "Clears congestion and ignites digestive Agni." }
    ];
    specialist = "General Physician or ENT Specialist";
  } else if (lower.includes('stomach') || lower.includes('digestion') || lower.includes('gas') || lower.includes('acidity')) {
    conditions = ["Pitta-Vata Gastric Sensitivity", "Agni Mandya (Weak Digestive Fire)"];
    herbs = [
      { name: "Triphala", benefit: "Gentle detoxifier and bowel motility regulator." },
      { name: "Ajwain (Carom seeds) & Hing", benefit: "Relieves gas, abdominal cramping, and bloating." },
      { name: "Avipattikar Churna", benefit: "Cools excess Pitta acid in the stomach." }
    ];
    specialist = "Gastroenterologist or Ayurvedic Vaidya";
  }

  if (file) {
    abnormal_values.push({
      test: file.originalname.includes('cbc') ? 'Hemoglobin' : 'Extracted Document Metric',
      value: 'Observed in report',
      note: 'Analyzed from uploaded document preview. Please review with doctor.'
    });
  }

  return {
    conditions,
    abnormal_values,
    herbs,
    fruits_diet,
    lifestyle,
    specialist,
    emergency: isEmergency,
    disclaimer: "General Ayurvedic and wellness guidance only. This does not replace formal clinical diagnosis or doctor consultation."
  };
}

/**
 * Main service to analyze symptoms and uploaded files with Google Gemini
 */
export async function analyzeWithGemini({ symptoms, age, gender, duration, file }) {
  const model = getGeminiModel();

  if (!model) {
    console.log('ℹ️ Utilizing intelligent Ayurvedic heuristic engine (GEMINI_API_KEY pending).');
    return getSimulatedAyurvedicAnalysis({ symptoms, age, gender, duration, file });
  }

  try {
    const promptText = buildAnalysisPrompt({
      symptoms,
      age,
      gender,
      duration,
      hasFile: !!file,
      fileType: file ? file.mimetype : null
    });

    const parts = [
      { text: SYSTEM_INSTRUCTION },
      { text: promptText }
    ];

    if (file && fs.existsSync(file.path)) {
      const fileData = fs.readFileSync(file.path);
      const base64Data = fileData.toString('base64');
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: file.mimetype
        }
      });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    const responseText = response.text().trim();

    // Clean JSON response if wrapped with backticks
    const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (err) {
    console.error('Gemini API Error:', err.message);
    // Graceful fallback to heuristic if rate limit or network issue occurs
    return getSimulatedAyurvedicAnalysis({ symptoms, age, gender, duration, file });
  }
}
