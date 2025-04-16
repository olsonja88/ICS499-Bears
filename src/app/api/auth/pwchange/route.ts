import { NextResponse } from "next/server";
import { executeQueryRun } from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { token, password, userId } = await req.json();

        // Verify JWT token (throws error if invalid or expired)
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; role: string };
        
        // If userId is provided and user is admin, allow changing other user's password
        if (userId && decoded.role === "admin") {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await executeQueryRun(
                "UPDATE users SET password_hash = ? WHERE id = ?", 
                [hashedPassword, userId]
            );
            
            if (result.changes === 0) {
                return NextResponse.json({ message: "User not found." }, { status: 400 });
            }
            
            return NextResponse.json({ message: "Password successfully updated!" }, { status: 200 });
        }
        
        // Otherwise, only allow users to change their own password
        const email = decoded.email;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await executeQueryRun(
            "UPDATE users SET password_hash = ? WHERE email = ?", 
            [hashedPassword, email]
        );

        if (result.changes === 0) {
            return NextResponse.json({ message: "User not found." }, { status: 400 });
        }

        return NextResponse.json({ message: "Password successfully updated!" }, { status: 200 });
    } catch (error) {
        console.error("Error in password change:", error);
        return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
    }
}
