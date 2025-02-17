import Image from "next/image";

interface ContentSectionProps {
  title: string;
  content: string;
  imageUrl: string;
  reverse?: boolean;
}

export default function ContentSection({
  title,
  content,
  imageUrl,
  reverse = false,
}: ContentSectionProps) {
  return (
    <section
      className={`relative min-h-screen flex items-center ${
        reverse ? "bg-gray-100" : "bg-white"
      }`}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex ${
          reverse ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className="w-1/2">
          {/* This div is intentionally left empty to create space */}
        </div>
        <div className="w-1/2 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-gray-700">{content}</p>
        </div>
      </div>
    </section>
  );
}
