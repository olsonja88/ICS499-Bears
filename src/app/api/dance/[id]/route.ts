import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Dance } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDB();
    const query = `SELECT 
      dances.id AS dance_id,
      dances.title,
      dances.description,
      dances.keywords,
      dances.category_id,
      dances.country_id,
      dances.created_by,
      dances.created_at,
      media.id AS media_id,
      media.type AS media_type,
      media.url AS media_url,
      media.uploaded_at AS media_uploaded_at,
      categories.name AS category_name,
      countries.name AS country_name
      FROM dances
      LEFT JOIN media ON dances.media_id = media.id
      LEFT JOIN categories ON dances.category_id = categories.id
      LEFT JOIN countries ON dances.country_id = countries.id
      WHERE dances.id = ?;`;

    const row = await db.get(query, [params.id]);

    if (!row) {
      return NextResponse.json(
        { error: "Dance not found" },
        { status: 404 }
      );
    }

    const dance: Dance = {
      id: row.dance_id,
      title: row.title,
      description: row.description || "",
      keywords: row.keywords || "",
      categoryId: row.category_id,
      countryId: row.country_id,
      category: row.category_name,
      country: row.country_name,
      url: row.media_url || undefined,
      createdBy: row.created_by?.toString() || undefined
    };

    return NextResponse.json(dance);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}
