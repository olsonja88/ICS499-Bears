import { NextResponse } from "next/server";
import { executeQuerySingle } from "@/lib/db";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/sendemail";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Check if user exists
        const user = await executeQuerySingle("SELECT id FROM users WHERE email = ?", [email]);
        if (!user) {
            return NextResponse.json(
                { message: "If this email exists, a reset link has been sent." },
                { status: 200 }
            );
        }

        // Generate JWT token (valid for 1 hour, contains only the email)
        const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        // Send reset link via email
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pwchange?token=${token}`;
        await sendEmail(email, "Password Reset Request", `Click here to reset your Dancepedia password: <a href="${resetUrl}">${resetUrl}</a>`);

        return NextResponse.json({ message: "If this email exists, a reset link has been sent." }, { status: 200 });
    } catch (error) {
        console.error("Error in reset-password-request:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
