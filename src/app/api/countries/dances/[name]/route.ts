import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Dance } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    if (!params || !params.name) {
      console.error("Missing country name parameter");
      return NextResponse.json(
        { error: "Country name is required" },
        { status: 400 }
      );
    }

    const countryName = params.name;
    console.log(`Fetching dances for country: ${countryName}`);
    
    const db = await getDB();
    
    // First, get the country ID from the name
    const countryQuery = `SELECT id FROM countries WHERE name = ?`;
    const country = await db.get(countryQuery, [countryName]);
    
    if (!country) {
      console.error(`Country not found: ${countryName}`);
      return NextResponse.json(
        { error: `Country "${countryName}" not found` },
        { status: 404 }
      );
    }
    
    console.log(`Found country ID: ${country.id} for ${countryName}`);
    
    // Then, get all dances for this country
    const query = `
      SELECT 
        dances.id AS dance_id,
        dances.title,
        dances.description,
        dances.keywords,
        categories.name AS category,
        countries.name AS country,
        dances.created_by,
        dances.created_at,
        media.url AS media_url
      FROM dances
      LEFT JOIN categories ON dances.category_id = categories.id
      LEFT JOIN countries ON dances.country_id = countries.id
      LEFT JOIN media ON dances.media_id = media.id
      WHERE dances.country_id = ?;
    `;

    const rows = await db.all(query, [country.id]);
    console.log(`Found ${rows.length} dances for country ID ${country.id}`);

    const dances: Dance[] = rows.map(row => ({
      id: row.dance_id,
      title: row.title,
      description: row.description || "",
      keywords: row.keywords || "",
      category: row.category || "Unknown",
      country: row.country || "Unknown",
      categoryId: row.category_id || null,
      countryId: row.country_id || null,
      url: row.media_url || undefined,
      createdBy: row.created_by?.toString() || undefined
    }));

    return NextResponse.json(dances);
  } catch (error) {
    console.error("Error fetching dances by country:", error);
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}