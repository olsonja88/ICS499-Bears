"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Dance } from "@/lib/types"; // Import the shared type
import { Button } from "@/components/button"; // Import the Button component
import { getCurrentUser } from "@/lib/auth";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  username: string;
}

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);

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
          currentUser ? (
            currentUser.isAdmin || 
            currentUser.id === response.data.createdBy
          ) : false
        );

        // Fetch category name
        const categoryResponse = await axios.get(`/api/categories/${response.data.categoryId}`);
        setCategoryName(categoryResponse.data.name);

        // Fetch country name
        const countryResponse = await axios.get(`/api/countries/${response.data.countryId}`);
        setCountryName(countryResponse.data.name);

        // Fetch comments
        const commentsResponse = await axios.get(`/api/comments/${id}`);
        setComments(commentsResponse.data);
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
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
    };
  }, [dance?.url]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play().catch(err => console.log("Play prevented:", err));
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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
            <div className="aspect-w-16 aspect-h-9 relative">
              {isVideoUrl(dance.url) ? (
                <div className="relative">
                  <div className="cursor-pointer" onClick={togglePlayPause}>
                    <video
                      ref={videoRef}
                      src={dance.url}
                      loop
                      playsInline
                      className="rounded-lg w-full"
                      style={{ objectFit: "contain" }}
                    />
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <svg 
                          width="64" 
                          height="64" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="white" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center mt-2 p-2 bg-white bg-opacity-10 backdrop-blur-md rounded inline-flex">
                    <button onClick={toggleMute} className="mr-2 text-white">
                      {isMuted ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                          <line x1="23" y1="9" x2="17" y2="15"></line>
                          <line x1="17" y1="9" x2="23" y2="15"></line>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                        </svg>
                      )}
                    </button>
                    <div className="w-full">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
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

        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded">
          <h2 className="text-xl font-semibold mb-4 text-white">Comments</h2>
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-white border-opacity-10 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{comment.username}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DanceDetails;