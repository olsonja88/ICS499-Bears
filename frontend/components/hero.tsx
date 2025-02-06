export default function Hero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
      >
        <source src="/placeholder.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="z-10 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Experience Cultural Dance</h1>
        <p className="text-xl mb-8">
          Discover the beauty of global dance traditions
        </p>
        <button className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200 transition duration-300">
          Explore Dances
        </button>
      </div>
    </div>
  );
}
