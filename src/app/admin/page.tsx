"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login"); // Redirect if no token
                return;
            }

            const response = await fetch("/api/auth/protected", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setIsAdmin(true);
            } else {
                router.push("/"); // Redirect if not an admin
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) return <p>Loading...</p>;
    if (!isAdmin) return null;

    return (
        <div>
            <h1>Admin Panel</h1>
            <p>Welcome, Admin!</p>
        </div>
    );
}
