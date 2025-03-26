import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import jwt from "jsonwebtoken";

// LangChain imports
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

export async function POST(req: Request) {
    try {
        console.log("✅ API `/api/ask/route.ts` triggered");
        const { userMessage, chatHistory = [], token } = await req.json();
        console.log("📝 User Message:", userMessage);

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            apiKey: process.env.GEMINI_API_KEY!,
        });

        // Token validation
        let userRole = "viewer";
        if (token) {
            try {
                console.log("🔑 Received Token:", token);
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
                userRole = decoded.role || "viewer";
                console.log("✅ Decoded User Role:", userRole);
            } catch (err) {
                console.log("❌ Invalid Token:", (err as Error).message);
            }
        } else {
            console.log("ℹ️ No token provided. Defaulting to viewer.");
        }

        // LangChain memory and context
        const memory = new BufferMemory({ returnMessages: true });

        const chain = new ConversationChain({
            llm: model,
            memory,
        });

        // Push formatted history into memory
        for (const msg of chatHistory) {
            const m = msg.role === "user"
                ? new HumanMessage(msg.content)
                : new AIMessage(msg.content);
            await memory.chatHistory.addMessage(m);
        }

        // System prompt including description
        const systemPrompt = `
        You are an AI assistant specializing in dance-related topics.
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

        **Chat History Awareness:**
        - You must be aware of the chat history and generate responses based on the context.
        - If the user asks a follow-up question, you must provide a relevant answer based on the previous conversation.

        **DATABASE RULES:**
        - Tables: categories, countries, dances
        - INSERT or IGNORE new category or country if not found.
        - Always include a description of the dance if known.
        - Only generate queries inside a \`\`\`sql block like this:
        \`\`\`sql
        INSERT OR IGNORE INTO categories (name) VALUES ('Hip-Hop');
        INSERT OR IGNORE INTO countries (name, code) VALUES ('USA', 'US');
        INSERT INTO dances (title, description, category_id, country_id)
        VALUES ('Electric Shuffle', 'A high-energy modern dance that involves precise footwork.',
            (SELECT id FROM categories WHERE name = 'Hip-Hop'),
            (SELECT id FROM countries WHERE name = 'USA'));
        \`\`\`
        `;

        await memory.chatHistory.addMessage(new SystemMessage(systemPrompt));

        const result = await chain.call({ input: userMessage });
        const aiResponse: string = result.response;
        console.log("🤖 AI Response:", aiResponse);

        let dbResponse = "";
        const sqlMatches = aiResponse.match(/```sql([\s\S]+?)```/g);
        let sqlQueries: string[] = [];

        if (sqlMatches) {
            sqlQueries = sqlMatches.map(m => m.replace(/```sql|```/g, "").trim());
        }

        if (userRole === "admin" && sqlQueries.length > 0) {
            try {
                const db = await getDB();

                for (const sqlQuery of sqlQueries) {
                    const queries = sqlQuery.split(";").filter(q => q.trim());

                    const danceMatch = sqlQuery.match(/INSERT INTO dances \(title, description, category_id, country_id\)\s*VALUES \('(.+?)'/);
                    const danceTitle = danceMatch ? danceMatch[1] : null;

                    if (danceTitle) {
                        const existingDance = await db.get(`SELECT id FROM dances WHERE title = ?`, [danceTitle]);
                        if (existingDance) {
                            dbResponse = `⚠️ Dance \"${danceTitle}\" already exists in the database.`;
                            continue;
                        }
                    }

                    for (const query of queries) {
                        console.log("▶ Running query:", query);
                        await db.run(query.trim());
                    }

                    dbResponse = `✅ Successfully inserted dance: ${danceTitle}.`;
                }
            } catch (err) {
                console.error("❌ SQL Execution Error:", err);
                dbResponse = `❌ Error executing SQL query: ${(err as Error).message}`;
            }
        }

        return NextResponse.json({
            reply: sqlQueries.length > 0 ? `Executed SQL Query:\n\`${sqlQueries.join("\n")}\`\n\nResult: ${dbResponse}` : aiResponse
        });

    } catch (error) {
        console.error("❌ API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
