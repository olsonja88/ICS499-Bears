import DanceLayout from "@/components/dance-layout";
import DanceCard from "@/components/dance-card";
import Chatbot from "@/components/chatbot";
import { Dance } from "@/lib/types";

async function getDances(): Promise<Dance[]> {
  try {
    const res = await fetch("http://localhost:3000/api/dance");

    if (!res.ok) {
      console.error("API error:", res.status, res.statusText);
      return []; // Return empty array if API is unavailable
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // Return empty array if fetch fails (e.g., server down)
  }
}

export default async function DancePage() {
  const dances: Dance[] = await getDances();

  return (
    <>
      <DanceLayout backgroundImage="/placeholder.svg?height=1080&width=1920">
        <div className="pt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dances.map((dance: Dance) => (
            <DanceCard
              key={dance.id}
              title={dance.title}
              description={dance.description}
              image={dance.url ?? "/placeholder.jpg"}
            />
          ))}
        </div>
      </DanceLayout>
      <div className="flex justify-center mt-10 mb-10">
        <Chatbot />
      </div>
    </>
  );
}
