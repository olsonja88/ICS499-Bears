import { NextResponse } from "next/server";
import { executeQuery, executeQueryRun } from "@/lib/db";

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
        const users: User[] = await executeQuery("SELECT id, username, email, role FROM users");
        return NextResponse.json(users);
    } catch (error) {
        console.error("GET Users Error:", error);
        return NextResponse.json(
            { error: "Database error, failed to fetch users", details: error },
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

        const result = await executeQueryRun(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
            [username, email, password_hash, role]
        );

        return NextResponse.json(
            { message: "User created successfully!", userId: result.lastID },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST User Error:", error);
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

        const result = await executeQueryRun(
            "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?",
            [username, email, role, id]
        );

        if (result.changes === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully!" });
    } catch (error) {
        console.error("PUT User Error:", error);
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

        const result = await executeQueryRun("DELETE FROM users WHERE id = ?", [id]);

        if (result.changes === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully!" });
    } catch (error) {
        console.error("DELETE User Error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
