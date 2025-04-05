"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L, { LeafletMouseEvent } from "leaflet";
import { useMapEvents } from "react-leaflet";

// Dynamic imports (for SSR-safe use of Leaflet components)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const countryFixes: Record<string, string> = {
  "United States": "United_States",
  "United Kingdom": "United_Kingdom",
  "Czechia": "Czech_Republic",
  "South Korea": "South_Korea",
  "North Korea": "North_Korea",
  "Democratic Republic of the Congo": "Democratic_Republic_of_the_Congo",
};

const customIcon = new L.Icon({
  iconUrl: "/map-pin.png", // Path to your custom marker image
  iconSize: [32, 32],          // or whatever your image size is
  iconAnchor: [10, 32],        // anchor the "pointy end" of the pin
  shadowSize:   [50, 64], // size of the shadow
  popupAnchor:  [-3, -76], // point from which the popup should open relative to the iconAnchor
  className: "custom-pin-icon"
});

type Country = {
  name: string;
  lat: number;
  lng: number;
  description?: string;
};

export default function MapsPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    fetch("/api/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error("Error loading countries:", err));
  }, []);

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
    <div className="flex flex-col items-center pt-16 h-screen">
      <h1 className="text-3xl font-bold mb-6">Click on a Country to See Dances</h1>

      <MapContainer
        center={[20, 0]}
        zoom={3}
        style={{
          height: "calc(100vh - 12rem)",
          width: "80%",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Render country markers */}
        {countries.map((country, i) => (
          <Marker
            key={i}
            position={[country.lat, country.lng]}
            icon = {customIcon}
            eventHandlers={{
              click: () => {
                const countryName = countryFixes[country.name] ?? country.name;
                router.push(`/country?name=${encodeURIComponent(countryName)}`);
              },
            }}
          >
            <Popup>
              <strong>{country.name}</strong>
              {country.description && <p>{country.description}</p>}
            </Popup>
          </Marker>
        ))}

        <MapClickHandler />
      </MapContainer>
    </div>
  );
}
