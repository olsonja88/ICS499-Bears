"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Dance {
  title: string;
  country: string;
  category: string;
  media: { type: string; url: string; description?: string }[];
  description: string;
  comments: { author: string; text: string }[];
}

const DanceDetails = () => {
  const { id } = useParams(); // Get dance ID from URL
  const [dance, setDance] = useState<Dance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // Prevent fetching if ID is undefined

    const controller = new AbortController();
    const fetchDanceDetails = async () => {
      try {
        // Updated endpoint: use "/api/dance/${id}" (singular) to match your list endpoint.
        const response = await axios.get(`/api/dance/${id}`, {
          signal: controller.signal,
        });
        setDance(response.data as Dance);
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
    <div className="dance-details">
      <h1>{dance.title}</h1>
      <p>
        <strong>Country:</strong> {dance.country}
      </p>
      <p>
        <strong>Category:</strong> {dance.category}
      </p>

      <div className="dance-media">
        {dance.media && dance.media.length > 0 ? (
          dance.media.map((mediaItem, index) => (
            <div key={index} className="media-item">
              {mediaItem.type === "video" ? (
                <video controls src={mediaItem.url} />
              ) : (
                <img
                  src={mediaItem.url}
                  alt={mediaItem.description || dance.title}
                />
              )}
            </div>
          ))
        ) : (
          <p>No media available.</p>
        )}
      </div>

      <div className="dance-description">
        <p>{dance.description}</p>
      </div>

      <div className="dance-comments">
        <h2>Comments</h2>
        {dance.comments && dance.comments.length > 0 ? (
          dance.comments.map((comment, index) => (
            <div key={index} className="comment">
              <p>
                <strong>{comment.author}</strong>: {comment.text}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default DanceDetails;
