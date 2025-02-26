import Image from "next/image";
import Link from "next/link"; // Import Link from Next.js
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

interface DanceCardProps {
  id: string; // Added dance ID
  title: string;
  description: string;
  image: string;
}

export default function DanceCard({ id, title, description, image }: DanceCardProps) {
  console.log("Dance Data in DanceCard:", { id, title });
  return (
    <Card className="bg-white bg-opacity-80 backdrop-blur-sm transition-all hover:bg-opacity-90 flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <Image
          src={image || "/placeholder.jpg"}
          alt={title}
          width={600}
          height={0}
          style={{ objectFit: "contain" }}
          className="rounded-md"
        />
      </CardContent>
      <CardFooter>
        {/* Link to Dance Details page */}
        <Link href={`/dance/${id}`} passHref>
          <Button variant="outline" className="w-full">
            Learn More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
