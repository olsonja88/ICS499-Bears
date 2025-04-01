"use client";

import React, { useEffect, useState } from "react";
import DanceLayout from "@/components/dance-layout";
import DanceCard from "@/components/dance-card";
import Chatbot from "@/components/chatbot";
import DanceSearchBar from "@/components/dance-search-bar";
import { Dance } from "@/lib/types";

export default function DancePage() {
  const [dances, setDances] = useState<Dance[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    async function fetchDances() {
      try {
        const res = await fetch("http://localhost:3000/api/dance");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDances(data);
      } catch (error) {
        console.error("Error fetching dances:", error);
      }
    }

    fetchDances();
  }, []);

  const categories = [...new Set(dances.map((d) => d.category))].sort();
  const countries = [...new Set(dances.map((d) => d.country))].sort();

  const filteredDances = dances.filter((dance) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      dance.title.toLowerCase().includes(searchLower) ||
      dance.description.toLowerCase().includes(searchLower) ||
      dance.keywords?.toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategory === "" || dance.category === selectedCategory;

    const matchesCountry =
      selectedCountry === "" || dance.country === selectedCountry;

    return matchesSearch && matchesCategory && matchesCountry;
  });

  return (
    <>
      <DanceLayout backgroundImage="/placeholder.svg?height=1080&width=1920">
        <DanceSearchBar
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          categories={categories}
          countries={countries}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {filteredDances.length > 0 ? (
            filteredDances.map((dance) => (
              <DanceCard
                key={dance.id}
                id={dance.id.toString()}
                title={dance.title}
                description={dance.description}
                image={dance.url ?? "/placeholder.jpg"}
                country={dance.country}
                category={dance.category}
              />
            ))
          ) : (
            <p className="text-center col-span-full">No dances found.</p>
          )}
        </div>
      </DanceLayout>

      <div className="flex justify-center mt-10 mb-10">
        <Chatbot />
      </div>
    </>
  );
}
