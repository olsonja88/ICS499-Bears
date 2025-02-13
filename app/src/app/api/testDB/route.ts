import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const [rows]: any = await pool.query("SELECT 1 + 1 AS result");
        res.status(200).json({ success: true, result: rows[0].result });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, error: (error as Error).message });
    }
}