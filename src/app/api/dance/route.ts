import { NextResponse } from "next/server";
import { executeQuery, executeQueryRun } from "@/lib/db";
import { Dance } from "@/lib/types";

export async function GET() {
  try {
    const query = `
      SELECT d.*, c.name as category_name, co.name as country_name 
      FROM dances d
      LEFT JOIN categories c ON d.category_id = c.id
      LEFT JOIN countries co ON d.country_id = co.id
    `;
    const rows = await executeQuery(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET Dances Error:", error);
    return NextResponse.json(
      { error: "Database error, failed to fetch dances", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, categoryId, countryId, createdBy } = body;
  
  try {
    const result = await executeQueryRun(
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
    console.error("POST Dance Error:", error);
    return NextResponse.json(
      { error: "Database error, failed to create dance", details: error },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    const result = await executeQueryRun(
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
    console.error("PUT Dance Error:", error);
    return NextResponse.json(
      { error: "Database error, failed to update dance", details: error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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
    const result = await executeQueryRun(query, values);

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
    console.error("PATCH Dance Error:", error);
    return NextResponse.json(
      { error: "Database error, failed to update dance", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  
  try {
    const result = await executeQueryRun(
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
    console.error("DELETE Dance Error:", error);
    return NextResponse.json(
      { error: "Database error, failed to delete dance", details: error },
      { status: 500 }
    );
  }
}