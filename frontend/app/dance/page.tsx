import DanceLayout from "../../components/dance-layout";
import DanceCard from "../../components/dance-card";
import Header from "../../components/header";

const dances = [
  {
    title: "Flamenco",
    description: "A passionate and expressive dance from Spain",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Bharatanatyam",
    description: "A classical Indian dance originating from Tamil Nadu",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Salsa",
    description: "A lively Latin dance with Cuban and Puerto Rican origins",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Ballet",
    description:
      "A graceful and technical dance form from the Italian Renaissance",
    image: "/placeholder.svg?height=200&width=300",
  },
];

export default function DancePage() {
  return (
    <>
      <Header />
      <DanceLayout backgroundImage="/placeholder.svg?height=1080&width=1920">
        <div className="pt-20">
          <h1 className="text-4xl font-bold text-white mb-8">
            Explore Cultural Dances
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dances.map((dance, index) => (
              <DanceCard key={index} {...dance} />
            ))}
          </div>
        </div>
      </DanceLayout>
    </>
  );
}
