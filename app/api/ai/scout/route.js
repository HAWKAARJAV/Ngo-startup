import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "YOUR_API_KEY_HERE");

export async function POST(req) {
    try {
        const { query } = await req.json();

        // 1. Fetch all candidate data from DB (In prod, use vector search or RAG)
        const ngos = await prisma.nGO.findMany({
            include: { projects: true }
        });

        // 2. Prepare Context for Gemini (Lite RAG)
        const context = ngos.map(n =>
            `NGO: ${n.orgName} (Trust: ${n.trustScore}%, Loc: ${n.city}). Mission: ${n.mission}. Projects: ${n.projects.map(p => `${p.title} (${p.sector})`).join(", ")}`
        ).join("\n\n");

        // 3. Prompt Engineering
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
    You are an expert CSR Consultant AI. 
    User Query: "${query}"
    
    Here is the database of verified NGOs:
    ${context}
    
    Task: Return a JSON object with:
    1. 'message': A helpful conversational response greeting the user and summarizing findings.
    2. 'matches': An array of top 3 NGO matches based on the query. Each match must have { 'title': 'NGO Name', 'match': 'XX%', 'reason': 'Why it matches' }.
    
    Strictly return ONLY JSON.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean JSON (sometimes Gemini wraps in ```json ... ```)
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);
    } catch (error) {
        console.error("AI Error:", error);
        // Fallback Mock if API fails or Key missing
        return NextResponse.json({
            message: "I'm having trouble connecting to the AI brain right now. Here are some general recommendations.",
            matches: [
                { title: "Pratham", match: "95%", reason: "Top recommendation for Education." },
                { title: "Goonj", match: "90%", reason: "Great for general relief work." }
            ]
        });
    }
}
