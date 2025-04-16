import { NextResponse } from "next/server";
import { executeQuerySingle, executeQueryRun } from "@/lib/db";
import bcrypt from "bcrypt";

interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { username, email, password }: SignupRequest = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if the username or email already exists
    const existingUser = await executeQuerySingle(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser) {
      return NextResponse.json({ error: "Username or email already taken" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await executeQueryRun(
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'viewer')",
      [username, email, hashedPassword]
    );

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}
