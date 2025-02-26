"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Dance } from "@/lib/types"; // Import the shared type

const DanceDetails = () => {
  const { id } = useParams();
  const [dance, setDance] = useState<Dance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [countryName, setCountryName] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    
    const fetchDanceDetails = async () => {
      try {
        const response = await axios.get(`/api/dance/${id}`, {
          signal: controller.signal,
        });
        setDance(response.data);

        // Fetch category name
        const categoryResponse = await axios.get(`/api/categories/${response.data.categoryId}`);
        setCategoryName(categoryResponse.data.name);

        // Fetch country name
        const countryResponse = await axios.get(`/api/countries/${response.data.countryId}`);
        setCountryName(countryResponse.data.name);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error("Error fetching dance details:", err);
          setError("Failed to load dance details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDanceDetails();

    return () => {
      controller.abort();
    };
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dance) return <div>No dance details found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{dance.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <p className="bg-gray-800 p-4 rounded">
            <strong>Country:</strong> {countryName}
          </p>
          <p className="bg-gray-800 p-4 rounded">
            <strong>Category:</strong> {categoryName}
          </p>
        </div>

        <div className="mb-8">
          {dance.url ? (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={dance.url}
                alt={dance.title}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded">
              No media available.
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded mb-8">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p>{dance.description}</p>
        </div>

        {/* Comments section can be added here once implemented */}
        <div className="bg-gray-800 p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <p>Comments feature coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default DanceDetails;
