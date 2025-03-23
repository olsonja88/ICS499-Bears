import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;

    if (!name) {
      return NextResponse.json({ error: "Country name is required" }, { status: 400 });
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
