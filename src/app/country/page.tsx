"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CountryDetails = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const countryName = searchParams?.get("name");

  useEffect(() => {
    const fetchCountryData = async () => {
      if (!countryName) {
        setError("Country name is required");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/countries/genai/${countryName}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch country data");
        }

        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [countryName]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Dance Culture in {countryName?.replace(/_/g, " ")}
      </h1>
      
      {loading && (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{description}</p>
        </div>
      )}
    </div>
  );
};

export default CountryDetails;