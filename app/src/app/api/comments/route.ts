import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDB();
        const comments = await db.all("SELECT * FROM comments");
        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json(
            {error: "Database error", details: error },
            { status: 500 }
        );
    }
}