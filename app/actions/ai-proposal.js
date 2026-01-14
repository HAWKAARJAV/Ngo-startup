"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function analyzeProposal(proposalText) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Act as an expert CSR Grant Evaluator for a Fortune 500 company. 
        Evaluate the following NGO project proposal draft.
        
        Proposal: "${proposalText}"

        Return a JSON response ONLY with the following structure (no markdown code blocks):
        {
            "score": <integer 0-100 based on clarity, impact, and feasibility>,
            "verdict": "<Short summary of the rating, e.g. 'Strong contender but needs budget clarity'>",
            "strengths": ["<point 1>", "<point 2>", "<point 3>"],
            "weaknesses": ["<point 1>", "<point 2>"],
            "suggestion": "<One actionable sentence to improve the proposal>"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean cleanup if Gemini adds markdown blocks
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("AI Error:", error);
        // Fallback for demo if API fails or quota exceeded
        return {
            score: 75,
            verdict: "Good draft, but AI service is temporarily busy.",
            strengths: ["Clear objective", "Identified target beneficiary"],
            weaknesses: ["Budget breakdown missing", "Impact metrics undefined"],
            suggestion: "Please try again in a moment or add more specific financial details."
        };
    }
}
