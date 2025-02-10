import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: "Database error", details: error });
    }
  } else if (req.method === "POST") {
    try {
      const { name, email } = req.body;

      const [result]: any = await pool.query(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email]
      );

      res.status(201).json({ id: result.insertId, name, email });
    } catch (error) {
      res.status(500).json({ error: "Database insert failed", details: error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
