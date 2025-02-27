import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { userMessage, chatHistory = [] } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // System prompt to enforce dance-related responses
        const systemMessage = {
            role: "user", 
            parts: [
                { text: `You are an AI assistant specializing in dance. You will ONLY answer questions related to:
            - Dance styles and techniques
            - Choreography and performances
            - Cultural significance of dance
            - Famous dancers and dance history
            - Music used in dance
            If a user asks something unrelated, respond with: "I can only answer dance-related questions."` }
            ]
        };

        // Convert history into API-compatible format
        const formattedHistory = chatHistory.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        // Add new user message
        const userMessageFormatted = {
            role: "user",
            parts: [{ text: userMessage }]
        };

        // Combine system prompt, history, and new message
        const messages = [systemMessage, ...formattedHistory, userMessageFormatted];

        // Send request to Gemini API
        const result = await model.generateContent({ contents: messages });
        const response = await result.response;

        // Append AI response to history
        const updatedChatHistory = [
            ...chatHistory,
            { role: "user", content: userMessage },
            { role: "assistant", content: response.text() }
        ];

        return NextResponse.json({ reply: response.text(), chatHistory: updatedChatHistory });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
