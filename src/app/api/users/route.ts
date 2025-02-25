import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { Database } from "sqlite";


interface User {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    role?: "admin" | "creator" | "viewer";
}

// gets all users
export async function GET() {
    try {
        const db : Database = await getDB();
        const users: User[] = await db.all("SELECT id, username, email, role FROM users");
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            {error: "Database error, failed to fetch users", details: error },
            { status: 500 }
        );
    }
}

// POST (Create a user)
export async function POST(req: Request) {
    try {
        const { username, email, password_hash, role = "viewer" }: User = await req.json();
        if (!username || !email || !password_hash) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db: Database = await getDB();
        const result = await db.run(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
            [username, email, password_hash, role]
        );

        return NextResponse.json({ message: "User created successfully!", userId: result.lastID }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}

// PUT (Update a user)
export async function PUT(req: Request) {
    try {
        const { id, username, email, role }: User = await req.json();
        if (!id || !username || !email || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db: Database = await getDB();
        const result = await db.run(
            "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?",
            [username, email, role, id]
        );

        if (result.changes === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully!" });
    } catch {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

// DELETE (Delete a user)
export async function DELETE(req: Request) {
    try {
        const { id }: { id: number } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const db: Database = await getDB();
        const result = await db.run("DELETE FROM users WHERE id = ?", [id]);

        if (result.changes === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully!" });
    } catch {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}