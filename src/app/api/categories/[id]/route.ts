import { NextResponse } from "next/server";
import { getDB, executeQuerySingle } from "@/lib/db";

// Define the correct type for the context parameter
type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const category = await executeQuerySingle("SELECT * FROM categories WHERE id = $1", [id]);

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
