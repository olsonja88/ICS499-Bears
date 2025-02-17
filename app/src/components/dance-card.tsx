import Image from "next/image";
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
  title: string;
  description: string;
  image: string;
}

export default function DanceCard({
  title,
  description,
  image,
}: DanceCardProps) {
  return (
    <Card className="bg-white bg-opacity-80 backdrop-blur-sm transition-all hover:bg-opacity-90">
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
    style={{ objectFit: 'fill' }}
    className="rounded-md"
  />
</CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
}
