import { NextResponse } from "next/server";
import { getDB, executeQuery } from "@/lib/db";

// Define the correct type for the context parameter
type RouteContext = {
  params: {
    danceId: string;
  };
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const query = `
      SELECT 
        comments.*,
        users.username
      FROM comments
      LEFT JOIN users ON comments.user_id = users.id
      WHERE dance_id = $1
      ORDER BY comments.created_at DESC;
    `;

    const comments = await executeQuery(query, [context.params.danceId]);

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
} 