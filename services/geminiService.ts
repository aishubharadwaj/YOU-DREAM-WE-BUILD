
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, QuizQuestion, JuniorDiscoveryResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateJuniorQuiz(): Promise<QuizQuestion[]> {
  const model = "gemini-3-flash-preview";
  const prompt = `Generate a comprehensive 10-question career aptitude quiz for a teenager (under 18). 
  The questions should be engaging and help discover their latent interests in technology, creative arts, scientific research, social impact, entrepreneurship, and leadership.
  Mix abstract personality questions with interest-based scenarios.
  Respond in JSON format: [{"id": 1, "question": "...", "options": ["Option A", "Option B", "Option C", "Option D"]}]`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "[]");
}

export async function evaluateJuniorQuiz(answers: { question: string, answer: string }[]): Promise<JuniorDiscoveryResult> {
  const model = "gemini-3-flash-preview";
  const prompt = `A teenager answered these 10 questions identifying their interests: ${JSON.stringify(answers)}. 
  Suggest 4 distinct career paths they can pursue once they reach 18 and provide deep strategic advice on what foundational projects and subjects they should focus on now.
  Respond in JSON: { "recommendedPaths": [{ "title": "...", "description": "...", "preReqs": ["..."] }], "advice": "..." }`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function analyzeCareerPath(
  linkedinData: string,
  githubData: string,
  resumeText: string,
  targetRole: string
): Promise<AnalysisResult> {
  const model = "gemini-3-pro-preview";

  const prompt = `
    You are "You Dream, We Build", an expert career architect and strategist.
    Your mission is to perform a deep analysis of a candidate and create a surgical, high-impact 30-day "Vibe-Check" learning roadmap to bridge the gap to their "Dream Role": ${targetRole}.

    INPUT DATA:
    - LinkedIn Snippet: ${linkedinData}
    - GitHub Summary: ${githubData}
    - Resume Content: ${resumeText}

    AGENTIC WORKFLOW:
    1. EXTRACT: Structure the candidate's existing skills and experience.
    2. BENCHMARK: Analyze the ${targetRole} market requirements for 2024-2025.
    3. GAP ANALYSIS: Identify specific technical and non-technical missing competencies.
    4. STRATEGIC PLANNING: Design a 30-day adaptive roadmap structured into 4 weeks.
    5. FUTURE FORECASTING: Predict the state of this role in the next 5-10 years.

    RESPONSE FORMAT:
    You must respond in JSON following this structure:
    {
      "userProfile": { "name": "...", "headline": "...", "skills": [{"name": "...", "level": "...", "category": "..."}], "experienceSummary": "..." },
      "skillGaps": [{"skill": "...", "importance": 10, "currentLevel": "...", "requiredLevel": "...", "gapDescription": "..."}],
      "roadmap": [
        {
          "week": 1,
          "focus": "...",
          "tasks": [{"day": 1, "title": "...", "description": "...", "resources": ["url1"], "category": "..."}],
          "checkpoint": "..."
        }
      ],
      "futureOutlook": {
        "roleEvolution": "...",
        "demandTrend": "...",
        "newSkillsEmerging": ["..."],
        "aiImpact": "...",
        "salaryProjection": "..."
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 16000 }
    },
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return result as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("The AI Agent encountered an error while constructing your roadmap.");
  }
}
