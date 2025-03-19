import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDB } from "@/lib/db";
import jwt from "jsonwebtoken";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        console.log("✅ API `/api/ask.ts` triggered"); // 🔍 Debugging log
        const { userMessage, chatHistory = [], token } = await req.json();
        console.log("📝 User Message:", userMessage);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // 🔒 Validate JWT Token for Admin Access
        let userRole = "viewer";
        if (token) {
            try {
                console.log("🔑 Received Token:", token); // ✅ Debug token
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
                userRole = decoded.role || "viewer";
                console.log("✅ Decoded User Role:", userRole);
            } catch (err) {
                console.log("❌ Invalid Token:", (err as Error).message);
                return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
            }
        } else {
            console.log("❌ No Token Provided");
            return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
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
        
                **🛠️ DATABASE RULES:**
                - **Tables & Required Fields**:
                
                🟢 **categories** (\`id\`, \`name\`)
                   - Stores dance categories (e.g., Ballet, Hip-Hop, Salsa).
        
                🟢 **countries** (\`id\`, \`name\`, \`code\`)
                   - Stores country names and their codes.
        
                🟢 **dances** (\`id\`, \`title\`, \`category_id\`, \`country_id\`)
                   - **Required Fields**:
                     - \`title\` (TEXT, NOT NULL)
                     - \`category_id\` (INTEGER, FOREIGN KEY)
                     - \`country_id\` (INTEGER, FOREIGN KEY)
                   - Must check if **\`category_id\` and \`country_id\` exist before inserting**.
                   - If missing, **create them automatically first**.
        
                **🛠️ RULES FOR SQL GENERATION (SQLite-Compatible)**:
                - **Insert category only if missing**:
                  \`\`\`sql
                  INSERT OR IGNORE INTO categories (name) VALUES ('Hip-Hop');
                  \`\`\`
        
                - **Insert country only if missing**:
                  \`\`\`sql
                  INSERT OR IGNORE INTO countries (name, code) VALUES ('USA', 'US');
                  \`\`\`
        
                - **Insert a dance with correct category & country IDs**:
                  \`\`\`sql
                  INSERT INTO dances (title, category_id, country_id)
                  VALUES ('Electric Shuffle', 
                      (SELECT id FROM categories WHERE name = 'Hip-Hop'), 
                      (SELECT id FROM countries WHERE name = 'USA'));
                  \`\`\`
        
                **🛠️ SQL OUTPUT FORMAT (MUST FOLLOW THIS FORMAT)**:
                \`SQL_QUERY: <query_here>\`
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

        // 🔥 Send request to Gemini AI
        console.log("🔥 Sending request to Gemini AI...");
        const result = await model.generateContent({ contents: messages });
        const response = await result.response;
        const aiResponse = response.text();
        console.log("🤖 AI Response:", aiResponse);

        let sqlQuery = "";
let dbResponse = "";

        // 🔍 Extract AI-generated SQL query correctly
        const sqlMatch = aiResponse.match(/```sql([\s\S]+?)```/);
        if (userRole === "admin" && sqlMatch) {
            sqlQuery = sqlMatch[1].trim();

            try {
                const db = await getDB();
                const queries = sqlQuery.split(";").filter(q => q.trim());

                console.log("🔍 Executing SQL Queries:", queries);

                for (const query of queries) {
                    console.log("▶ Running query:", query);
                    await db.run(query.trim());
                }

                // ✅ Fetch category ID and country ID manually
                const categoryRow = await db.get(`SELECT id FROM categories WHERE name = ?`, ['Hip-Hop']);
                const countryRow = await db.get(`SELECT id FROM countries WHERE name = ?`, ['USA']);

                console.log("✅ Category ID:", categoryRow?.id);
                console.log("✅ Country ID:", countryRow?.id);

                if (!categoryRow || !countryRow) {
                    dbResponse = "⚠️ Query executed, but category or country is missing.";
                } else {
                    // ✅ Insert dance manually to debug
                    await db.run(
                        `INSERT INTO dances (title, category_id, country_id) VALUES (?, ?, ?)`,
                        ['Electric Shuffle', categoryRow.id, countryRow.id]
                    );

                    const danceRow = await db.get(`SELECT * FROM dances WHERE title = ?`, ['Electric Shuffle']);
                    console.log("✅ Dance Inserted:", danceRow);

                    dbResponse = danceRow ? "✅ Successfully executed the query and inserted the dance." : "⚠️ Query executed, but the dance was not inserted.";
                }
            } catch (dbError) {
                console.error("❌ SQL Execution Error:", dbError);
                dbResponse = `❌ Error executing SQL query: ${(dbError as Error).message}`;
            }
        }


        return NextResponse.json({
            reply: sqlQuery ? `Executed SQL Query:\n\`${sqlQuery}\`\n\nResult: ${dbResponse}` : aiResponse
        });

    } catch (error) {
        console.error("❌ API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
