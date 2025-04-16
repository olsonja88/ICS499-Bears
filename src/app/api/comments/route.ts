import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
    try {
        const comments = await executeQuery("SELECT * FROM comments");
        return NextResponse.json(comments);
    } catch (error) {
        console.error("GET Comments Error:", error);
        return NextResponse.json(
            { error: "Database error, failed to fetch comments", details: error },
            { status: 500 }
        );
    }
}