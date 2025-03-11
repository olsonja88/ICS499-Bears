import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Database } from "sqlite";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();
        const db: Database = await getDB();

        // Verify JWT token (throws error if invalid or expired)
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
        const email = decoded.email;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password in the database
        const result = await db.run("UPDATE users SET password_hash = ? WHERE email = ?", [hashedPassword, email]);

        if (result.changes === 0) {
            return NextResponse.json({ message: "Invalid token or user not found." }, { status: 400 });
        }

        return NextResponse.json({ message: "Password successfully reset!" }, { status: 200 });
    } catch (error) {
        console.error("Error in reset-password:", error);
        return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
    }
}
