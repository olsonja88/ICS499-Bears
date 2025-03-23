"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import { LeafletMouseEvent } from "leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
import { useMapEvents } from "react-leaflet";

const countryFixes: Record<string, string> = {
  "United States": "United_States",
  "United Kingdom": "United_Kingdom",
  "Czechia": "Czech_Republic",
  "South Korea": "South_Korea",
  "North Korea": "North_Korea",
  "Democratic Republic of the Congo": "Democratic_Republic_of_the_Congo",
};

export default function MapsPage() {
  const router = useRouter();

  const gotoCountryPage = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();

      if (data.address && data.address.country) {
        let countryName = data.address.country;
        if (countryFixes[countryName]) {
          countryName = countryFixes[countryName];
        }

        router.push(`/country?name=${encodeURIComponent(countryName)}`);
      }
    } catch (error) {
      console.error("Error fetching country name:", error);
    }
  };

  function MapClickHandler() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        gotoCountryPage(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Click on a Country to See Dances</h1>

      <MapContainer
        center={[20, 0]}
        zoom={3}
        style={{ height: "500px", width: "80%", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}
