import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { userMessage } = await req.json();
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const result = await model.generateContent(userMessage);
        const response = await result.response;

        return NextResponse.json({ reply: response.text() });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
