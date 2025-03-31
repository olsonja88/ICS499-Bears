"use client";

import React from "react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  categories: string[];
  countries: string[];
}

export default function DanceSearchBar({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCountry,
  onCountryChange,
  categories,
  countries,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-8 mt-16 px-4">
      {/* Search Input - Title + Description */}
      <input
        type="text"
        placeholder="Search title or description..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-44 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Country Filter */}
      <select
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-44 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
      >
        <option value="">All Countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
}
