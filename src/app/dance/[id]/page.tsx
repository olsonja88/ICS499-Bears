"use client";

import { useSearchParams } from "next/navigation";

export default function DanceDetailsPage() {
  const searchParams = useSearchParams();

  const dance = {
    title: searchParams.get("title") || "Unknown Dance",
    description: searchParams.get("description") || "No description available.",
    image: searchParams.get("image") || "/placeholder.jpg",
    country: searchParams.get("country") || "Unknown",
    category: searchParams.get("category") || "Uncategorized",
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{dance.title}</h1>
      <p><strong>Country:</strong> {dance.country}</p>
      <p><strong>Category:</strong> {dance.category}</p>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold mb-2">Description</h2>
        <p>{dance.description}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold mb-2">Image</h2>
        <img src={dance.image} alt={dance.title} className="w-full max-w-lg rounded-md" />
      </div>
    </div>
  );
}
