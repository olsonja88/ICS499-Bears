import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
    try {
        const categories = await executeQuery("SELECT * FROM categories");
        return NextResponse.json(categories);
    } catch (error) {
        console.error("GET Categories Error:", error);
        return NextResponse.json(
            { error: "Database error, failed to fetch categories", details: error },
            { status: 500 }
        );
    }
}