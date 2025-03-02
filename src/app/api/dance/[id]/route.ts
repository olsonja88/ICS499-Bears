import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Dance ID is required" }, { status: 400 });
    }

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

    const row = await db.get(query, [id]);

    if (!row) {
      return NextResponse.json({ error: "Dance not found" }, { status: 404 });
    }

    const dance = {
      id: row.dance_id,
      title: row.title,
      description: row.description || "",
      categoryId: row.category_id,
      countryId: row.country_id,
      url: row.media_url || undefined,
      createdBy: row.created_by?.toString(),
      createdAt: row.created_at
    };

    return NextResponse.json(dance);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}
