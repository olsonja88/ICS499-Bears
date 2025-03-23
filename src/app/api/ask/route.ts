import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDB } from "@/lib/db";
import jwt from "jsonwebtoken";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        console.log("✅ API `/api/ask/route.ts` triggered"); // 🔍 Debugging log
        const { userMessage, chatHistory = [], token } = await req.json();
        console.log("📝 User Message:", userMessage);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Validate JWT Token for Admin Access
        let userRole = "viewer"; // Default role
        if (token) {
            try {
                console.log("🔑 Received Token:", token);
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
                userRole = decoded.role || "viewer";
                console.log("✅ Decoded User Role:", userRole);
            } catch (err) {
                console.log("❌ Invalid Token:", (err as Error).message);
                userRole = "viewer"; // Treat as a normal user if token is invalid
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

                
                **🛠️ DATABASE RULES:**
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
        
                **🛠️ RULES FOR SQL GENERATION (SQLite-Compatible)**:
                - **Insert category first**:
                  \`\`\`sql
                  INSERT OR IGNORE INTO categories (name) VALUES ('Hip-Hop');
                  \`\`\`
        
                - **Insert country second**:
                  \`\`\`sql
                  INSERT OR IGNORE INTO countries (name, code) VALUES ('USA', 'US');
                  \`\`\`
        
                - **Insert the dance last**:
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

        const formattedHistory = chatHistory.map((msg: { role: string; content: string }) => ({
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

                // Ensure categories and countries are inserted first
                queries.sort((a, b) => {
                    if (a.includes("INSERT OR IGNORE INTO categories") || a.includes("INSERT OR IGNORE INTO countries")) {
                        return -1; // Run these first
                    }
                    return 1; // Run everything else after
                });

                console.log("🔍 Executing SQL Queries:", queries);

                for (const query of queries) {
                    console.log("▶ Running query:", query);
                    await db.run(query.trim());
                }

                // Extract correct values from AI-generated SQL
                const categoryMatch = sqlQuery.match(/INSERT OR IGNORE INTO categories \(name\) VALUES \('(.+?)'\)/);
                const countryMatch = sqlQuery.match(/INSERT OR IGNORE INTO countries \(name, code\) VALUES \('(.+?)',\s*'(.+?)'\)/);
                const danceMatch = sqlQuery.match(/INSERT INTO dances \(title, category_id, country_id\)\s*VALUES \('(.+?)',/);

                const categoryName = categoryMatch ? categoryMatch[1] : null;
                const countryName = countryMatch ? countryMatch[1] : null;
                const danceTitle = danceMatch ? danceMatch[1] : null;

                console.log("🎭 Extracted Category:", categoryName);
                console.log("🌍 Extracted Country:", countryName);
                console.log("💃 Extracted Dance:", danceTitle);

                if (!categoryName || !countryName || !danceTitle) {
                    dbResponse = `⚠️ Error extracting data from SQL. Debug Info:
                        - Extracted Category: ${categoryName}
                        - Extracted Country: ${countryName}
                        - Extracted Dance: ${danceTitle}`;
                } else {
                    const categoryRow = await db.get(`SELECT id FROM categories WHERE name = ?`, [categoryName]);
                    const countryRow = await db.get(`SELECT id FROM countries WHERE name = ?`, [countryName]);

                    if (categoryRow && countryRow) {
                        // ✅ Check if the dance already exists
                    const existingDance = await db.get(`SELECT id FROM dances WHERE title = ?`, [danceTitle]);

                    if (existingDance) {
                        console.log(`⚠️ Dance "${danceTitle}" already exists. Skipping insertion.`);
                        dbResponse = `⚠️ Dance "${danceTitle}" already exists in the database.`;
                    } else {
                        await db.run(
                            `INSERT INTO dances (title, category_id, country_id) VALUES (?, ?, ?)`,
                            [danceTitle, categoryRow.id, countryRow.id]
                        );

                        const danceRow = await db.get(`SELECT * FROM dances WHERE title = ?`, [danceTitle]);
                        dbResponse = danceRow ? `✅ Successfully inserted dance: ${danceTitle}.` : "⚠️ Query executed, but the dance was not inserted.";
                    }


                        const danceRow = await db.get(`SELECT * FROM dances WHERE title = ?`, [danceTitle]);
                        dbResponse = danceRow ? `✅ Successfully inserted dance: ${danceTitle}.` : "⚠️ Query executed, but the dance was not inserted.";
                    } else {
                        dbResponse = "⚠️ Query executed, but category or country is missing.";
                    }
                }
            } catch (dbError) {
                console.error("❌ SQL Execution Error:", dbError);
                dbResponse = `❌ Error executing SQL query: ${(dbError as Error).message}`;
            }
        }

        return NextResponse.json({ reply: sqlQuery ? `Executed SQL Query:\n\`${sqlQuery}\`\n\nResult: ${dbResponse}` : aiResponse });

    } catch (error) {
        console.error("❌ API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
