import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Dance } from "@/lib/types";

export async function GET() {
  try {
    const db = await getDB();
    const query = `SELECT 
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
      LEFT JOIN media ON dances.media_id = media.id;`;

      const rows = await db.all(query);

    const dances: Dance[] = rows.map(row => ({
      id: row.dance_id, 
      title: row.title,
      description: row.description || "",
      url: row.media_url || undefined
    }));

    return NextResponse.json(dances);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}
