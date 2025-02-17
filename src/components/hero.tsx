import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <Image src="https://olsonja88.github.io/ICS499-Bears/assets/testimg3.jpg" alt="Background" fill style={{ objectFit: "cover" }}/>
      <div className="z-10 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Experience Cultural Dance</h1>
        <p className="text-xl mb-8">
          Discover the beauty of global dance traditions
        </p>

        <Link href="/dance">
          <button className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200 transition duration-300">
            Explore Dances
          </button>
        </Link>
      </div>
    </div>
  );
}
