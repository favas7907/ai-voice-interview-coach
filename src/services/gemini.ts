import { GoogleGenAI, Type } from "@google/genai";
import { InterviewSetup, InterviewFeedback, TranscriptMessage } from "@/types";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set. Please configure it in the Secrets panel.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export const geminiService = {
  async generateInterviewPlan(setup: InterviewSetup): Promise<string[]> {
    const ai = getGenAI();
    const prompt = `
      You are a professional ${setup.role} interviewer. 
      Generate a list of ${setup.questionCount} interview questions for a ${setup.level} level position.
      Tech stack: ${setup.stack.join(", ")}.
      Interview type: ${setup.type}.
      Focus areas: ${setup.focusAreas.join(", ")}.
      
      The questions should follow this structure:
      1. Introduction & Warm-up
      2. Role-specific technical questions
      3. Scenario-based/Behavioral questions
      4. Closing
      
      Return ONLY a JSON array of strings.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse interview plan", e);
      return [];
    }
  },

  async generateFeedback(session: { transcript: TranscriptMessage[], setup: InterviewSetup }): Promise<InterviewFeedback> {
    const ai = getGenAI();
    const transcriptText = session.transcript
      .map(m => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n");

    const prompt = `
      Analyze the following interview transcript and provide detailed feedback.
      Role: ${session.setup.role} (${session.setup.level})
      
      Transcript:
      ${transcriptText}
      
      Provide a structured analysis including scores (0-100) for overall, communication, technical, clarity, and confidence.
      Identify strengths, weaknesses, improvement tips, and practice exercises.
      
      Return ONLY a JSON object matching the InterviewFeedback interface.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
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
          },
          required: ["overallScore", "communicationScore", "technicalScore", "clarityScore", "confidenceScore", "strengths", "weaknesses", "improvementTips", "practiceExercises", "summary", "detailedAnalysis"]
        }
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse feedback", e);
      throw new Error("Failed to generate feedback");
    }
  }
};
