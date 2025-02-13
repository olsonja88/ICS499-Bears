import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDB();
    const dances = await db.all("SELECT * FROM dances");
    return NextResponse.json(dances);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}
