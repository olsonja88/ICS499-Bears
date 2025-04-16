import { NextResponse } from "next/server";
import { getDB, executeQuerySingle, executeQuery } from "@/lib/db";
import { Dance } from "@/lib/types";

// Define the correct type for the context parameter
type RouteContext = {
  params: {
    name: string;
  };
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    if (!context.params || !context.params.name) {
      console.error("Missing country name parameter");
      return NextResponse.json(
        { error: "Country name is required" },
        { status: 400 }
      );
    }

    const countryName = context.params.name;
    console.log(`Fetching dances for country: ${countryName}`);
    
    // First, get the country ID from the name
    const countryQuery = `SELECT id FROM countries WHERE name = $1`;
    const country = await executeQuerySingle(countryQuery, [countryName]);
    
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
      WHERE countries.id = $1
      ORDER BY dances.created_at DESC;
    `;
    
    const dances = await executeQuery(query, [country.id]);
    
    return NextResponse.json(dances);
  } catch (error) {
    console.error("Error fetching dances:", error);
    return NextResponse.json(
      { error: "Failed to fetch dances for this country" },
      { status: 500 }
    );
  }
}