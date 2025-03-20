import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDB } from "@/lib/db";
import jwt from "jsonwebtoken";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        console.log("✅ API `/api/ask/route.ts` triggered");
        const { userMessage, chatHistory = [], token } = await req.json();
        console.log("📝 User Message:", userMessage);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Validate JWT Token for Admin Access
        let userRole = "viewer";
        if (token) {
            try {
                console.log("🔑 Received Token:", token);
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
                userRole = decoded.role || "viewer";
                console.log("✅ Decoded User Role:", userRole);
            } catch (err) {
                console.log("❌ Invalid Token:", (err as Error).message);
                userRole = "viewer";
            }
        } else {
            console.log("ℹ️ No token provided. Defaulting to viewer.");
        }

        const systemMessage = {
            role: "user",
            parts: [{ 
                text: `
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
                - **Tables & Required Fields**:

                **categories** (\`id\`, \`name\`)
                - Stores dance categories (e.g., Ballet, Hip-Hop, Salsa).

                **countries** (\`id\`, \`name\`, \`code\`)
                - Stores country names and their codes.

                **dances** (\`id\`, \`title\`, \`category_id\`, \`country_id\`)
                - **Required Fields**:
                    - \`title\` (TEXT, NOT NULL)
                    - \`category_id\` (INTEGER, FOREIGN KEY)
                    - \`country_id\` (INTEGER, FOREIGN KEY)
                - Must check if **\`category_id\` and \`country_id\` exist before inserting**.
                - If missing, **create them automatically first**.

                **RULES FOR SQL GENERATION (SQLite-Compatible)**:
                - **Generate all required SQL queries in one code block inside \`\`\`sql ... \`\`\`**
                - **Ensure the SQL query follows this format:**
                \`\`\`sql
                INSERT OR IGNORE INTO categories (name) VALUES ('Hip-Hop');
                INSERT OR IGNORE INTO countries (name, code) VALUES ('USA', 'US');
                INSERT INTO dances (title, category_id, country_id)
                VALUES ('Electric Shuffle', 
                    (SELECT id FROM categories WHERE name = 'Hip-Hop'), 
                    (SELECT id FROM countries WHERE name = 'USA'));
                \`\`\`
                `
            }]
        };

        const formattedHistory = chatHistory.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        const userMessageFormatted = {
            role: "user",
            parts: [{ text: userMessage }]
        };

        const messages = [systemMessage, ...formattedHistory, userMessageFormatted];

        console.log("🔥 Sending request to Gemini AI...");
        const result = await model.generateContent({ contents: messages });
        const response = await result.response;
        const aiResponse = response.text();
        console.log("🤖 AI Response:", aiResponse);

        let dbResponse = "";
        const sqlMatches = aiResponse.match(/```sql([\s\S]+?)```/g);
        let sqlQueries = [];

        if (sqlMatches) {
            sqlQueries = sqlMatches.map(match => match.replace(/```sql|```/g, "").trim());
        }

        if (userRole === "admin" && sqlQueries.length > 0) {
            try {
                const db = await getDB();
                
                for (const sqlQuery of sqlQueries) {
                    const queries = sqlQuery.split(";").filter(q => q.trim());

                    console.log("🔍 Checking dance before execution...");

                    // **Extract dance name before inserting**
                    const danceMatch = sqlQuery.match(/INSERT INTO dances \(title, category_id, country_id\)\s*VALUES \('(.+?)',/);
                    const danceTitle = danceMatch ? danceMatch[1] : null;

                    if (danceTitle) {
                        const existingDance = await db.get(`SELECT id FROM dances WHERE title = ?`, [danceTitle]);

                        if (existingDance) {
                            console.log(`⚠️ Dance "${danceTitle}" already exists. Skipping insertion.`);
                            dbResponse = `⚠️ Dance "${danceTitle}" already exists in the database.`;
                            continue; // **Skip execution if dance exists**
                        }
                    }

                    console.log("🔍 Executing SQL Queries:", queries);

                    for (const query of queries) {
                        console.log("▶ Running query:", query);
                        await db.run(query.trim());
                    }

                    dbResponse = `✅ Successfully inserted dance: ${danceTitle}.`;
                }
            } catch (dbError) {
                console.error("❌ SQL Execution Error:", dbError);
                dbResponse = `❌ Error executing SQL query: ${(dbError as Error).message}`;
            }
        }

        return NextResponse.json({ reply: sqlQueries.length > 0 ? `Executed SQL Query:\n\`${sqlQueries.join("\n")}\`\n\nResult: ${dbResponse}` : aiResponse });

    } catch (error) {
        console.error("❌ API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
