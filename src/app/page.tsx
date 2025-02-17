import Header from "@/components/header";
import Hero from "@/components/hero";
import ContentSection from "@/components/content-section";
import Chatbot from "@/components/chatbot";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ContentSection
        title="Discover Cultural Dances"
        content="Immerse yourself in the rich tapestry of global dance traditions. From the vibrant moves of Samba to the graceful steps of Bharatanatyam, our platform celebrates the diversity of cultural expression through dance."
        imageUrl="https://olsonja88.github.io/ICS499-Bears/assets/testimg1.jpg"
      />
      <ContentSection
        title="Learn from Masters"
        content="Connect with world-renowned dance instructors and learn authentic techniques. Our expert-led workshops bring the essence of cultural dances right to your screen."
        imageUrl="https://olsonja88.github.io/ICS499-Bears/assets/testimg2.jpg"
        reverse
      />
      {/* Chatbot Section */}
      <div className="flex justify-center mt-10 mb-10">
        <Chatbot />
      </div>
    </main>
  );
}
