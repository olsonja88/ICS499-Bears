import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const [rows]: any = await pool.query("SELECT * FROM categories");
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}