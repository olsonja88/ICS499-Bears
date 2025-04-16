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