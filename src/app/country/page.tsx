"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DanceCard from "@/components/dance-card";
import { Dance } from "@/lib/types";

// Component that uses useSearchParams
const CountryDetailsContent = () => {
  const [description, setDescription] = useState("");
  const [dances, setDances] = useState<Dance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
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
        console.log(`Fetching data for country: ${countryName}`);
        
        // First, try to fetch the description from our database
        const dbDescriptionResponse = await fetch(`/api/countries/descriptions?name=${encodeURIComponent(countryName)}`);
        
        if (dbDescriptionResponse.ok) {
          // If we have a description in the database, use it
          const dbDescriptionData = await dbDescriptionResponse.json();
          setDescription(dbDescriptionData.description);
          setLastUpdated(dbDescriptionData.lastUpdated);
          console.log("Using description from database");
        } else {
          // If not in database, fetch from GenAI
          console.log("No description in database, fetching from GenAI");
          const genaiResponse = await fetch(`/api/countries/genai/${encodeURIComponent(countryName)}`);
          const genaiData = await genaiResponse.json();

          if (!genaiResponse.ok) {
            throw new Error(genaiData.error || "Failed to fetch country data");
          }

          setDescription(genaiData.description);
          
          // Store the GenAI response in our database
          console.log("Storing GenAI response in database");
          const saveResponse = await fetch('/api/countries/descriptions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              countryName,
              description: genaiData.description
            }),
          });
          
          if (!saveResponse.ok) {
            console.warn("Failed to save country description to database");
          }
        }
        
        // Fetch dances for this country
        console.log(`Fetching dances for country: ${countryName}`);
        try {
          const dancesResponse = await fetch(`/api/countries/dances/${encodeURIComponent(countryName)}`);
          
          if (!dancesResponse.ok) {
            const errorData = await dancesResponse.json();
            console.warn("Failed to fetch dances:", errorData.error);
            // Don't set error here, just log it - we still want to show the description
          } else {
            const dancesData = await dancesResponse.json();
            console.log(`Found ${dancesData.length} dances for ${countryName}`);
            setDances(dancesData);
          }
        } catch (danceError) {
          console.error("Error fetching dances:", danceError);
          // Don't set error here, just log it - we still want to show the description
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchCountryData:", err);
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
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">About {countryName?.replace(/_/g, " ")}</h2>
            <p className="text-gray-700 whitespace-pre-line">{description}</p>
            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-4">Last updated: {new Date(lastUpdated).toLocaleDateString()}</p>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Dances from {countryName?.replace(/_/g, " ")}</h2>
          
          {dances.length === 0 ? (
            <p className="text-gray-500">No dances found for this country.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dances.map((dance) => (
                <DanceCard 
                  key={dance.id} 
                  id={dance.id.toString()}
                  title={dance.title}
                  description={dance.description}
                  image={dance.url ?? "/placeholder.jpg"}
                  country={dance.country}
                  category={dance.category}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  </div>
);

// Main component with Suspense boundary
const CountryDetails = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CountryDetailsContent />
    </Suspense>
  );
};

export default CountryDetails;