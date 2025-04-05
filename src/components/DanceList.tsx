"use client";

import { useEffect, useState } from "react";
import { Dance } from "@/lib/types";
import { Button } from "./button";
import Link from "next/link";

export default function DanceList() {
    const [dances, setDances] = useState<Dance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDances = async () => {
            try {
                const response = await fetch("/api/dance");
                if (!response.ok) throw new Error("Failed to fetch dances");
                const data = await response.json();
                setDances(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load dances");
            } finally {
                setLoading(false);
            }
        };

        fetchDances();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this dance?")) return;

        try {
            const response = await fetch(`/api/dance/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete dance");

            setDances(dances.filter(dance => dance.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete dance");
        }
    };

    if (loading) return <p className="text-white">Loading dances...</p>;
    if (error) return <p className="text-red-400">{error}</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Dance Management</h2>
                <Link href="/dance/create">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Add New Dance
                    </Button>
                </Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-black border border-gray-700">
                    <thead>
                        <tr className="bg-gray-900">
                            <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-300">Title</th>
                            <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-300">Category</th>
                            <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-300">Country</th>
                            <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dances.map((dance) => (
                            <tr key={dance.id} className="hover:bg-gray-900 border-b border-gray-700">
                                <td className="px-6 py-4 text-gray-300">{dance.title}</td>
                                <td className="px-6 py-4 text-gray-300">{dance.category}</td>
                                <td className="px-6 py-4 text-gray-300">{dance.country}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <Link href={`/dance/edit/${dance.id}`}>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            onClick={() => handleDelete(dance.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 