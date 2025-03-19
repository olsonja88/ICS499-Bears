"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DanceCard from "@/components/dance-card";

interface Dance {
  title: string;
  description: string;
  url?: string;
}

export default function CountryDancesPage() {
  const { country } = useParams();
  const [dances, setDances] = useState<Dance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDances = async () => {
      try {
        console.log(`Fetching dances for: ${country} from DBpedia`);

        // ✅ Try fetching dance data from DBpedia
        const sparqlQuery = `
          PREFIX dbo: <http://dbpedia.org/ontology/>
          PREFIX dbp: <http://dbpedia.org/property/>
          SELECT ?dance ?label ?description ?image WHERE {
            ?dance dbo:genre <http://dbpedia.org/resource/Folk_dance> ;
                   dbp:country dbr:${encodeURIComponent(country as string)} ;
                   rdfs:label ?label ;
                   dbo:abstract ?description .
            OPTIONAL { ?dance dbo:thumbnail ?image }
            FILTER (lang(?label) = 'en' && lang(?description) = 'en')
          }
          LIMIT 5
        `;

        const encodedQuery = encodeURIComponent(sparqlQuery);
        const dbpediaEndpoint = `https://dbpedia.org/sparql?query=${encodedQuery}&format=json`;

        const dbpediaResponse = await fetch(dbpediaEndpoint);
        if (!dbpediaResponse.ok) throw new Error("Failed to fetch DBpedia data");

        const dbpediaData = await dbpediaResponse.json();
        const dbpediaResults = dbpediaData.results.bindings;

        if (dbpediaResults.length > 0) {
          console.log("DBpedia Data Found:", dbpediaResults);

          const formattedDances: Dance[] = dbpediaResults.map((result: any) => ({
            title: result.label.value,
            description: result.description.value,
            url: result.image ? result.image.value : "/placeholder.jpg",
          }));

          setDances(formattedDances);
          return;
        }

        // ❌ No DBpedia data? Try Wikipedia API
        console.warn("No DBpedia data found. Trying Wikipedia...");
        const encodedCountry = encodeURIComponent(country as string);
        const wikiEndpoints = [
          `https://en.wikipedia.org/api/rest_v1/page/summary/Dances_of_${encodedCountry}`,
          `https://en.wikipedia.org/api/rest_v1/page/summary/Traditional_dances_of_${encodedCountry}`,
          `https://en.wikipedia.org/api/rest_v1/page/summary/Folk_dance_of_${encodedCountry}`,
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedCountry}_dance`,
          `https://en.wikipedia.org/api/rest_v1/page/summary/List_of_dances_of_${encodedCountry}`
        ];

        let foundWikiData = null;

        for (const url of wikiEndpoints) {
          const response = await fetch(url);
          if (response.ok) {
            const wikiData = await response.json();

            // Ensure it's dance-related and not generic culture
            if (!wikiData.extract.toLowerCase().includes("culture")) {
              foundWikiData = wikiData;
              break;
            }
          }
        }

        if (foundWikiData) {
          console.log("Wikipedia Data Found:", foundWikiData);
          setDances([
            {
              title: foundWikiData.title,
              description: foundWikiData.extract,
              url: foundWikiData.thumbnail ? foundWikiData.thumbnail.source : "/placeholder.jpg",
            },
          ]);
          return;
        }

        // ❌ No Wikipedia data? Try a Wikipedia search
        console.warn("No Wikipedia summary found. Trying Wikipedia search...");

        const wikiSearchEndpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodedCountry}+traditional+dance`;

        const searchResponse = await fetch(wikiSearchEndpoint);
        const searchData = await searchResponse.json();

        if (searchData.query.search.length > 0) {
          const firstResult = searchData.query.search[0];
          const pageTitle = firstResult.title;

          const pageSummaryEndpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
          const summaryResponse = await fetch(pageSummaryEndpoint);
          const summaryData = await summaryResponse.json();

          console.log("Wikipedia Search Data Found:", summaryData);
          setDances([
            {
              title: summaryData.title,
              description: summaryData.extract,
              url: summaryData.thumbnail ? summaryData.thumbnail.source : "/placeholder.jpg",
            },
          ]);
          return;
        }

        throw new Error("No Wikipedia dance data found.");
      } catch (err) {
        console.error(err);
        setError("No dance information found for this country.");
      } finally {
        setLoading(false);
      }
    };

    fetchDances();
  }, [country]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Dances of {decodeURIComponent(country as string)}</h1>

      {dances.length === 0 ? (
        <p>No dance information found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dances.map((dance, index) => (
            <DanceCard key={index} id={dance.title} title={dance.title} description={dance.description} image={dance.url || ""} />
          ))}
        </div>
      )}
    </div>
  );
}
