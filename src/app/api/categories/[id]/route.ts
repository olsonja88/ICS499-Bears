import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const db = await getDB();
    const category = await db.get("SELECT * FROM categories WHERE id = ?", [id]);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}
