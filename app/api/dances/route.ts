import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const [rows]: any = await pool.query("SELECT * FROM dances");
            res.status(200).json(rows);
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}