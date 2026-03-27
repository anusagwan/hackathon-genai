import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function understandQuery(query) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Extract tasks, notes, and events from this query and return JSON:
${query}`,
    });

    let text = response.text;

    // Remove Markdown ```json code block if present
    text = text.replace(/^```json\s*/, "").replace(/```$/, "").trim();

    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Error:", err);
    return { error: "AI failed", raw: err.message };
  }
}