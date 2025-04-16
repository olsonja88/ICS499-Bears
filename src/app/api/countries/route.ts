import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
    try {
        const countries = await executeQuery("SELECT * FROM countries");
        return NextResponse.json(countries);
    } catch (error) {
        console.error("GET Countries Error:", error);
        return NextResponse.json(
            { error: "Database error, failed to fetch countries", details: error },
            { status: 500 }
        );
    }
}