import { GoogleGenAI, Type } from "@google/genai";
import { InterviewSetup, InterviewFeedback, TranscriptMessage } from "@/types";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is not set.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

// 🔥 Retry helper
async function retry(fn: () => Promise<any>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, 1000 * (i + 1)));
    }
  }
}

// 🔥 Fallback model handler
async function generateWithFallback(prompt: string, schema?: any) {
  const ai = getGenAI();

  try {
    return await retry(() =>
      ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: schema
      })
    );
  } catch (e) {
    console.warn("Primary model failed → switching to fallback");

    return await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: schema
    });
  }
}

export const geminiService = {
  async generateInterviewPlan(setup: InterviewSetup): Promise<string[]> {
    const prompt = `
You are a professional ${setup.role} interviewer. 
Generate ${setup.questionCount} questions for a ${setup.level} role.
Tech stack: ${setup.stack.join(", ")}.
Type: ${setup.type}.
Focus: ${setup.focusAreas.join(", ")}.

Return ONLY a JSON array.
`;

    const response = await generateWithFallback(prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch {
      return [];
    }
  },

  async generateFeedback(session: {
    transcript: TranscriptMessage[];
    setup: InterviewSetup;
  }): Promise<InterviewFeedback> {
    const transcriptText = session.transcript
      .map(m => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n");

    const prompt = `
Analyze this interview.

Role: ${session.setup.role} (${session.setup.level})

${transcriptText}

Return JSON with scores, strengths, weaknesses, tips, exercises.
;

    const response = await generateWithFallback(prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          communicationScore: { type: Type.NUMBER },
          technicalScore: { type: Type.NUMBER },
          clarityScore: { type: Type.NUMBER },
          confidenceScore: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          practiceExercises: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          detailedAnalysis: { type: Type.STRING }
        }
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch {
      throw new Error("Failed to parse feedback");
    }
  }
};
