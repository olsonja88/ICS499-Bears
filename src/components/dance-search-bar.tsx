"use client";

import React from "react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  searchField: string;
  onSearchFieldChange: (value: string) => void;
}

export default function DanceSearchBar({
  search,
  onSearchChange,
  searchField,
  onSearchFieldChange,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-8 mt-16 px-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder={`Search by ${searchField}...`}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Search Field Selector */}
      <select
        value={searchField}
        onChange={(e) => onSearchFieldChange(e.target.value)}
        className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-44 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
      >
        <option value="title">Title</option>
        <option value="description">Description</option>
        <option value="category">Category</option>
        <option value="country">Country</option>
      </select>
    </div>
  );
}
