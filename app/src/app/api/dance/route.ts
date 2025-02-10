import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM dances");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}
