import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginRequest {
  username: string;
  password: string;
}

export async function POST(req: Request) {
    try {
      const { username, password } = await req.json();
  
      if (!username || !password) {
        return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
      }
  
      const db = await getDB();
      const user = await db.get("SELECT id, username, password_hash FROM users WHERE username = ?", [username]);
  
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
  
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
  
      const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
  
      console.log("Generated JWT Token:", token); // Debugging
  
      return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
      console.error("Login API Error:", error); // Debugging
      return NextResponse.json({ error: "Database error", details: String(error) }, { status: 500 });
    }
  }
  