"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { useMediaOrientation } from "@/app/hooks/useMediaOrientation";

interface DanceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  country: string;
  category: string;
}

function isVideoUrl(url: string): boolean {
  return url.match(/\.(mp4|webm|ogg)$/i) !== null;
}

export default function DanceCard({
  id,
  title,
  description,
  image,
  country,
  category,
}: DanceCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldStretchImage, setShouldStretchImage] = useState(false);

  const isVideo = isVideoUrl(image);
  const orientation = useMediaOrientation(image); // portrait / landscape / null

  console.log(`[DanceCard:${title}] isVideo:`, isVideo);
  console.log(`[DanceCard:${title}] orientation:`, orientation);

  useEffect(() => {
    if (!videoRef.current || !isVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(`[${title}] Video in view — playing`);
            videoRef.current?.play().catch((err) =>
              console.log("Autoplay prevented:", err)
            );
            setIsPlaying(true);
          } else {
            console.log(`[${title}] Video out of view — pausing`);
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [image]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      console.log(`[${title}] Manual play`);
      videoRef.current.play().catch((err) => console.log("Play prevented:", err));
      setIsPlaying(true);
    } else {
      console.log(`[${title}] Manual pause`);
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (orientation === null) {
    console.log(`[DanceCard:${title}] Waiting for orientation...`);
    return (
      <Card className="bg-white bg-opacity-80 backdrop-blur-sm flex flex-col justify-between h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col px-4 h-[420px] items-center justify-center text-white text-sm">
          Loading preview...
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

  const mediaHeight = orientation === "portrait" ? "h-[350px]" : "h-[250px]";
  const mediaObject = orientation === "portrait" ? "object-contain" : "object-cover";
  const isPortrait = orientation === "portrait";

  console.log(`[DanceCard:${title}] Rendering as ${orientation}`);

  return (
    <Card className="bg-white bg-opacity-80 backdrop-blur-sm transition-all hover:bg-opacity-90 flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col px-4">
        <div className="flex flex-col justify-between h-[420px] w-full">
          <div
            className={`w-full ${mediaHeight} bg-black flex items-center justify-center overflow-hidden rounded-md`}
          >
            {isVideo ? (
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={togglePlayPause}
              >
                <video
                  ref={videoRef}
                  src={image}
                  muted
                  loop
                  playsInline
                  className={`h-full ${mediaObject} ${
                    isPortrait ? "w-auto" : "w-full"
                  }`}
                />
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
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
                      <polygon points="5 3 19 12 5 21 5 3" />
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
  className={`transition-all duration-300 ${
    shouldStretchImage
      ? "w-full h-full object-cover"
      : `w-auto ${mediaObject}`
  }`}
  onLoadingComplete={(img) => {
    const container = img.parentElement?.getBoundingClientRect();
    const imageWidth = img.naturalWidth;
    const imageHeight = img.naturalHeight;

    const containerWidth = container?.width || 0;
    const containerHeight = container?.height || 0;

    const isTooSmall =
      imageWidth < containerWidth * 0.9 || imageHeight < containerHeight * 0.9;

    console.log(`[${title}] image ${imageWidth}x${imageHeight}, container ${containerWidth}x${containerHeight}, tooSmall=${isTooSmall}`);

    setShouldStretchImage(isTooSmall);
  }}
/>

            )}
          </div>

          <p className="text-sm text-white text-center leading-snug shadow-md mt-2">
            {description.length > 250
              ? `${description.slice(0, 250)}...`
              : description}
          </p>
        </div>
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
