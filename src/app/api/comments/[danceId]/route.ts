import { NextResponse } from "next/server";
import { getDB, executeQuery } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ danceId: string }> }
) {
  try {
    const { danceId } = await params;
    
    const query = `
      SELECT 
        comments.*,
        users.username
      FROM comments
      LEFT JOIN users ON comments.user_id = users.id
      WHERE dance_id = $1
      ORDER BY comments.created_at DESC;
    `;

    const comments = await executeQuery(query, [danceId]);

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
} 