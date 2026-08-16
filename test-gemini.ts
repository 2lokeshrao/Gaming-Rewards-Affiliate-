import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: 'Hello',
    });
    console.log("2.5-pro success:", response.text);
  } catch (e: any) {
    console.log("2.5-pro error:", e.status, e.message);
  }
}
test();
