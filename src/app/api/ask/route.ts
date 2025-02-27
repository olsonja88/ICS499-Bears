import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { userMessage } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // System prompt to keep responses dance-focused
        const systemPrompt = `
        You are an AI assistant specializing in dance. You will ONLY answer questions related to:
        - Dance styles and techniques
        - Choreography and performances
        - Cultural significance of dance
        - Famous dancers and dance history
        - Music used in dance
        If a user asks something unrelated, respond with: "I can only answer dance-related questions."
        `;

        const result = await model.generateContent(`${systemPrompt}\nUser: ${userMessage}`);
        const response = await result.response;

        return NextResponse.json({ reply: response.text() });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
