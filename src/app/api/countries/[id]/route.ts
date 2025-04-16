import { NextResponse } from "next/server";
import { getDB, executeQuerySingle } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Country ID is required" }, { status: 400 });
    }

    const country = await executeQuerySingle("SELECT * FROM countries WHERE id = $1", [id]);

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    return NextResponse.json(country);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}