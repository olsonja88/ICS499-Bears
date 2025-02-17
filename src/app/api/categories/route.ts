import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDB();
        const categories = await db.all("SELECT * FROM categories");
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            {error: "Database error", details: error },
            { status: 500 }
        );
    }
}