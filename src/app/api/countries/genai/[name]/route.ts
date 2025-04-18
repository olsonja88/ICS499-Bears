import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDB } from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    if (!params) {
      return NextResponse.json({ error: "Route parameters not available" }, { status: 400 });
    }

    const { name } = await params;

    if (!name) {
      return NextResponse.json({ error: "Country name is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Please tell me about dances and dance culture in ${name}, please be thorough.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ description: text });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to get country dance information" },
      { status: 500 }
    );
  }
}
