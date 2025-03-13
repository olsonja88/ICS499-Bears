"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { useEffect, useRef } from "react";
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
  country: string;
  category: string;
}

function isVideoUrl(url: string): boolean {
  return url.match(/\.(mp4|webm|ogg)$/) !== null;
}

export default function DanceCard({ id, title, description, image }: DanceCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
        } else {
          videoRef.current?.pause();
        }
      });
    }, options);

    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
    };
  }, [image]);

  console.log("Dance Data in DanceCard:", { id, title });

  // 🔹 Convert dance details into a URL-friendly string
  const queryString = new URLSearchParams({
    title,
    description,
    image,
    country,
    category,
  }).toString();

  return (
    <Card className="bg-white bg-opacity-80 backdrop-blur-sm transition-all hover:bg-opacity-90 flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {image ? (
          isVideoUrl(image) ? (
            <video
              ref={videoRef}
              src={image}
              controls
              muted
              loop
              playsInline
              className="rounded-md max-w-full"
              style={{ maxHeight: "400px" }}
            />
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
        {/* 🔹 Pass dance data in the URL */}
        <Link href={`/dance/${id}?${queryString}`} passHref>
          <Button variant="outline" className="w-full">
            Learn More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
