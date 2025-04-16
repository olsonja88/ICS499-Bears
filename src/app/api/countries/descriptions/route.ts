import { NextResponse } from "next/server";
import { executeQuerySingle, executeQueryRun } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { countryName, description } = await request.json();
    
    if (!countryName || !description) {
      return NextResponse.json(
        { error: "Country name and description are required" },
        { status: 400 }
      );
    }
    
    // First, get the country ID from the name
    const countryQuery = `SELECT id FROM countries WHERE name = ?`;
    const country = await executeQuerySingle(countryQuery, [countryName]);
    
    if (!country) {
      return NextResponse.json(
        { error: `Country "${countryName}" not found` },
        { status: 404 }
      );
    }
    
    // Check if a description already exists for this country
    const existingQuery = `SELECT id FROM country_descriptions WHERE country_id = ?`;
    const existing = await executeQuerySingle(existingQuery, [country.id]);
    
    if (existing) {
      // Update the existing description
      await executeQueryRun(
        `UPDATE country_descriptions SET description = ?, last_updated = CURRENT_TIMESTAMP WHERE country_id = ?`,
        [description, country.id]
      );
    } else {
      // Insert a new description
      await executeQueryRun(
        `INSERT INTO country_descriptions (country_id, description) VALUES (?, ?)`,
        [country.id, description]
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Country description saved successfully"
    });
  } catch (error) {
    console.error("Error saving country description:", error);
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryName = searchParams.get("name");
    
    if (!countryName) {
      return NextResponse.json(
        { error: "Country name is required" },
        { status: 400 }
      );
    }
    
    // Get the country ID from the name
    const countryQuery = `SELECT id FROM countries WHERE name = ?`;
    const country = await executeQuerySingle(countryQuery, [countryName]);
    
    if (!country) {
      return NextResponse.json(
        { error: `Country "${countryName}" not found` },
        { status: 404 }
      );
    }
    
    // Get the description for this country
    const descriptionQuery = `
      SELECT description, last_updated 
      FROM country_descriptions 
      WHERE country_id = ?
    `;
    const description = await executeQuerySingle(descriptionQuery, [country.id]);
    
    if (!description) {
      return NextResponse.json(
        { error: `No description found for "${countryName}"` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      description: description.description,
      lastUpdated: description.last_updated
    });
  } catch (error) {
    console.error("Error fetching country description:", error);
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
} 