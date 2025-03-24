"use client";

import React from "react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function DanceSearchBar({ search, onSearchChange }: Props) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 mt-16 px-4">
      <input
        type="text"
        placeholder="Search dances..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border px-4 py-2 rounded w-full md:w-1/2"
      />
    </div>
  );
}
