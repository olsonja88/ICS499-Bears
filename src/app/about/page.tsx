"use client";

import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <div
        className="relative w-full max-w-4xl bg-white shadow-md rounded-lg p-6"
        style={{
          backgroundImage: `url('/DALL·E 2025-03-16 22.58.15 - A colorful and vibrant logo for a cultural dance group website featuring dancers from around the world. The logo includes a globe at the center, with .webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-center mb-4 text-white">About Us</h1>
          <p className="text-lg text-gray-300 mb-4">
            Welcome to our application! This platform is dedicated to showcasing
            the beauty and diversity of dance from around the world. Our goal is
            to provide a space where users can explore, learn, and celebrate
            various dance styles, cultures, and traditions.
          </p>
          <p className="text-lg text-gray-300 mb-4">
            Whether you're a dance enthusiast, a professional, or just curious,
            we hope you find inspiration and joy in discovering the rich history
            and artistry of dance.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            Thank you for visiting our platform. If you have any questions or
            feedback, feel free to reach out to us!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
