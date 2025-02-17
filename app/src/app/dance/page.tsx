import DanceLayout from "@/components/dance-layout";
import DanceCard from "@/components/dance-card";
import Header from "@/components/header";
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
      <Header />
      <DanceLayout backgroundImage="/placeholder.svg?height=1080&width=1920">
        <div className="pt-20 flex flex-wrap gap-4">
          {/* Column 1 */}
          <div className="w-full sm:w-1/2 lg:w-1/3">
            {dances.map((dance: Dance, index: number) => {
              if (index % 3 === 0) {
                return (
                  <DanceCard
                    key={dance.id}
                    title={dance.title}
                    description={dance.description}
                    image={dance.url ?? "/placeholder.jpg"}
                  />
                );
              }
              return null;
            })}
          </div>

          {/* Column 2 */}
          <div className="w-full sm:w-1/2 lg:w-1/3">
            {dances.map((dance: Dance, index: number) => {
              if (index % 3 === 1) {
                return (
                  <DanceCard
                    key={dance.id}
                    title={dance.title}
                    description={dance.description}
                    image={dance.url ?? "/placeholder.jpg"}
                  />
                );
              }
              return null;
            })}
          </div>
          
          {/* Column 3 */}
          <div className="w-full sm:w-1/2 lg:w-1/3">
            {dances.map((dance: Dance, index: number) => {
              if (index % 3 === 2) {
                return (
                  <DanceCard
                    key={dance.id}
                    title={dance.title}
                    description={dance.description}
                    image={dance.url ?? "/placeholder.jpg"}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      </DanceLayout>
      <div className="flex justify-center mt-10 mb-10">
        <Chatbot />
      </div>
    </>
  );
}
