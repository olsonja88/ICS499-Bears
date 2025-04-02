import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Dance } from "@/lib/types";

export async function GET() {
  try {
    const db = await getDB();
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
      LEFT JOIN media ON dances.media_id = media.id;
    `;

    const rows = await db.all(query);

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
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  const db = await getDB();
  const body = await request.json();
  const { title, description, categoryId, countryId, createdBy } = body;
  
  try {
    const result = await db.run(
      `INSERT INTO dances (title, description, category_id, country_id, created_by) VALUES (?, ?, ?, ?, ?);`,
      [title, description, categoryId, countryId, createdBy]
    );

    const danceId = result.lastID;

    return NextResponse.json({
      success: true,
      danceId,
      message: "Dance created successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const db = await getDB();
  const body = await request.json();
  const { 
    id, 
    title, 
    description, 
    categoryId, 
    countryId, 
    createdBy, 
    mediaId 
  } = body;

  if (!title || !description || !categoryId || !countryId) {
    return NextResponse.json(
      { error: "Required fields are missing" },
      { status: 400 }
    );
  }
  
  try {
    const result = await db.run(
      `UPDATE dances 
       SET title = ?, 
           description = ?, 
           category_id = ?, 
           country_id = ?, 
           created_by = ?,
           media_id = ?
       WHERE id = ?;`,
      [title, description, categoryId, countryId, createdBy, mediaId, id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Dance not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dance replaced successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const db = await getDB();
  const body = await request.json();
  const { id, ...updates } = body;
  
  try {
    const updateFields = [];
    const values = [];
    
    if (updates.title !== undefined) {
      updateFields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.categoryId !== undefined) {
      updateFields.push('category_id = ?');
      values.push(updates.categoryId);
    }
    if (updates.countryId !== undefined) {
      updateFields.push('country_id = ?');
      values.push(updates.countryId);
    }
    if (updates.createdBy !== undefined) {
      updateFields.push('created_by = ?');
      values.push(updates.createdBy);
    }
    if (updates.mediaId !== undefined) {
      updateFields.push('media_id = ?');
      values.push(updates.mediaId);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(id);
    const query = `UPDATE dances SET ${updateFields.join(', ')} WHERE id = ?;`;
    const result = await db.run(query, values);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Dance not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dance updated successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const db = await getDB();
  const body = await request.json();
  const { id } = body;
  
  try {
    const result = await db.run(
      `DELETE FROM dances WHERE id = ?;`,
      [id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Dance not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Dance deleted successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}