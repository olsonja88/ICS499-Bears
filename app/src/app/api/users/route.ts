import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db"; // Ensure this correctly points to your database connection

// ✅ Named export for GET request
export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database query failed", details: error });
    }
}

// ✅ Named export for POST request
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Missing required fields: name and email" });
        }

        const [result]: any = await pool.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );

        return res.status(201).json({ id: result.insertId, name, email });
    } catch (error) {
        console.error("Database insert failed:", error);
        return res.status(500).json({ error: "Database insert failed", details: error });
    }
}

// ✅ Named export for handling unsupported methods (OPTIONAL)
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    return res.status(405).json({ message: "Method Not Allowed" });
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
    return res.status(405).json({ message: "Method Not Allowed" });
}

