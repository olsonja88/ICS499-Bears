import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDB();
    const query = `
      SELECT 
        dances.id AS dance_id,
        dances.title,
        dances.description,
        dances.category_id,
        dances.country_id,
        dances.created_by,
        dances.created_at,
        media.id AS media_id,
        media.type AS media_type,
        media.url AS media_url,
        media.uploaded_at AS media_uploaded_at
      FROM dances
      LEFT JOIN media ON dances.media_id = media.id
      WHERE dances.id = ?;`;

    const row = await db.get(query, [params.id]);

    if (!row) {
      return NextResponse.json({ error: "Dance not found" }, { status: 404 });
    }

    const dance = {
      id: row.dance_id,
      title: row.title,
      description: row.description || "",
      category_id: row.category_id,
      country_id: row.country_id,
      media: row.media_url ? [{ type: row.media_type, url: row.media_url }] : [],
      created_by: row.created_by,
      created_at: row.created_at
    };

    return NextResponse.json(dance);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}
