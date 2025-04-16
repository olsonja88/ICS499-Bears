import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
    try {
        const media = await executeQuery("SELECT * FROM media");
        return NextResponse.json(media);
    } catch (error) {
        console.error("GET Media Error:", error);
        return NextResponse.json(
            { error: "Database error, failed to fetch media", details: error },
            { status: 500 }
        );
    }
}