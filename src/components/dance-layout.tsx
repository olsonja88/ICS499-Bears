import Image from "next/image";
import type { ReactNode } from "react";

interface DanceLayoutProps {
  children: ReactNode;
  backgroundImage: string;
}

export default function DanceLayout({
  children,
  backgroundImage,
}: DanceLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        {/*  Temporarily commented out to get rid of text in corner. Can uncomment once we have an image
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt="Dance background"
          fill
          objectFit="cover"
          quality={100}
          priority
        />
        */}
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-20">
        <div className="container mx-auto px-4 py-8 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
