import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDB();
        const users = await db.all("SELECT * FROM users");
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            {error: "Database error", details: error },
            { status: 500 }
        );
    }
}