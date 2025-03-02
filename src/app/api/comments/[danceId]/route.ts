import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { danceId: string } }
) {
  try {
    const db = await getDB();
    const query = `
      SELECT 
        comments.*,
        users.username
      FROM comments
      LEFT JOIN users ON comments.user_id = users.id
      WHERE dance_id = ?
      ORDER BY comments.created_at DESC;
    `;

    const comments = await db.all(query, [params.danceId]);

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
} 