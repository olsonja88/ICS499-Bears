"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Dance } from "@/lib/types"; // Import the shared type
import { Button } from "@/components/button"; // Import the Button component
import { getCurrentUser } from "@/lib/auth";

function isVideoUrl(url: string): boolean {
  return url.match(/\.(mp4|webm|ogg)$/) !== null;
}

const DanceDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dance, setDance] = useState<Dance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [countryName, setCountryName] = useState<string>("");
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    
    const fetchDanceDetails = async () => {
      try {
        const response = await axios.get(`/api/dance/${id}`, {
          signal: controller.signal,
        });
        setDance(response.data);

        // Check if current user can edit this dance
        const currentUser = getCurrentUser();
        setCanEdit(
          currentUser?.isAdmin || 
          (currentUser?.id === response.data.createdBy)
        );

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

  useEffect(() => {
    if (!videoRef.current || !dance?.url || !isVideoUrl(dance.url)) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(err => console.log("Autoplay prevented:", err));
        } else {
          videoRef.current?.pause();
        }
      });
    }, options);

    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
    };
  }, [dance?.url]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dance) return <div>No dance details found.</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{dance.title}</h1>
          {canEdit && (
            <Button
              onClick={() => router.push(`/dance/edit/${dance.id}`)}
              className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full font-semibold transition-colors"
            >
              Edit Dance
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <p className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded">
            <strong>Country:</strong> {countryName}
          </p>
          <p className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded">
            <strong>Category:</strong> {categoryName}
          </p>
        </div>

        <div className="mb-8">
          {dance.url ? (
            <div className="aspect-w-16 aspect-h-9">
              {isVideoUrl(dance.url) ? (
                <video
                  ref={videoRef}
                  src={dance.url}
                  controls
                  muted
                  loop
                  playsInline
                  className="rounded-lg w-full h-full"
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <img
                  src={dance.url}
                  alt={dance.title}
                  className="rounded-lg object-cover w-full h-full"
                />
              )}
            </div>
          ) : (
            <div className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded">
              No media available.
            </div>
          )}
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Description</h2>
          <p>{dance.description}</p>
        </div>

        {/* Comments section can be added here once implemented */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded">
          <h2 className="text-xl font-semibold mb-4 text-white">Comments</h2>
          <p>Comments feature coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default DanceDetails;
