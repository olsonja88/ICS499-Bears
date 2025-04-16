import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    if (!params.name) {
      return NextResponse.json(
        { error: "Country name is required" },
        { status: 400 }
      );
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content
    const result = await model.generateContent(
      `Tell me about the traditional dance of ${params.name}.`
    );
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
