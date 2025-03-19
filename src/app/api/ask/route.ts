import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDB } from "@/lib/db";
import jwt from "jsonwebtoken";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { userMessage, chatHistory = [] } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // 🔐 Extract token from headers
        const authHeader = req.headers.get("Authorization");
        console.log("🔹 Auth Header:", authHeader); // Debugging

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        let userRole = "viewer";
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            userRole = decoded.role || "viewer";
            console.log("✅ Decoded Token:", decoded); // Debugging
        } catch (error) {
            console.error("❌ JWT Verification Error:", error);
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }

        // 📝 AI System Prompt (Restricts Topics & SQL Execution)
        const systemMessage = {
            role: "user",
            parts: [{ 
                text: `You are an AI assistant specializing in dance-related topics. 
                You must only answer questions about:
                - Dance styles and techniques
                - Choreography and performances
                - Cultural significance of dance
                - Famous dancers and dance history
                - Music used in dance
        
                **Admin Role Handling:**
                - The current user has the role: **${userRole}**.
                - If the role is **admin**, you are allowed to generate SQL queries if requested.
                - If the role is **viewer**, do NOT generate SQL and reply: "This feature is only available to admin users."
        
                **Important:** Always verify the user's role before responding to SQL requests.
                `
            }]
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

        // 🔥 Send request to Gemini API
        const result = await model.generateContent({ contents: messages });
        const response = await result.response;
        const aiResponse = response.text();

        console.log("🤖 AI Response:", aiResponse); // Debugging AI response

        let sqlQuery = "";
        let dbResponse = "";

        // 🔍 Check if AI response is an SQL query
        if (aiResponse.toLowerCase().includes("select")) {
            if (userRole === "admin") {
                sqlQuery = aiResponse.trim();

                // ❗ SQL Security: Only Allow SELECT Queries
                if (!sqlQuery.toLowerCase().startsWith("select")) {
                    return NextResponse.json({ reply: "Only SELECT queries are allowed." });
                }

                try {
                    const db = await getDB();
                    dbResponse = await db.all(sqlQuery);
                    console.log("✅ SQL Query Executed Successfully:", dbResponse);
                } catch (dbError) {
                    console.error("❌ SQL Error:", dbError);
                    dbResponse = "Error executing SQL query.";
                }
            } else {
                console.warn("⚠️ Non-admin user attempted SQL query.");
                return NextResponse.json({ reply: "This feature is only available to admin users." });
            }
        }

        // ✅ Append AI response to history
        const updatedChatHistory = [
            ...chatHistory,
            { role: "user", content: userMessage },
            { role: "assistant", content: sqlQuery ? `Generated SQL Query:\n\`${sqlQuery}\`\n\nDatabase Response: ${JSON.stringify(dbResponse)}` : aiResponse }
        ];

        return NextResponse.json({
            reply: sqlQuery ? `Generated SQL Query:\n\`${sqlQuery}\`\n\nDatabase Response: ${JSON.stringify(dbResponse)}` : aiResponse,
            chatHistory: updatedChatHistory
        });

    } catch (error) {
        console.error("❌ Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
