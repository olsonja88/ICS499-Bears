"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

interface DanceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
}

function isVideoUrl(url: string): boolean {
  return url.match(/\.(mp4|webm|ogg)$/) !== null;
}

export default function DanceCard({ id, title, description, image }: DanceCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !isVideoUrl(image)) return;

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
  }, [image]);

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

  console.log("Dance Data in DanceCard:", { id, title });
  return (
    <Card className="bg-white bg-opacity-80 backdrop-blur-sm transition-all hover:bg-opacity-90 flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {image ? (
          isVideoUrl(image) ? (
            <div className="relative cursor-pointer" onClick={togglePlayPause}>
              <video
                ref={videoRef}
                src={image}
                muted
                loop
                playsInline
                className="rounded-md max-w-full"
                style={{ maxHeight: "400px" }}
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
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
          ) : (
            <Image
              src={image}
              alt={title}
              width={600}
              height={0}
              style={{ objectFit: "contain" }}
              className="rounded-md"
            />
          )
        ) : (
          <Image
            src="/placeholder.jpg"
            alt={title}
            width={600}
            height={0}
            style={{ objectFit: "contain" }}
            className="rounded-md"
          />
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/dance/${id}`} passHref>
          <Button variant="outline" className="w-full">
            Learn More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}